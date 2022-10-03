import React from 'react';
import OrganizacionForm from '../Organizacion/OrganizacionForm';
import QueriesGenerales from "../QueriesGenerales";
import { Link } from 'react-router-dom';
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
            ingresaJunta:true,
            muestra:false,
        }
        this.asociacionesPedidas = false;
        this.titulos = [
            {llave:"nombre",valor:"Asociación"},
            {llave:"cedula",valor:"Cédula"},
            {llave:"domicilio",valor:"Domicilio"},
            {llave:"territorio",valor:"Territorio"},
            {llave:"telefonos",valor:"Telefonos"},
        ];
        this.avisaCreado = this.avisaCreado.bind(this);
        this.eliminarAsociacion = this.eliminarAsociacion.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
        this.agregarAsociacion = this.agregarAsociacion.bind(this);
    }

    agregarAsociacion(){
        this.setState({
            asociacion:{},
            ingresaJunta:true,
            muestra:true,
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

    componentDidMount() {
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

    modificarAsociacion(asociacion){
        asociacion.puestos = [];
        this.setState({
            ingresaJunta: false,
            asociacion:asociacion,
            muestra:true,
        });
    }

    render(){
        var asociaciones;
        if(this.state.asociaciones.length > 0){
            asociaciones = this.state.asociaciones.map((a, i) =>{
                return (
                <div className="col-sm-12 col-md-4 d-flex flex-column" key={"aCol"+i} style={i%2===0 ? {backgroundColor:"#137E31",color:"#FFFFFF"} : {backgroundColor:"#76B2CE",color:"#160C28"}}>
                    <div className="row">
                        <div className="col">
                            <div className="container p-3" key={"aCont"+i}>
                                <h3 key={"t"+i}>{a.nombre}</h3>
                                <p key={"c"+i}>Cédula jurídica: {a.cedula}</p>
                                <p key={"d"+i}>Domicilio: {a.domicilio}</p>
                                <p key={"te"+i}>Territorio: {a.territorio}</p>
                                <p key={"tels"+i}>Telefonos:</p>
                                {a.telefonos.map((t, j) => 
                                    <div className="m-2 p-2" key={"encC"+i+"-"+j} style={{backgroundColor:"#160C28",borderRadius:"0.2em",color:"#fff"}}>
                                        <p key={"tels"+i+"-"+j}>{t}</p>
                                    </div>
                                )}
                            
                            </div>
                        </div>
                        <div className="col d-flex flex-column p-3">
                        {this.props.soloVer ?
                                <Link key={"v"+i} className="btn btn-primary" to={"/principal/"+a.id}>Visitar</Link> :
                                <>
                                    <Link key={"v"+i} className="btn btn-primary m-1" to={"/principal/"+a.id}><i className="lni lni-website"></i> Visitar</Link>
                                    <button key={"m"+i} className="btn btn-dark m-1" onClick={()=>this.modificarAsociacion(a,i)}><i className="lni lni-pencil-alt"></i>  Modificar</button>
                                    <Link key={"jd"+i} className="btn btn-info m-1" to={"/presidencia/juntaDirectiva/"+a.id}><i className="lni lni-users"></i> Junta Directiva</Link>
                                    <button key={"e"+i} className="btn btn-danger m-1" onClick={()=>this.eliminarAsociacion(a.id)}><i className="lni lni-trash-can"></i> Eliminar</button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            );
            });
        }
        return (
            <>
                <div className="d-flex align-items-center justify-content-between m-3">
                    <h1>Asociaciones</h1>
                    {this.props.soloVer ? <></>:
                    <button className="btn btn-primary" onClick={this.agregarAsociacion}><i className="lni lni-plus"></i>  Agregar asociación</button>}
                </div>
                <div className="row m-0">
                    {asociaciones}
                </div>
                {this.props.soloVer ? <></>:
                    <Modal size="lg" show={this.state.muestra} onHide={()=>this.muestraModal(false)} className="modal-green" scrollable>
                    <Modal.Body>
                        <OrganizacionForm ingresaJunta={this.state.ingresaJunta} titulo={"Asociación"} avisaCreado={this.avisaCreado} campos={this.state.asociacion} cerrarModal={()=>this.muestraModal(false)} />
                    </Modal.Body>
                    </Modal>
                    }
            </>
        );

        
    }
}

export default Asociaciones;