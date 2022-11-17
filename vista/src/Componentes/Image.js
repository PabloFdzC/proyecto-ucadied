import { useNode } from '@craftjs/core';
import Form from 'react-bootstrap/Form';

import React, { useState, useEffect, useContext } from 'react';
import { GlobalURLSettings, GlobalDimensionsSettings } from './GlobalSettings';

import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';

import { unidades } from './Utilidades/Utilidades';

import logoUcadied from '../Imagenes/logo-UCADIED.png';
import QueriesGenerales from '../QueriesGenerales';
import {usuarioContexto} from '../usuarioContexto';
import ConfirmaAccion from '../Utilidades/ConfirmaAccion';

import './css/estilos.css';
import { buscarEnListaPorId } from '../Utilidades/ManejoLista';

export const Image = ({
    width,
    widthUnit,
    widthCustom,
    height,
    heightUnit,
    heightCustom,
    src,
    ...props }) => {
    const {
        connectors: { connect, drag },
    } = useNode();
    width += widthCustom ?  widthUnit : "";
    height += heightCustom ? heightUnit : "";
    return (
        <img
          ref={(ref) => connect(drag(ref))}
          style={{width, height}}
          src={src}
        />    
    )
};

export const ImageSettings = () => {
    const cargado = false;
    const [imagenes, setImagenes] = useState([]);
    const [errorImagenes, setErrorImagenes] = useState("");
    const [imagen, setImagen] = useState({});
    const [muestra, setMuestra] = useState(false);
    const [mensajeModal, setMensajeModal] = useState("");

    const {
        width,
        widthUnit,
        widthCustom,
        height,
        heightUnit,
        heightCustom,
        src,
        actions: { setProp },
    } = useNode((node) => ({
        width:node.data.props.width,
        widthUnit:node.data.props.widthUnit,
        widthCustom:node.data.props.widthCustom,
        height:node.data.props.height,
        heightUnit:node.data.props.heightUnit,
        heightCustom:node.data.props.heightCustom,
        src:node.data.props.src,
    }));
    const queriesGGlobal = new QueriesGenerales();
    const contexto = useContext(usuarioContexto);

    const cargarImagenes = async () =>{
        const resp = await queriesGGlobal.obtener("/pagina/consultarArchivos",{
            id_organizacion: contexto.organizacion.id,
        });
        setImagenes(resp.data);
    };

    const subirImagenes = async (evento) =>{
        setErrorImagenes("");
        const imagenesParaSubir = evento.target.files;
        const queriesG = new QueriesGenerales({
            headers:{'content-type': 'multipart/form-data'}
        });
        const formData = new FormData();
        formData.append("id_organizacion", contexto.organizacion.id);
        for(let i = 0; i < imagenesParaSubir.length; i++){
            formData.append("archivos", imagenesParaSubir[i]);
        }
        try{
            const resp = await queriesG.postear("/pagina/subirArchivos",formData);
            setImagenes(imagenes.concat(resp.data));
        }catch(error){
            console.log(error);
            setErrorImagenes(imagenesParaSubir.length > 1 ? "No se pudieron subir las imágenes":"No se pudo subir la imagen");
        }
        
    };

    useEffect(() => {
        async function cargar(){
            await cargarImagenes();
        }
        cargar();
      }, [cargado]);

    const seleccionaImagen = (img) => {
        if(imagen.id === img.id){
            setImagen({});
        } else {
            setImagen(img);
        }
    }

    const muestraModal = (muestra) =>{
        if((muestra && imagen.id && !isNaN(imagen.id) || !muestra)){
            setMuestra(muestra);
        }
    }

    const eliminarImagen = async () => {
        try{
            const resp = await queriesGGlobal.eliminar("/pagina/eliminarArchivo/"+imagen.id,{});
            const indice = buscarEnListaPorId(imagenes, imagen.id);
            if(indice > -1){
                imagenes.splice(indice, 1);
            }
            await setMensajeModal("¡Eliminada con éxito!");
            if(queriesGGlobal.url+imagen.url === src){
                setProp((p) => {
                    p.src = logoUcadied;
                    setImagen({});
                });
            }
        }catch(error){
            console.log(error);
        }
    }

    const usarImagen = () => {
        if(imagen.id && !isNaN(imagen.id)){
            setProp((p) => {
                p.src = queriesGGlobal.url+imagen.url;
                setImagen({});
            });
        }
    }

    return (
        <>
        <div className="p-2">
            <Form>
                <div className="mb-3 position-relative">
                    <label htmlFor="formFile" className="form-label">Subir imagen</label>
                    <input
                        className={errorImagenes.length > 0 ? "form-control is-invalid":"form-control"}
                        type="file"
                        name="files"
                        id="formFile"
                        accept=".png, .jpg, .jpeg, .gif" onChange={subirImagenes} multiple />
                    <div className="invalid-tooltip">
                        {errorImagenes}
                    </div>
                </div>
                <h5>Lista de imágenes</h5>
                <div className="row overflow-auto p-1" style={{maxHeight:"200px"}}>
                    {imagenes.map((value, index)=>
                        <div className={"col-4 p-0 selecciona-imagen" + (imagen.id === value.id ? " seleccionada-imagen": "")} key={index} onClick={()=>seleccionaImagen(value)}>
                            <img className="w-100" key={"img"+index} src={queriesGGlobal.url+value.url} />
                        </div>
                    )}
                </div> 
                <div className="row">
                    <div className="col">
                        <button type="button" className="btn btn-danger" onClick={muestraModal}>
                            <i className="lni lni-trash-can"></i>
                              Eliminar imagen
                            </button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-primary" onClick={usarImagen}>
                            <i className="lni lni-checkmark-circle"></i>
                              Usar imagen
                        </button>
                    </div>
                </div>
                <Accordion>
                    <Accordion.Item eventKey="URL">
                        <Accordion.Header>URL</Accordion.Header>
                        <Accordion.Body>
                        <GlobalURLSettings
                            setProp={setProp}
                            src={src} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="Dimensiones">
                        <Accordion.Header>Dimensiones</Accordion.Header>
                        <Accordion.Body>
                        <GlobalDimensionsSettings
                            setProp={setProp}
                            unitName="widthUnit"
                            id="width"
                            value={width}
                            unit={widthUnit}
                            name="Ancho"
                            custom={widthCustom}
                            customName="widthCustom" />
                        <GlobalDimensionsSettings
                            setProp={setProp}
                            unitName="heightUnit"
                            id="height"
                            value={height}
                            unit={heightUnit}
                            name="Alto"
                            custom={heightCustom}
                            customName="heightCustom" />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Form>
        </div>
        <Modal show={muestra} onHide={()=>muestraModal(false)} className="modal-green" centered>
        <Modal.Body>
            {mensajeModal === "" ?
                <ConfirmaAccion claseBtn={"btn-danger"} titulo={"¿Desea eliminar la imagen seleccionada?"} accion={eliminarImagen} cerrarModal={()=>muestraModal(false)} accionNombre="Eliminar" />
            :
                <>
                    <h3 className="text-center">{mensajeModal}</h3>
                    <div className="d-flex justify-content-end">
                        <div className="m-1">
                            <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>muestraModal(false)}>Volver</button>
                        </div>
                    </div>
                </>
            }
            
        </Modal.Body>
        </Modal>
        </>
    );
};

export const ImageDefaultProps = {
    width:100,
    widthCustom:false,
    widthUnit:unidades[3],
    height:100,
    heightCustom:false,
    heightUnit:unidades[3],
    src: logoUcadied
  };

Image.craft = {
    displayName: 'Imagen',
    props: ImageDefaultProps,
    related: {
        settings: ImageSettings,
    },
};