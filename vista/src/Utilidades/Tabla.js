import React from 'react';

class Tabla extends React.Component {
    constructor(props){
        super(props);
        this.titulos = props.titulos;
        this.datos = props.datos;
        this.style = props.style;
    }

    creaTabla(titulos, datos){
        return (
            <table className="table" style={this.props.style}>
                <thead>
                    <tr>
                    {titulos.map(titulo =>
                        <th scope="col" key={titulo.llave}>{titulo.valor}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                {datos.map((dato, i) =>
                        <tr key={i}>
                            {titulos.map((t, j) =>
                                <td key={i+"-"+j}>{dato[t.llave]}</td>)}
                        </tr>
                        )}
                </tbody>
            </table>
        );
    }

    render(){
        return this.creaTabla(this.props.titulos, this.props.datos);
    }
}

export default Tabla;
