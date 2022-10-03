import React from 'react';
import manejarCambio from './manejarCambio';

class Elementos extends React.Component {
    constructor(props){
        super(props);
        this.eliminarElemento = this.props.eliminarElemento;
        this.elementos = this.props.elementos;
    }



    render(){
        return (
            <div className="m-3 pl-4 pr-4">    
                {this.props.elementos.map((elemento, i) =>(
                    <div className="container m-2  p-2" key={"tCont"+i} style={{backgroundColor:"#160C28",borderRadius:"0.2em"}}>
                        <div className="d-flex justify-content-between" key={"tContR"+i} style={{maxWidth:"100%"}}>
                            {this.props.conId ? 
                            <>
                            <span className="align-middle"  key={"t"+i}>{elemento.label}</span>
                            <button type="button" className="btn btn-danger" key={"tb"+i} onClick={() => this.props.eliminarElemento(i,elemento)}><i className="lni lni-trash-can"></i></button>
                            </> :
                            <>
                            <span className="align-middle"  key={"t"+i}>{elemento}</span>
                            <button type="button" className="btn btn-danger" key={"tb"+i} onClick={() => this.props.eliminarElemento(i,elemento)}><i className="lni lni-trash-can"></i></button>
                            </>
                            }
                        </div>
                    </div>
                    ))}
            </div>
        );
    }
}

export default Elementos;