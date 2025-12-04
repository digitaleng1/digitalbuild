import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Row, Col, Button, Spinner, Form, Alert } from 'react-bootstrap';
import projectService from '@/services/projectService';
import type { ProjectDto } from '@/types/project';
import { ProjectStatus } from '@/types/project';

const DEBOUNCE_DELAY = 500;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Helper function to get human-readable status
const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    'QuotePending': 'Quote Pending',
    'Draft': 'Draft',
    'QuoteSubmitted': 'Quote Submitted',
    'QuoteAccepted': 'Quote Accepted',
    'QuoteRejected': 'Quote Rejected',
    'InitialPaymentPending': 'Initial Payment Pending',
    'InitialPaymentComplete': 'Initial Payment Complete',
    'InProgress': 'In Progress',
    'Completed': 'Completed',
    'Cancelled': 'Cancelled'
  };
  return statusMap[status] || status;
};

// Helper function to get human-readable management type
const getManagementTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    'ClientManaged': 'Client Managed',
    'DigitalEngineersManaged': 'DE Managed'
  };
  return typeMap[type] || type;
};

// All available project statuses
const ALL_PROJECT_STATUSES = Object.values(ProjectStatus);

interface ProjectSelectorProps {
  onProjectSelect: (project: ProjectDto | null) => void;
}

const ProjectSelector = ({ onProjectSelect }: ProjectSelectorProps) => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  
  const isFirstLoad = useRef(true);
  const isLoadingData = useRef(false);
  
  const [dateFrom, setDateFrom] = useState<string>(() => {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    return twoMonthsAgo.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const debouncedSearch = useDebounce(searchTerm, DEBOUNCE_DELAY);

  useEffect(() => {
    const loadProjects = async () => {
      if (isLoadingData.current) return;
      
      try {
        isLoadingData.current = true;
        setIsSearching(true);
        setError(null);
        
        const data = await projectService.getProjects({
          statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
          dateFrom: dateFrom,
          dateTo: dateTo,
          search: debouncedSearch || undefined
        });
        
        const projectList = Array.isArray(data) ? data : [];
        
        // Remove duplicates by ID
        const uniqueProjects = projectList.reduce((acc, project) => {
          if (!acc.find(p => p.id === project.id)) {
            acc.push(project);
          }
          return acc;
        }, [] as ProjectDto[]);
        
        setProjects(uniqueProjects);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setError('Failed to load projects. Please try again.');
        setProjects([]);
      } finally {
        isFirstLoad.current = false;
        isLoadingData.current = false;
        setIsSearching(false);
      }
    };

    loadProjects();
  }, [dateFrom, dateTo, debouncedSearch, selectedStatuses]);

  useEffect(() => {
    if (projects.length > 0) {
      const currentProjectStillInList = projects.some(p => p.id === selectedProjectId);
      if (!currentProjectStillInList) {
        setSelectedProjectId(projects[0].id);
      }
    } else {
      setSelectedProjectId(null);
    }
  }, [projects, selectedProjectId]);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projects.find(p => p.id === selectedProjectId) || null;
  }, [selectedProjectId, projects]);

  useEffect(() => {
    onProjectSelect(selectedProject);
  }, [selectedProject, onProjectSelect]);

  const handleProjectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProjectId(value ? Number(value) : null);
  }, []);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      setSelectedStatuses([]);
    } else {
      setSelectedStatuses([value]);
    }
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedStatuses([]);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    setDateFrom(twoMonthsAgo.toISOString().split('T')[0]);
    setDateTo(new Date().toISOString().split('T')[0]);
  }, []);

  // Format project option text with status and management type
  const formatProjectOption = useCallback((project: ProjectDto): string => {
    const parts: string[] = [project.name];
    
    if (project.clientName) {
      parts.push(` - ${project.clientName}`);
    }
    
    // Add status in brackets
    parts.push(` [${getStatusLabel(project.status)}]`);
    
    // Add management type
    parts.push(` - ${getManagementTypeLabel(project.managementType)}`);
    
    // Add date
    parts.push(` (${new Date(project.createdAt).toLocaleDateString()})`);
    
    return parts.join('');
  }, []);

  if (isFirstLoad.current) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <Row className="">
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="ri-search-line me-1" style={{ fontSize: '18px' }}></i>
              Search by Project or Client
            </Form.Label>
            <div className="position-relative">
              <Form.Control
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
              />
              {isSearching && (
                <div 
                  className="position-absolute top-50 end-0 translate-middle-y me-2"
                  style={{ pointerEvents: 'none' }}
                >
                  <Spinner animation="border" size="sm" />
                </div>
              )}
            </div>
            {searchTerm && debouncedSearch !== searchTerm && (
              <Form.Text className="text-muted">
                <i className="ri-timer-line me-1"></i>
                Typing...
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="ri-filter-line me-1" style={{ fontSize: '18px' }}></i>
              Project Status
            </Form.Label>
            <Form.Select
              value={selectedStatuses.length > 0 ? selectedStatuses[0] : ''}
              onChange={handleStatusChange}
            >
              <option value="">All Statuses</option>
              {ALL_PROJECT_STATUSES.map(status => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="ri-calendar-line me-1" style={{ fontSize: '18px' }}></i>
              From Date
            </Form.Label>
            <Form.Control
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="ri-calendar-line me-1" style={{ fontSize: '18px' }}></i>
              To Date
            </Form.Label>
            <Form.Control
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={2} className="d-flex align-items-end">
          <Button 
            variant="outline-secondary" 
            className="mb-3 w-100"
            onClick={handleClearFilters}
          >
            <i className="ri-filter-off-line me-1" style={{ fontSize: '18px' }}></i>
            Clear
          </Button>
        </Col>
      </Row>

      <Row className="">
        <Col md={8}>
          <Form.Group>
            <Form.Label>
              <i className="ri-briefcase-line me-1" style={{ fontSize: '18px' }}></i>
              Select Project
            </Form.Label>
            <Form.Select
              value={selectedProjectId || ''}
              onChange={handleProjectChange}
              disabled={projects.length === 0}
            >
              {projects.length === 0 ? (
                <option value="">No projects found</option>
              ) : (
                <>
                  <option value="">-- Select a project --</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {formatProjectOption(project)}
                    </option>
                  ))}
                </>
              )}
            </Form.Select>
            <Form.Text className="text-muted">
              Showing {projects.length} project(s)
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedStatuses.length > 0 && ` with status "${getStatusLabel(selectedStatuses[0])}"`}
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="d-flex align-items-center mt-3">
          <i className="ri-error-warning-line me-2" style={{ fontSize: '24px' }}></i>
          <span>{error}</span>
        </Alert>
      )}

      {!selectedProjectId && !error && (
        <Alert variant="info" className="d-flex align-items-center mt-3">
          <i className="ri-information-line me-2" style={{ fontSize: '24px' }}></i>
          <span>
            {projects.length === 0 
              ? searchTerm 
                ? `No projects found matching "${searchTerm}". Try different search terms.`
                : 'No projects found. Try adjusting the filters.'
              : 'Please select a project to view tasks.'}
          </span>
        </Alert>
      )}
    </>
  );
};

export default ProjectSelector;
