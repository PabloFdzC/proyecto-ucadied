import React, { useState } from "react";
import Modal from "../Modal/Modal";

import DataTable , { createTheme }from 'react-data-table-component';
import { PencilSquare, XLg  } from 'react-bootstrap-icons';

function Table(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [tituloTabla, setTituloTabla] = useState("Titulo");
  const [columnas, setColumnas] = useState();
  const [datos, setDatos] = useState();
  const [editar, setEditar] = useState();
  const [eliminar, setEliminar] = useState();

  /*------------------CODIGO PARA GUIARSE DE COMO FUNCIONA EL CARGAR LA TABLA----------*/
  const columns = [
    {
        name:'Nombre',
        selector:row=>row.name,
        sortable:true
    },
    {
        name:'Puesto',
        selector:row=>row.rol,
        sortable:true
    },
    {
        name:'Función',
        selector:row=>row.fuction,
        sortable:true,
    },
    {
      button: true,
      cell: () => (
        <>
        <div style={{marginRight:"1em"}}>
          <button type="button" className="btn btn-secondary" onClick={onEditButtonClick} style={{background:"rgb(118, 178, 206)", color: "#f2f2f2"}}>
            <PencilSquare />
          </button>
        </div>
          <button type="button" className="btn btn-primary" onClick={onXButtonClick} style={{background:"red", color: "#F5F0F6"}}>
            <XLg />
          </button>
        </>
      )
    }
  ];

  const tableInformation = [
    {id:"1", name:"Juan Pérez", rol:"Administrador", fuction:"Toma de decisiones", actions:''},
    {id:"2", name:"Luis Vega", rol:"Administrador", fuction:"Toma de decisiones", actions:''},
    {id:"3", name:"Jeremy Del Valle", rol:"Administrador", fuction:"Toma de decisiones", actions:''},
    {id:"4", name:"Aitor Tilla", rol:"Administrador", fuction:"Toma de decisiones", actions:''},
    {id:"5", name:"Johana Víquez", rol:"Administrador", fuction:"Toma de decisiones", actions:''},
    {id:"6", name:"Victor Tazo", rol:"Secretario", fuction:"Administración", actions:''},
    {id:"7", name:"Johnny Melavo", rol:"Secretario", fuction:"Administración", actions:''},
    {id:"8", name:"Elsa Polindo", rol:"Secretario", fuction:"Administración", actions:''},
    {id:"9", name:"Marta Caña", rol:"Secretaria", fuction:"Administración", actions:''},
  ];

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
    <div >
      <div>
          <DataTable
            title= {tituloTabla}
            columns={columns}
            data={tableInformation}
            pagination
            paginationComponentOptions={paginationOptions}
            fixedHeaderScrollHeight='400px'
            style={{background:"red", color: "#F5F0F6"}}
            theme="solarized"
          />
          /*
          {/*
          <DataTable
            title= {tituloTabla}
            columns={columnas}
            data={datos}
            pagination
            paginationComponentOptions={paginationOptions}
            fixedHeaderScrollHeight='400px'
          />
          */}
      </div>
      <div>
        {/* 
          <Modal 
            visible={modalOpen} title={"Agregar un nuevo usuario"}  toggle={() => setModalOpen(false)}>
              <button className='btn btn-info' >{"Click"}</button>
          </Modal> */
        }
      </div>
    </div>
  );
}

export default Table;
