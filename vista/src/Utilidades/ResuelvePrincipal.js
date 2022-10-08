import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import QueriesGenerales from '../QueriesGenerales';



class ResuelvePrincipal extends React.Component {
    constructor(props){
        super(props);
        this.ruta = props.ruta;
    

        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            existeAdministrador: true
        }
    }

    async existeAdministrador(){
        const resp = await this.queriesGenerales.obtener("/administrador/existeAdministrador",{});
        console.log(resp);
        this.setState({
            existeAdministrador: resp.data.existeAdministrador
        });
    }

    componentDidMount(){
        if(!this.administradorPedido){
            this.administradorPedido = true;
            this.existeAdministrador();
        }
    }
    render(){
        if(this.props.ruta === "")
            return (<>
                {!this.state.existeAdministrador ? 
                <div className="d-flex flex-column center-text justify-content-center align-items-center" style={{height:"inherit"}}>
                    <h1>Se debe crear un administrador</h1>
                    <div>
                        <Link className="btn btn-primary" to="/administradores">Administradores</Link>
                    </div>
                </div>
                :<></>}
            </>);
        return <Navigate to={this.props.ruta} />;
    }
}

export default ResuelvePrincipal;