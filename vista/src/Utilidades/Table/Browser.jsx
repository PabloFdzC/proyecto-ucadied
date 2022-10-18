import React  from 'react';
import PropTypes from "prop-types";

const Browser = ({data, listener, toggleModal}) => {

    const filteredData = [];

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    } 

    return (
        <div className="browser-div">
            <div className='tableBrowser-div'>
                <input className='tableBrowser-input' placeholder='Search...' 
                onChange={(e)=>{
                    if (e.target.value === ""){
                        listener(data);
                    }
                }}
                onKeyDown={(e)=>{
                    if (e.key === "Enter") {
                        if (e.target.value !== "") {
                            data.map((row) => {
                                for (let value of Object.values(row)) {
                                    //Eliminar cualquier acento que tenga el elemento para
                                    //facilitar la búsqueda
                                    var valueToLower = removeAccents(value).toLowerCase();
                                    
                                    if (valueToLower.includes(e.target.value.toLowerCase())){
                                        return filteredData.push(row);
                                    }
                                }
                                return null;
                            });
                            listener(filteredData)
                        }
                    }
                }}/>
            </div>
            <div className='addUserButton-div'>
                <button className='addUser-button' onClick={() => toggleModal(true)}>Agregar Usuario</button>
            </div>
            
        </div>
    );

}

Browser.propTypes = {
    data: PropTypes.array,
    listener: PropTypes.func
};

export default Browser;