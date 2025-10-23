import { Button, Card, CardBody, Col, ProgressBar, Row } from 'react-bootstrap';
import clsx from 'clsx';
import { useWizard,Wizard } from 'react-use-wizard';

const FooterButtons = () => {
	const { goToStep, nextStep, previousStep, isFirstStep, isLastStep, activeStep, stepCount } = useWizard();
	return (
		<>
			<div className="float-end">
				<Button variant="info" className="button-next me-1" disabled={isLastStep} onClick={nextStep}>
					Next
				</Button>
				<Button variant="info" className="button-last" onClick={() => goToStep(stepCount - 1)}>
					Last
				</Button>
			</div>
			<div className="float-start">
				<Button variant="info" className="button-first me-1" onClick={() => goToStep(stepCount - 1 - activeStep)}>
					First
				</Button>
				<Button variant="info" className="button-previous" disabled={isFirstStep} onClick={previousStep}>
					Previous
				</Button>
			</div>
		</>
	);
};

const Header = ({ withProgress }: { withProgress?: boolean }) => {
	const { goToStep, activeStep, stepCount } = useWizard();
	return (
		<>
			<ul className="nav nav-pills nav-justified form-wizard-header mb-3">
				<li className="nav-item">
					<button onClick={() => goToStep(0)} className={clsx('nav-link rounded-0 py-2', activeStep === 0 && 'active')}>
						<i className="mdi mdi-account-circle font-18 align-middle me-1"></i>
						<span className="d-none d-sm-inline">Account</span>
					</button>
				</li>
				<li className="nav-item">
					<button onClick={() => goToStep(1)} className={clsx('nav-link rounded-0 py-2', activeStep === 1 && 'active')}>
						<i className="mdi mdi-face-man-profile font-18 align-middle me-1"></i>
						<span className="d-none d-sm-inline">Profile</span>
					</button>
				</li>
				<li className="nav-item">
					<button onClick={() => goToStep(2)} className={clsx('nav-link rounded-0 py-2', activeStep === 2 && 'active')}>
						<i className="mdi mdi-checkbox-marked-circle-outline font-18 align-middle me-1"></i>
						<span className="d-none d-sm-inline">Finish</span>
					</button>
				</li>
			</ul>
			{withProgress && (
				<ProgressBar variant="success" striped animated now={(activeStep + 1) * (100 / stepCount)} className="mb-3" style={{ height: '6px' }} />
			)}
		</>
	);
};

const Step1 = ({ showButtons }: { showButtons?: boolean }) => {
	const { nextStep } = useWizard();
	return (
		<>
			<div className="row">
				<div className="col-12">
					<div className="row mb-3">
						<label className="col-md-3 col-form-label" htmlFor="userName1">
							User name
						</label>
						<div className="col-md-9">
							<input type="text" className="form-control" id="userName1" name="userName1" defaultValue="hyper" />
						</div>
					</div>
					<div className="row mb-3">
						<label className="col-md-3 col-form-label" htmlFor="password1">
							{' '}
							Password
						</label>
						<div className="col-md-9">
							<input type="password" id="password1" name="password1" className="form-control" defaultValue="123456789" />
						</div>
					</div>

					<div className="row mb-3">
						<label className="col-md-3 col-form-label" htmlFor="confirm1">
							Re Password
						</label>
						<div className="col-md-9">
							<input type="password" id="confirm1" name="confirm1" className="form-control" defaultValue="123456789" />
						</div>
					</div>
				</div>
			</div>

			{showButtons ? (
				<FooterButtons />
			) : (
				<ul className="list-inline wizard mb-0">
					<li className="next list-inline-item float-end">
						<Button variant="info" onClick={nextStep}>
							Add More Info <i className="mdi mdi-arrow-right ms-1"></i>
						</Button>
					</li>
				</ul>
			)}
		</>
	);
};

const Step2 = ({ showButtons }: { showButtons?: boolean }) => {
	const { previousStep, nextStep } = useWizard();
	return (
		<>
			<div className="row">
				<div className="col-12">
					<div className="row mb-3">
						<label className="col-md-3 col-form-label" htmlFor="name1">
							{' '}
							First name
						</label>
						<div className="col-md-9">
							<input type="text" id="name1" name="name1" className="form-control" defaultValue="Francis" />
						</div>
					</div>
					<div className="row mb-3">
						<label className="col-md-3 col-form-label" htmlFor="surname1">
							{' '}
							Last name
						</label>
						<div className="col-md-9">
							<input type="text" id="surname1" name="surname1" className="form-control" defaultValue="Brinkman" />
						</div>
					</div>

					<div className="row mb-3">
						<label className="col-md-3 col-form-label" htmlFor="email1">
							Email
						</label>
						<div className="col-md-9">
							<input type="email" id="email1" name="email1" className="form-control" defaultValue="cory1979@hotmail.com" />
						</div>
					</div>
				</div>
			</div>
			{showButtons ? (
				<FooterButtons />
			) : (
				<ul className="pager wizard mb-0 list-inline">
					<li className="previous list-inline-item">
						<Button variant="light" onClick={previousStep}>
							<i className="mdi mdi-arrow-left me-1"></i> Back to Account
						</Button>
					</li>
					<li className="next list-inline-item float-end">
						<Button variant="info" onClick={nextStep}>
							Add More Info <i className="mdi mdi-arrow-right ms-1"></i>
						</Button>
					</li>
				</ul>
			)}
		</>
	);
};

const Step3 = ({ showButtons }: { showButtons?: boolean }) => {
	const { previousStep } = useWizard();
	return (
		<>
			<div className="row">
				<div className="col-12">
					<div className="text-center">
						<h2 className="mt-0">
							<i className="mdi mdi-check-all"></i>
						</h2>
						<h3 className="mt-0">Thank you !</h3>

						<p className="w-75 mb-2 mx-auto">
							Quisque nec turpis at urna dictum luctus. Suspendisse convallis dignissim eros at volutpat. In egestas mattis dui. Aliquam mattis dictum
							aliquet.
						</p>

						<div className="mb-3">
							<div className="form-check d-inline-block">
								<input type="checkbox" className="form-check-input" id="customCheck3" />
								<label className="form-check-label" htmlFor="customCheck3">
									I agree with the Terms and Conditions
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>
			{showButtons ? (
				<FooterButtons />
			) : (
				<ul className="pager wizard mb-0 list-inline mt-1">
					<li className="previous list-inline-item">
						<Button variant="light" onClick={previousStep}>
							<i className="mdi mdi-arrow-left me-1"></i> Back to Profile
						</Button>
					</li>
					<li className="next list-inline-item float-end">
						<Button variant="info">Submit</Button>
					</li>
				</ul>
			)}
		</>
	);
};

const AllWizard = () => {
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title mb-3"> Basic Wizard</h4>
							<Wizard header={<Header />}>
								<Step1 />
								<Step2 />
								<Step3 />
							</Wizard>
						</CardBody>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title mb-3"> Button Wizard</h4>
							<Wizard header={<Header />}>
								<Step1 showButtons />
								<Step2 showButtons />
								<Step3 showButtons />
							</Wizard>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col lg={6}>
					<Card>
						<CardBody>
							<h4 className="header-title mb-3"> Wizard With Progress Bar</h4>
							<Wizard header={<Header withProgress />}>
								<Step1 />
								<Step2 />
								<Step3 />
							</Wizard>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllWizard;
