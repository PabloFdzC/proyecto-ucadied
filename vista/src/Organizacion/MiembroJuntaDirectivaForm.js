import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import Validacion from '../Utilidades/Validacion';
import manejarCambio from '../Utilidades/manejarCambio';
import Select from 'react-select';

class MiembroJuntaDirectivaForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.campos = props.campos;
        var campos = {
            id_usuario: "",
            id_puesto_jd: "",
        };
        if(props.campos){
            campos = {
                id_usuario: props.campos.id_usuario ? props.campos.id_usuario : "",
                id_puesto_jd: props.campos.id_puesto_jd ? props.campos.id_puesto_jd : "",
            };
        }
        this.state = {
            campos:campos,
            errores: {
                hayError:false,
                id_usuario: "",
                id_puesto_jd: "",
            },
            usuarios:[],
            agregado:false,
        };

        this.validacion = new Validacion({
            id_usuario: "seleccionado",
            id_puesto_jd: "seleccionado",
        }, this);
        this.usuariosPedidos = false;

        this.agregarMiembro = this.agregarMiembro.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
    }

    // Falta reiniciar los otros campos
    reiniciarCampos(){
        this.setState({
            agregado:false
        });
    }

    avisaAgregado(){
        this.props.avisaAgregado();
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async agregarMiembro(evento){
        evento.preventDefault();
        console.log(this.state.campos);
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                await this.queriesGenerales.postear("/juntaDirectiva/agregarMiembro", this.state.campos);
            }catch(error){
                console.log(error);
            }
        }
    }

    async cargarUsuarios(){
        try{
            var usuarios = this.state.usuarios;
            const resp = await this.queriesGenerales.obtener("/usuario/consultar", {id_organizacion:this.props.idOrganizacion});
            var usuariosSelect = [];
            for(let usuario of resp.data){
                usuariosSelect.push({
                    label:usuario.nombre,
                    value:usuario.id,
                });
            }
            this.setState({
                usuarios:usuarios.concat(usuariosSelect),
            });
        } catch(err){
            console.log(err);
        }
    }

    componentDidMount() {
        if(!this.usuariosPedidos){
            this.usuariosPedidos = true;
            this.cargarUsuarios();
        }
    }

    render(){
        return (
            <>
            {!this.state.agregado ?
            <form onSubmit={this.agregarMiembro} className="needs-validation" noValidate>
                <div className="mb-3 position-relative">
                    <label htmlFor="id_usuario" className="form-label">Nombre</label>
                    <Select
                    className={this.state.errores.id_usuario.length > 0 ? "form-control is-invalid":"form-control"} key="id_usuario" name="id_usuario" required value={this.state.campos.id_usuario} onChange={(opcion)=>this.manejaCambio({target:{name:"id_usuario",type:"select",value:opcion}})}
                    options={this.state.usuarios}
                    />
                    <div className="invalid-tooltip">
                        {this.state.errores.id_usuario}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="id_puesto_jd" className="form-label">Puesto</label>
                    <select className={this.state.errores.id_puesto_jd.length > 0 ? "form-select is-invalid":"form-select"} aria-label="nacionalidad" key="id_puesto_jd" name="id_puesto_jd" value={this.state.campos.nacionalidad} onChange={this.manejaCambio} >
                        <option defaultValue>Puesto</option>
                        {this.props.puestos.map((u,i) => <option key={i} value={u.id}>{u.nombre}</option>)}
                    </select>
                    <div className="invalid-tooltip">
                        {this.state.errores.id_puesto_jd}
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <div className="m-1">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Volver">Volver</button>
                    </div>
                    <div className="m-1">
                        <button type="submit" className="btn btn-primary">Agregar</button>
                    </div>
                </div>
            </form>
            :
            <div className="d-flex justify-content-end">
                <div className="m-1">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Volver" onClick={this.reiniciarCampos}>Volver</button>
                </div>
            </div>}
            </>
        );
    }
}

export default MiembroJuntaDirectivaForm;