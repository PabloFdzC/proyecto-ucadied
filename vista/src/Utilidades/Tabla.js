import React from 'react';

class Tabla extends React.Component {
    constructor(props){
        super(props);
        this.titulos = props.titulos;
        this.datos = props.datos;
        this.style = props.style;
    }

    render(){
        return (
            <table className="table" style={this.props.style}>
                <thead>
                    <tr>
                    {this.props.titulos.map(titulo =>
                        <th scope="col" key={titulo.llave}>{titulo.valor}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                {this.props.datos.map((dato, i) =>
                        <tr key={i}>
                            {this.props.titulos.map((t, j) =>
                                <td key={i+"-"+j}>{this.props.datos[i][t.llave]}</td>)}
                        </tr>
                        )}
                </tbody>
                </table>
        );
    }
}

export default Tabla;