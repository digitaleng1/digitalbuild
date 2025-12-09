import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { ProjectDto } from '@/types/project';
import { ProjectStatus } from '@/types/project';
import useUpdateProjectStatus from '@/app/shared/hooks/useUpdateProjectStatus';
import { getProjectStatusLabel } from '@/utils/projectUtils';
import ProjectCard from './ProjectCard';

interface ProjectKanbanBoardProps {
	projects: ProjectDto[];
	onProjectStatusChange?: (projectId: number, newStatus: string) => void;
}

type ProjectColumn = {
	id: ProjectStatus;
	title: string;
	projects: ProjectDto[];
};

const ProjectKanbanBoard = ({ projects, onProjectStatusChange }: ProjectKanbanBoardProps) => {
	const { updateStatus, isUpdating } = useUpdateProjectStatus();

	const visibleStatuses: ProjectStatus[] = useMemo(() => [
		ProjectStatus.QuotePending,
		ProjectStatus.QuoteSubmitted,
		ProjectStatus.QuoteRejected,
		ProjectStatus.QuoteAccepted,
		ProjectStatus.InitialPaymentPending,
		ProjectStatus.InitialPaymentComplete,
		ProjectStatus.InProgress,
		ProjectStatus.Completed,
		ProjectStatus.Cancelled,
	], []);

	const [columns, setColumns] = useState<ProjectColumn[]>([]);

	useEffect(() => {
		const filteredProjects = projects.filter(p => p.status !== ProjectStatus.Draft);
		
		const cols = visibleStatuses.map(status => ({
			id: status,
			title: getProjectStatusLabel(status),
			projects: filteredProjects.filter(p => p.status === status),
		}));

		setColumns(cols);
	}, [projects, visibleStatuses]);

	const onDragEnd = async (result: DropResult) => {
		const { source, destination } = result;

		if (!destination) return;
		if (source.droppableId === destination.droppableId && source.index === destination.index) return;

		const sourceColumnIndex = columns.findIndex(col => col.id === source.droppableId);
		const destColumnIndex = columns.findIndex(col => col.id === destination.droppableId);

		if (sourceColumnIndex === -1 || destColumnIndex === -1) return;

		const sourceColumn = columns[sourceColumnIndex];
		const destColumn = columns[destColumnIndex];

		const sourceProjects = Array.from(sourceColumn.projects);
		const [movedProject] = sourceProjects.splice(source.index, 1);

		if (source.droppableId === destination.droppableId) {
			sourceProjects.splice(destination.index, 0, movedProject);
			
			const newColumns = [...columns];
			newColumns[sourceColumnIndex] = {
				...sourceColumn,
				projects: sourceProjects,
			};
			
			setColumns(newColumns);
		} else {
			const destProjects = Array.from(destColumn.projects);
			destProjects.splice(destination.index, 0, movedProject);

			const newColumns = [...columns];
			newColumns[sourceColumnIndex] = {
				...sourceColumn,
				projects: sourceProjects,
			};
			newColumns[destColumnIndex] = {
				...destColumn,
				projects: destProjects,
			};

			// Optimistically update UI
			setColumns(newColumns);

			try {
				// Update on server
				await updateStatus(movedProject.id, destination.droppableId);
				
				// Notify parent about status change (optimistic update in parent state)
				onProjectStatusChange?.(movedProject.id, destination.droppableId);
			} catch (error) {
				// Rollback on error
				setColumns(columns);
			}
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="board">
				{columns.map(column => (
					<Droppable key={column.id} droppableId={column.id}>
						{(provided) => (
							<div 
								className="tasks" 
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								<h5 className="mt-0 task-header text-uppercase">
									{column.title} ({column.projects.length})
								</h5>

								{column.projects.length === 0 && (
									<p className="text-center text-muted pt-2 mb-0">No Projects</p>
								)}

								{column.projects.map((project, index) => (
									<Draggable 
										key={project.id} 
										draggableId={String(project.id)} 
										index={index}
										isDragDisabled={isUpdating}
									>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												style={{
													...provided.draggableProps.style,
													marginTop: '1rem',
												}}
											>
												<ProjectCard project={project} variant="compact" />
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				))}
			</div>
		</DragDropContext>
	);
};

export default ProjectKanbanBoard;
