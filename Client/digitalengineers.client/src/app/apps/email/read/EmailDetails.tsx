

import {Link} from "react-router";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Col,
    Dropdown,
    Offcanvas,
    OverlayTrigger,
    Row,
    Tooltip
} from 'react-bootstrap';
import {ComposeMail, LeftSide} from '../components';
import {useReadEmail} from '../hooks';
import {useState} from "react";

const EmailDetails = () => {
    const {totalUnreadEmails, email, isModalOpen, toggleComposeModal} = useReadEmail();
    const [show, setShow] = useState(false)
    return (
        <>
            <Card>
                <Row className="g-0">
                    <Col xxl={2} className="email-border border-end border-5">
                        <Offcanvas
                            responsive="xxl"
                            show={show}
                            className='file-offcanvas'
                            onHide={() => setShow(false)}
                            tabIndex={-1}
                        >
                            <LeftSide
                                totalUnreadEmails={totalUnreadEmails}
                                toggleComposeModal={toggleComposeModal}
                            />
                        </Offcanvas>
                    </Col>
                    <Col xxl={10}>
                        <CardBody>
                            <div className='d-flex flex-wrap align-items-center gap-2'>
                                <div className="d-xxl-none d-inline-flex">
                                    <button onClick={() => setShow(!show)}
                                            className="btn btn-light align-items-center px-2" type="button"
                                            data-bs-toggle="offcanvas" data-bs-target="#emailSidebaroffcanvas"
                                            aria-controls="emailSidebaroffcanvas">
                                        <i className="mdi mdi-menu font-18"></i>
                                    </button>
                                </div>
                                <ButtonGroup>
                                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Archived</Tooltip>}>
                                        <Button variant="secondary">
                                            <i className="mdi mdi-archive font-16"></i>
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Spam</Tooltip>}>
                                        <Button variant="secondary">
                                            <i className="mdi mdi-alert-octagon font-16"></i>
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Delete</Tooltip>}>
                                        <Button variant="secondary">
                                            <i className="mdi mdi-delete-variant font-16"></i>
                                        </Button>
                                    </OverlayTrigger>
                                </ButtonGroup>

                                <ButtonGroup as={Dropdown}>
                                    <Dropdown.Toggle variant="secondary" className="arrow-none">
                                        <i className="mdi mdi-folder font-16"></i>
                                        <i className="mdi mdi-chevron-down"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <span className="dropdown-header">Move to:</span>
                                        <Dropdown.Item>Social</Dropdown.Item>
                                        <Dropdown.Item>Promotions</Dropdown.Item>
                                        <Dropdown.Item>Updates</Dropdown.Item>
                                        <Dropdown.Item>Forums</Dropdown.Item>
                                    </Dropdown.Menu>
                                </ButtonGroup>

                                <ButtonGroup as={Dropdown}>
                                    <Dropdown.Toggle variant="secondary" className="arrow-none">
                                        <i className="mdi mdi-label font-16"></i>
                                        <i className="mdi mdi-chevron-down"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <span className="dropdown-header">Label as:</span>
                                        <Dropdown.Item>Social</Dropdown.Item>
                                        <Dropdown.Item>Promotions</Dropdown.Item>
                                        <Dropdown.Item>Updates</Dropdown.Item>
                                        <Dropdown.Item>Forums</Dropdown.Item>
                                    </Dropdown.Menu>
                                </ButtonGroup>

                                <ButtonGroup as={Dropdown}>
                                    <Dropdown.Toggle variant="secondary" className="arrow-none">
                                        <i className="mdi mdi-dots-horizontal font-16"></i> More
                                        <i className="mdi mdi-chevron-down"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <span className="dropdown-header">More Options :</span>
                                        <Dropdown.Item>Mark as Unread</Dropdown.Item>
                                        <Dropdown.Item>Add to Tasks</Dropdown.Item>
                                        <Dropdown.Item>Add Star</Dropdown.Item>
                                        <Dropdown.Item>Mute</Dropdown.Item>
                                    </Dropdown.Menu>
                                </ButtonGroup>
                            </div>

                            <div className="mt-3">
                                <h5 className="font-18">Your elite author Graphic Optimization reward is ready!</h5>
                                <hr/>

                                <div className="d-flex mb-3 mt-1">
                                    <img className="d-flex me-2 rounded-circle" src={email.avatar}
                                           alt={email.from_name}
                                           height="32"/>
                                    <div className="w-100 overflow-hidden">
                                        <small className="float-end">{email.recieved_on}</small>
                                        <h6 className="m-0 font-14">{email.from_name}</h6>
                                        <small className="text-muted">From: {email.from_email}</small>
                                    </div>
                                </div>

                                <p>Hi Coderthemes!</p>
                                <p>
                                    Clicking ‘Order Service’ on the right-hand side of the above page will present
                                    you with
                                    an order page. This service has the following
                                    Briefing Guidelines that will need to be filled before placing your order:
                                </p>

                                <ol>
                                    <li>Your design preferences (Color, style, shapes, Fonts, others)</li>
                                    <li>Tell me, why is your item different?</li>
                                    <li>Do you want to bring up a specific feature of your item? If yes, please tell
                                        me
                                    </li>
                                    <li>Do you have any preference or specific thing you would like to change or
                                        improve on
                                        your item page?
                                    </li>
                                    <li>
                                        Do you want to include your item&apos;s or your &apos;s logo on the page? if
                                        yes,
                                        please send it to me in vector format (Ai or EPS)
                                    </li>
                                    <li>Please provide me with the copy or text to display</li>
                                </ol>

                                <p>Filling in this form with the above information will ensure that they will be
                                    able to
                                    start work quickly.</p>
                                <p>You can complete your order by putting your coupon code into the Promotional code
                                    box and
                                    clicking ‘Apply Coupon’.</p>
                                <p>
                                    <b>Best,</b> <br/> Graphic Studio
                                </p>
                                <hr/>

                                <h5 className="mb-3">Attachments</h5>
                                <Row>
                                    {email.attachments.map((f, index) => {
                                        return (
                                            <Col xl={4} key={index.toString()}>
                                                <Card className="mb-1 shadow-none border">
                                                    <div className="p-2">
                                                        <Row className="align-items-center">
                                                            <Col className="col-auto">
                                                                <div className="avatar-sm">
                                                                <span
                                                                    className="avatar-title bg-primary-lighten text-primary rounded">{f.ext}</span>
                                                                </div>
                                                            </Col>
                                                            <Col className="col ps-0">
                                                                <Link to=""
                                                                      className="text-muted font-weight-bold">
                                                                    {f.name}
                                                                </Link>
                                                                <p className="mb-0">{f.size}</p>
                                                            </Col>
                                                            <Col className="col-auto">
                                                                <Link to=""
                                                                      className="btn btn-link btn-lg text-muted">
                                                                    <i className="ri-download-2-line"></i>
                                                                </Link>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Card>
                                            </Col>
                                        );
                                    })}
                                </Row>

                                <div className="mt-5">
                                    <Link to="" className="btn btn-secondary me-2">
                                        <i className="mdi mdi-reply me-1"></i> Reply
                                    </Link>
                                    <Link to="" className="btn btn-light">
                                        Forward <i className="mdi mdi-forward ms-1"></i>
                                    </Link>
                                </div>
                            </div>
                        </CardBody>
                    </Col>
                </Row>

            </Card>

            {/* compose email modal */}
            <ComposeMail isModalOpen={isModalOpen} toggleComposeModal={toggleComposeModal}/>
        </>
    );
};

export default EmailDetails;
