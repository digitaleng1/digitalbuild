
import {Link} from "react-router";
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { useProjectGannt } from '../hooks';

const GanttChart = () => {
	const { modes, changeMode, mode } = useProjectGannt();

	return (
		<div className="ps-xl-3">
			<Row>
				<Col className="col-auto">
					<Link to="" className="btn btn-success btn-sm mb-2">
						Add New Task
					</Link>
				</Col>
				<Col className="text-sm-end">
					<ButtonGroup>
						{modes.map((m, index) => {
							return (
								<Button variant="primary" size={'sm'} key={index.toString()} onClick={() => changeMode(m)} active={mode === m}>
									{m}
								</Button>
							);
						})}
					</ButtonGroup>
				</Col>
			</Row>
			<Row>
				<Col className="mt-3">
					<svg id="tasks-gantt"></svg>
				</Col>
			</Row>
		</div>
	);
};

export default GanttChart;
