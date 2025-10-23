import { Form } from 'react-bootstrap';

type MenuTypeProps = {
	handleToggleMenuType: () => void;
	useTemplateMenu?: boolean;
};

const MenuType = ({ handleToggleMenuType, useTemplateMenu }: MenuTypeProps) => {
	return (
		<>
			<div className="mt-3">
				<h5 className="font-16 fw-semibold mb-2">Menu Type</h5>
				<p className="text-muted">Choose between template menu or role-based menu</p>
			</div>

			<div className="d-flex align-items-center justify-content-between">
				<div>
					<strong className="d-block mb-1">{useTemplateMenu ? 'Template Menu' : 'Role-Based Menu'}</strong>
					<span className="text-muted small">
						{useTemplateMenu 
							? 'Showing all menu items from template' 
							: 'Showing menu based on your role'}
					</span>
				</div>
				<Form.Check
					type="switch"
					id="menu-type-switch"
					checked={useTemplateMenu}
					onChange={handleToggleMenuType}
					label=""
				/>
			</div>
		</>
	);
};

export default MenuType;
