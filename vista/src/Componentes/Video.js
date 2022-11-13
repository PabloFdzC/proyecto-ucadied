import { useNode } from '@craftjs/core';
import Form from 'react-bootstrap/Form';

import React from 'react';
import { GlobalURLSettings, GlobalDimensionsSettings } from './GlobalSettings';
import Accordion from 'react-bootstrap/Accordion';

export const Video = ({
    width,
    height,
    src,
    ...props }) => {
    const {
        connectors: { connect, drag },
    } = useNode();
    return (
        <div class="embed-responsive embed-responsive-16by9" ref={(ref) => connect(drag(ref))}>
            <iframe class="embed-responsive-item" 
                src={src}
                width = {width}
                height = {height}
                {...props}
                allowfullscreen
                ></iframe>  
        </div>      
    )
};

export const VideoSettings = () => {
    const {
        width,
        height,
        src,
        actions: { setProp },
    } = useNode((node) => ({
        width:node.data.props.width,
        height:node.data.props.height,
        src:node.data.props.src,
    }));

    return (
        <div>
            <Form>
                <Accordion>
                    <Accordion.Item eventKey="Dimensiones">
                        <Accordion.Header>Dimensiones</Accordion.Header>
                        <Accordion.Body>
                        <GlobalDimensionsSettings
                            setProp={setProp}
                            width={width}
                            height={height} />
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

export const VideoDefaultProps = {
    width:420,
    height:345,
    src: 'https://www.youtube.com/embed/jNQXAC9IVRw'
  };

Video.craft = {
    props: VideoDefaultProps,
    related: {
        settings: VideoSettings,
    },
};