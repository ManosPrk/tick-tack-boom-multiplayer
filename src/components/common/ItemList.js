import React from 'react';

function ItemList(props) {
    return (
        <ul className="list-group text-center">
            {props.items
                .map((item, index) => {
                    return (
                        <li
                            onClick={props.close}
                            style={{ border: 'none' }}
                            value={index}
                            key={item}
                            className="list-group-item noselect"
                        >
                            {props.itemText}
                        </li>
                    );
                })}
        </ul>
    );
}
export default ItemList;