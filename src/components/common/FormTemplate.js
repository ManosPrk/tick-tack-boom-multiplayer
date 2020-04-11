import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Fragment } from 'react';
import { useState } from 'react';

function FormTemplate(props) {

    const inputs = props.inputValues;

    function handleBlur(event) {
        event.preventDefault();
        inputs[event.target.name] = event.target.value;
    }

    return (
        <>
            <Form onSubmit={props.handleSubmit}>
                <Form.Group>
                    {Object.keys(inputs).map((key) => {
                        return (
                            <Fragment key={key}>
                                <Form.Label>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Form.Label>
                                <Form.Control
                                    minLength={3}
                                    type="text"
                                    name={key}
                                    onBlur={handleBlur}
                                    required
                                />
                            </Fragment>
                        );
                    })}
                    <Form.Text className="text-muted">
                        {props.mutedText}
                    </Form.Text>
                </Form.Group>
                <Button className="text-decoration-none" variant="primary" type="submit">
                    {props.buttonText}
                </Button>
            </Form>

        </>
    );
}


export default FormTemplate;