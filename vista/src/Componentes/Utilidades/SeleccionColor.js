import { useState } from 'react';
import { ChromePicker  } from 'react-color';

export const SeleccionColor = (props) => {
  const [verColores, setVerColores] = useState(false);
  return (
    <>
    <input
      type="text"
      className="form-control"
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      onFocus={()=>setVerColores(true)} />
    {verColores ?
      <div onBlur={()=>setVerColores(false)} id={props.id} tabIndex={-1}>
        <ChromePicker
          color={props.value}
          onChange={(e)=>{props.onChangeComplete(e);}}
          onChangeComplete={(e)=>{document.getElementById(props.id).focus();props.onChangeComplete(e);}} />
      </div>
    :
      <></>}
    </>
  )
};