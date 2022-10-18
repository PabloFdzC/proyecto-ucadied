import React  from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import PropTypes from "prop-types";

/**
 * Creates a button group with as many buttons as elements are in the items parameter.
 * @param items: an array containig the names of the buttons to create.
 * @param buttonFunctionality: a function binded to each button, triggered when it's clicked: receives as parameter the name of the button .
 */

const ToolBar = ({ items, buttonFunctionality }) => {

    return (
        <div className='buttongroup-container row'>
            <ButtonGroup className='buttongroup-div-btn'>
                {items.map((items) => {
                    return <Button key={items} 
                                className='buttongroup-btn' variant="success"
                                onClick={() => buttonFunctionality(items)}
                                >
                                    {items}
                            </Button>
                })}
            </ButtonGroup>
        </div>
    );

}

ToolBar.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string),
    buttonFunctionality: PropTypes.func,
};

export default ToolBar;