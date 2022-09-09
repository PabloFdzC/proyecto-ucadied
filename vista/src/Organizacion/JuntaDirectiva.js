import React from 'react';
import MiembroJuntaDirectivaForm from './MiembroJuntaDirectivaForm.js';
import JuntaDirectivaForm from './JuntaDirectivaForm.js';

class JuntaDirectiva extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <JuntaDirectivaForm />
                <MiembroJuntaDirectivaForm />
            </div>
        );
    }
}

export default JuntaDirectiva;