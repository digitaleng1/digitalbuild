
import {Row, Col, Card, CardBody} from 'react-bootstrap';
import SimpleMDEReact, {type SimpleMDEReactProps} from 'react-simplemde-editor';
import {useState} from "react";



// styles
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.bubble.css';
import 'easymde/dist/easymde.min.css';
import ReactQuill from 'react-quill-new';

const modules = {
    toolbar: [
        [{font: []}],
        ['bold', 'italic', 'underline', 'strike'],
        [{color: []}, {background: []}],
        [{script: 'super'}, {script: 'sub'}],
        [{header: [false, 1, 2, 3, 4, 5, 6]}],
        ['blockquote', 'code-block'],
        [{list: 'ordered'}, {list: 'bullet'}, {indent: '-1'}, {indent: '+1'}],
        [{align: []}],
        ['link', 'image', 'video'],
        ['clean'],
    ],
}

const AllEditor = () => {
    const [value, setValue] = useState(`
     <h3><span className="ql-size-large">Hello World!</span></h3>
                                                <p><br/></p>
                                                <h3>This is an simple editable area.</h3>
                                                <p><br/></p>
                                                <ul>
                                                    <li>
                                                        Select a text to reveal the toolbar.
                                                    </li>
                                                    <li>
                                                        Edit rich document on-the-fly, so elastic!
                                                    </li>
                                                </ul>
                                                <p><br/></p>
                                                <p>
                                                    End of simple area
                                                </p>
    `);
    const delay = 1000;
    const options: SimpleMDEReactProps['options'] = {
        autosave: {
            enabled: true,
            uniqueId: '1',
            delay,
        },
    };

    return (
        <>
            <Row>
                <Col xs={12} >
                    <Card>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <div className="mb-2">
                                    <h4 className="header-title mt-2">Quill Editor</h4>
                                    <p className="text-muted font-14">Snow is a clean, flat toolbar theme.</p>

                                    <ReactQuill theme="snow" modules={modules} value={value} onChange={setValue} />


                                </div>
                            </li>

                            <li className="list-group-item">
                                <div className="mb-2">
                                    <h5 className="mb-1">Bubble Editor</h5>
                                    <p className="text-muted font-14">Bubble is a simple tooltip based theme.</p>



                                    <ReactQuill theme="bubble" value={value} onChange={setValue} />


                                </div>
                            </li>
                        </ul>

                    </Card>

                </Col>

            </Row>

            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mb-3">SimpleMDE</h4>
                            <p className="text-muted font-14 mb-3">SimpleMDE is a light-weight, simple, embeddable, and
                                beautiful JS markdown editor</p>

                            <SimpleMDEReact id={'1'} options={options}/>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default AllEditor;
