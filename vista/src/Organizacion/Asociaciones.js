import React from 'react';
import OrganizacionForm from '../Organizacion/OrganizacionForm';
import QueriesGenerales from "../QueriesGenerales";
import CajasOrganizaciones from './CajasOrganizaciones';
import Modal from 'react-bootstrap/Modal';
import '../Estilos/Modal.css';

class Asociaciones extends React.Component {
    constructor(props){
        super(props);
        this.soloVer = props.soloVer;
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            asociaciones: [],
            asociacion:{},
            muestra:false,
            indiceAsociacion:null,
        };
        this.asociacionesPedidas = false;
        this.avisaCreado = this.avisaCreado.bind(this);
        this.eliminarAsociacion = this.eliminarAsociacion.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
        this.agregarAsociacion = this.agregarAsociacion.bind(this);
        console.log("ASOCIACIONES");
    }

    agregarAsociacion(asociacion,indice){
        if(asociacion){
            if(asociacion.puestos){
                asociacion.puestos = [];
            }
        } else {
            asociacion={};
        }
        this.setState({
            asociacion:asociacion,
            muestra:true,
            indiceAsociacion: indice
        })
    }

    muestraModal(muestra){
        this.setState({
            muestra:muestra,
        })
    }

    async eliminarAsociacion(id){
        try{
            await this.queriesGenerales.eliminar("/organizacion/eliminar/"+id, {});
            let i = -1;
            for (let j = 0; j < this.state.asociaciones.length; j++){
                if(this.state.asociaciones[j].id === id) i = j;
            }
            if (i > -1){
                this.state.asociaciones.splice(i, 1);
                this.setState({});
            }
        } catch(err){
            console.log(err);
        }
    }

    async cargarAsociaciones(){
        try{
            var asociaciones = this.state.asociaciones;
            const resp = await this.queriesGenerales.obtener("/organizacion/consultarTipo/0", {});
            this.setState({
                asociaciones:asociaciones.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y  llama a
    cargar las asociaciones
    */
    componentDidMount() {
        document.title = "Asociaciones";
        if(!this.asociacionesPedidas){
            this.asociacionesPedidas = true;
            this.cargarAsociaciones();
        }
    }

    async avisaCreado(asociacion){
        var asociaciones = this.state.asociaciones;
        this.setState({
            asociaciones:asociaciones.concat(asociacion),
        });
    }

    render(){
        return (
            <>
                <div className="d-flex align-items-center justify-content-between m-3">
                    <h1>Asociaciones</h1>
                    {this.props.soloVer ? <></>:
                    <button className="btn btn-primary" onClick={()=>this.agregarAsociacion()}><i className="lni lni-plus"></i>  Agregar asociación</button>}
                </div>
                <div className="row m-0">
                    <CajasOrganizaciones organizaciones={this.state.asociaciones} modificar={this.agregarAsociacion} eliminar={this.eliminarAsociacion} soloVer={this.props.soloVer} />
                </div>
                {this.props.soloVer ? <></>:
                    <Modal size="lg" show={this.state.muestra} onHide={()=>this.muestraModal(false)} className="modal-green" centered>
                    <Modal.Body>
                        <OrganizacionForm titulo={"Asociación"} avisaCreado={this.avisaCreado} campos={this.state.asociacion} cerrarModal={()=>this.muestraModal(false)} />
                    </Modal.Body>
                    </Modal>
                    }
            </>
        );

        
    }
}

export default Asociaciones;