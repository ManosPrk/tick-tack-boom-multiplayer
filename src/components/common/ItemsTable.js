import React from 'react';

function ItemsTable(props) {
    return (
        <table className="table items-table">
            <thead>
                <tr>
                    {props.columns
                        .map((column) => {
                            return <th scope="col">{column}</th>
                        })}
                </tr>
            </thead>
            <tbody>
                {props.items
                    .map((item, index) => {
                        return (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                {Object.values(item)
                                    .map((element, index) => {
                                        return <td key={index}>{element}</td>
                                    })}
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
}
export default ItemsTable;