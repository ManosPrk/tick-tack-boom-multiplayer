import React from "react";
import PropTypes from 'prop-types';

function TextInput(props) {
    // const data = 
    // for (let i = 0; i <  && i < 12; i++) {
    //     index.push(i);
    // }

    return (
        <>
            <div className="d-flex flex-column mt-3">
                {
                    Object.keys(props.data).map((item, index) => {
                        return (
                            <input
                                onBlur={props.handleBlur}
                                id={index}
                                key={index}
                                type="text"
                                className="form-control mb-3"
                                name={item}
                                placeholder="Name.."
                            />
                        );
                    })
                }
            </div>
        </>
    );
}

TextInput.propTypes = {
    data: PropTypes.object.isRequired,
    handleBlur: PropTypes.func
}

export default TextInput;