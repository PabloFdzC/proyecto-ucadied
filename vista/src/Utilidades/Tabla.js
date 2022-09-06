import React from 'react';

class Tabla extends React.Component {
    constructor(props){
        super(props);
        this.titulos = props.titulos;
        this.datos = props.datos;
    }

    render(){
        return (
            <table className="table">
                <thead>
                    <tr>
                    {this.props.titulos.map(titulo =>
                        <th scope="col" key={titulo}>{titulo}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                {this.props.datos.map((dato, i) =>
                        <tr key={i}>
                            {dato.map((d, j) =>
                                <td key={i+"-"+j}>{d}</td>)}
                        </tr>
                        )}
                </tbody>
                </table>
        );
    }
}

export default Tabla;