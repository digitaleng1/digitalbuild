import { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import TaskKanbanBoard from '@/components/task/TaskKanbanBoard';
import ProjectSelector from '@/components/project/ProjectSelector';
import { useAuthContext } from '@/common/context/useAuthContext';
import type { ProjectDto } from '@/types/project';

const KanbanPage = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);
  const { hasRole } = useAuthContext();
  
  // Specialists (Provider role) have read-only access
  const canEdit = !hasRole('Provider');

  return (
    <>
      <PageBreadcrumb
        title="Kanban Board"
        subName="Specialist"
      />

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <ProjectSelector onProjectSelect={setSelectedProject} />

              {selectedProject && (
                <div className="mt-4">
                  <TaskKanbanBoard 
                    projectId={selectedProject.id}
                    project={selectedProject}
                    canEdit={canEdit}
                    onTaskClick={(taskId) => console.log('Task clicked:', taskId)}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default KanbanPage;
