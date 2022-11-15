import { useNode } from '@craftjs/core';
import Form from 'react-bootstrap/Form';

import React from 'react';
import { GlobalURLSettings, GlobalDimensionsSettings } from './GlobalSettings';
import Accordion from 'react-bootstrap/Accordion';

import { unidades } from './Utilidades/Utilidades';

import logoUcadied from '../Imagenes/logo-UCADIED.png';

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
    width += widthCustom ? " " + widthUnit : "";
    height += heightCustom ? " " + heightUnit : "";
    return (
        <img
          ref={(ref) => connect(drag(ref))}
          style={{width, height}}
          src={src}
        />    
    )
};

export const ImageSettings = () => {
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

    return (
        <div className="p-2">
            <Form>
                <Accordion>
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
                    <Accordion.Item eventKey="URL">
                        <Accordion.Header>URL</Accordion.Header>
                        <Accordion.Body>
                        <GlobalURLSettings
                            setProp={setProp}
                            src={src} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Form>
        </div>
    );
};

export const ImageDefaultProps = {
    width:100,
    widthCustom:true,
    widthUnit:unidades[3],
    height:100,
    heightCustom:true,
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