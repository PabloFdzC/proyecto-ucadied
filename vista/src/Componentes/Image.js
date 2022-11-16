import { useNode } from '@craftjs/core';
import Form from 'react-bootstrap/Form';

import React, { useState, useEffect, useContext } from 'react';
import { GlobalURLSettings, GlobalDimensionsSettings } from './GlobalSettings';
import Accordion from 'react-bootstrap/Accordion';

import { unidades } from './Utilidades/Utilidades';

import logoUcadied from '../Imagenes/logo-UCADIED.png';
import QueriesGenerales from '../QueriesGenerales';
import {usuarioContexto} from '../usuarioContexto';

import './css/estilos.css';

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
        const queriesG = new QueriesGenerales();
        const resp = await queriesG.obtener("/pagina/consultarArchivos",{
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
            console.log(resp.data);
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

    return (
        <div className="p-2">
            <Form>
                <h5>Lista de imágenes</h5>
                <div className="row overflow-auto p-1" style={{maxHeight:"200px"}}>
                    {imagenes.map((value, index)=>
                        <div className="col-4 p-0 selecciona-imagen" key={index} onClick={()=>setProp((p) => (p.src = queriesGGlobal.url+value.url))}>
                            <img className="w-100" key={"img"+index} src={queriesGGlobal.url+value.url} />
                        </div>
                    )}
                </div> 
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