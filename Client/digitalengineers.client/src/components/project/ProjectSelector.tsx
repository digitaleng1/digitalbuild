import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Row, Col, Button, Spinner, Form, Alert } from 'react-bootstrap';
import projectService from '@/services/projectService';
import type { ProjectDto } from '@/types/project';

const ACTIVE_STATUSES = ['QuotePending', 'QuoteSubmitted', 'QuoteAccepted', 'InProgress'];
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

interface ProjectSelectorProps {
  onProjectSelect: (project: ProjectDto | null) => void;
}

const ProjectSelector = ({ onProjectSelect }: ProjectSelectorProps) => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
          statuses: ACTIVE_STATUSES,
          dateFrom: dateFrom,
          dateTo: dateTo,
          search: debouncedSearch || undefined
        });
        
        const projectList = Array.isArray(data) ? data : [];
        setProjects(projectList);
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
  }, [dateFrom, dateTo, debouncedSearch]);

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

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    setDateFrom(twoMonthsAgo.toISOString().split('T')[0]);
    setDateTo(new Date().toISOString().split('T')[0]);
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
        <Col md={4}>
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

        <Col md={3}>
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
                      {project.name} 
                      {project.clientName && ` - ${project.clientName}`}
                      {' '}({new Date(project.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </>
              )}
            </Form.Select>
            <Form.Text className="text-muted">
              Showing {projects.length} project(s)
              {searchTerm && ` matching "${searchTerm}"`}
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
                : 'No active projects found. Try adjusting the date filters.'
              : 'Please select a project to view tasks.'}
          </span>
        </Alert>
      )}
    </>
  );
};

export default ProjectSelector;
