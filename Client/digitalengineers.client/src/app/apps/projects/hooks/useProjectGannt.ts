
import { useState, useEffect } from 'react';
import Gantt from 'frappe-gantt';
import type { GanttProjectItem } from '../types';
import { projects, tasks as tasksData } from '../gantt/data';

export default function useProjectGannt() {
	const [selectedProject, setSelectedProject] = useState<GanttProjectItem>(projects[1]);
	const [mode, setMode] = useState<Gantt.viewMode>('Week');
	const [gantt, setGantt] = useState<Gantt>();

	const modes: Gantt.viewMode[] = ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'];

	useEffect(() => {
		// create gantt
		const gantt = new Gantt('#tasks-gantt', [...tasksData], {
			view_modes:['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
			bar_height: 20,
			padding: 18,
			view_mode: 'Week',
		});
		setGantt(gantt);
	}, []);

	const onSelectProject = (p: GanttProjectItem) => {
		setSelectedProject(p);
	};

	/**
	 * On mode change
	 * @param {*} mode
	 */
	const changeMode = (mode: Gantt.viewMode) => {
		setMode(mode);
		if (gantt) {
			gantt.change_view_mode(mode);
		}
	};
	return {
		mode,
		selectedProject,
		modes,
		onSelectProject,
		changeMode,
	};
}
