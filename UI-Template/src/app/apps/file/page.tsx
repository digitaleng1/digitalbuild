import PageBreadcrumb from '@/components/PageBreadcrumb';
import {Card, CardBody, Col, Offcanvas, Row} from 'react-bootstrap';
import LeftPanel from './LeftPanel';
import QuickAccess from './QuickAccess';
import Recent from './Recent';
import {quickAccessFiles, recentFiles} from './data';
import {useState} from "react";


const FileManagerApp = () => {
    const [show, setShow] = useState(false)
    return (
        <>
            <PageBreadcrumb title="File Manager" subName="Apps"/>
            <Row>
                <Col>
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
                                    <LeftPanel/>
                                </Offcanvas>
                            </Col>
                            <Col xxl={10}>
                                <CardBody>
                                    <div className="d-flex align-items-center flex-wrap gap-2">
                                        <div className='d-flex align-items-center gap-2 me-auto'>
                                            <div className="d-xxl-none d-inline-flex">
                                                <button onClick={() => setShow(!show)}
                                                        className="btn btn-light align-items-center px-2" type="button"
                                                >
                                                    <i className="mdi mdi-menu font-18"></i>
                                                </button>
                                            </div>
                                            <div className="app-search">
                                                <form>
                                                    <div className="position-relative">
                                                        <input type="text" className="form-control"
                                                               placeholder="Search files..."/>
                                                        <span className="mdi mdi-magnify search-icon"></span>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div>
                                            <button type="submit" className="btn btn-sm btn-light">
                                                <i className="mdi mdi-format-list-bulleted"></i>
                                            </button>
                                            <button type="submit" className="btn btn-sm">
                                                <i className="mdi mdi-view-grid"></i>
                                            </button>
                                            <button type="submit" className="btn btn-sm">
                                                <i className="mdi mdi-information-outline"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <QuickAccess quickAccessFiles={quickAccessFiles}/>

                                </CardBody>
                                <Recent recentFiles={recentFiles}/>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default FileManagerApp;
