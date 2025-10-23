

import { useKanban } from '../hooks';

const BreadcrumbChild = () => {
	const { newTask } = useKanban();
	return (
		<button
			className="btn btn-success btn-sm ms-3"
			onClick={() => {
				newTask('Todo', 'todoTasks');
			}}
		>
			Add New
		</button>
	);
};

export default BreadcrumbChild;
