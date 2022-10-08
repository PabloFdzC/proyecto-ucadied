import React, { useState } from "react";
import Modal from "../Modal/Modal";

import DataTable , { createTheme }from 'react-data-table-component';

function Table(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [tituloTabla, setTituloTabla] = useState("Titulo");
  const [columnas, setColumnas] = useState();
  const [datos, setDatos] = useState();
  const [editar, setEditar] = useState();
  const [eliminar, setEliminar] = useState();

  /*------------------CODIGO PARA GUIARSE DE COMO FUNCIONA EL CARGAR LA TABLA----------*/
  const columns = props.titulos.concat([
    {
      name:'Acciones',
      button: true,
      cell: () => (
        <>
        <div style={{marginRight:"1em"}}>
          <button type="button" className="btn btn-primary" onClick={onEditButtonClick} >
          <i className="lni lni-pencil-alt"></i>
          </button>
        </div>
          <button type="button" className="btn btn-danger" onClick={onXButtonClick} >
          <i className="lni lni-trash-can"></i>
          </button>
        </>
      )
    }
  ]);

  const tableInformation = props.datos;

  /*------------------CODIGO PARA GUIARSE DE COMO FUNCIONA EL CARGAR LA TABLA----------*/
  
  const paginationOptions = {
    rowsPerPageText: "Resultados por página",
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos'
  };

  createTheme('solarized', {
    background: {
      default: '#137E31',
    },
    context: {
      background: '#cb4b16',
      text: '#f2f2f2',
    },
    divider: {
      default: '#f2f2f2',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
  }, 'dark');



  const onEditButtonClick = () => {
    alert("CLICK EN EDITAR EJEMPLO");
    setModalOpen(true);
  };

  const onXButtonClick = () => {
    alert("CLICK EN X EJEMPLO");
    setModalOpen(true);
  };

  return (
    <DataTable
            columns={columns}
            data={tableInformation}
            pagination
            paginationComponentOptions={paginationOptions}
            fixedHeaderScrollHeight='400px'
            className="p-2"
            theme="solarized"
          />
  );
}

export default Table;
