import React from 'react';
import ModalTemplate from './ModalTemplate';
import FormTemplate from './FormTemplate';

function ModalFormTemplate(props) {
    return (
        <ModalTemplate
            title={props.modalTitle}
            modalButtonText={props.modalButtonText}
            body={
                <FormTemplate
                    buttonText={props.formButtonText}
                    handleSubmit={props.formHandleSubmit}
                    handleBlur={props.formInputHandleBlur}
                    inputValues={props.formInputValues}
                />
            }
        />
    );
}

export default ModalFormTemplate;