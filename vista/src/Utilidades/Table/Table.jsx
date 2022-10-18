import React from "react";

import DataTable , { createTheme }from 'react-data-table-component';

function agregaAcciones(acciones, columnas){
  if(acciones && Array.isArray(acciones)){
    return columnas.concat([
      {
        name:'Acciones',
        button: true,
        cell: (valor,j) => (
          <>
            {acciones.map((accion,i)=>
            <button key={i} type="button" className={"btn "+accion.className+" m-1"} onClick={()=>accion.onClick(valor,j)} >
              {accion.icon ? <i className={"lni "+ accion.icon}></i>:<></>}
              {accion.texto ? accion.texto : <></>}
            </button>)}
          </>
        )
      }
    ]);
  }
  return columnas;
}

/*
Recibe los props:
titulos: lista de objetos con la forma
    {
      name: string con nombre del título de la columna
          que se muestra en la tabla,
      selector: función indica como se muestra el dato
          en el campo,
      también se pueden poner otras opciones que aparezcan
      en la documentación de react-data-table-component
      los dos anteriores son los principales que se ocupan
    }
titulosAnidados: lo mismo que el anterior, pero solo
    es necesario si se quiere que una fila tenga una
    tabla desplegable con acciones
valorAnidado: string que indica de dónde se deben sacar
    los valores anidados, es completamente necesario si
    se usa titulos anidados
acciones: lista de objetos con la forma
    {
      className: string para ponerle la clase que
          le da el color al botón,
      onClick: función para que el botón haga algo,
      icon: string con la clase para saber cuál
          ícono usará el botón,
      texto: string texto que se le pone al botón,
    }
accionesAnidadas: lo mismo que el anterior, pero solo
    es necesario si se quiere que una fila tenga una
    tabla desplegable
pagination: booleano para saber si se debe hacer
    que la tabla tenga paginación
*/
function Table(props) {
  
  var columnas = props.titulos;
  columnas = agregaAcciones(props.acciones, columnas);
  
  var columnasAnidadas = props.titulosAnidados;
  columnasAnidadas = agregaAcciones(props.accionesAnidadas, columnasAnidadas);
  
  const paginationOptions = {
    rowsPerPageText: "Resultados por página",
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos'
  };

  createTheme('tablaEstilo', {
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

  createTheme('tablaAnidadaEstilo', {
    background: {
      default: '#209B42',
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

  const ValoresAnidados = props.titulosAnidados ? 
  ({ data }) =>
    <DataTable
      columns={columnasAnidadas}
      data={data[props.valorAnidado]}
      fixedHeaderScrollHeight='400px'
      theme="tablaAnidadaEstilo"
      noDataComponent="No hay datos para mostrar"
    />
    : null;


  return (
    <DataTable
            columns={columnas}
            data={props.datos}
            pagination={props.pagination}
            paginationComponentOptions={props.pagination ? paginationOptions : null}
            fixedHeaderScrollHeight='400px'
            className="p-2"
            theme="tablaEstilo"
            noDataComponent="No hay datos para mostrar"
            expandableRows={ValoresAnidados != null}
            expandableRowsComponent={ValoresAnidados}
            expandOnRowClicked={true}
          />
  );
}

export default Table;
