import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";

const AddEventModal = ({ isAddOpen, onAddClose, seleccionFechaInicio, seleccionFechaFin }) => {
  const [nombre, setNombre] = useState("");
  const [tipoActividad, setTipoActividad] = useState("");
  const [inmueble, setInmueble] = useState("");
  const [horaInicio, setHoraInicio] = useState();
  const [horaFinal, setHoraFinal] = useState();


  useEffect(() => {
    setHoraInicio();
    setHoraFinal();
  }, [isAddOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddClose();
  };

  return (
    <div>
      <Modal visible={isAddOpen} toggle={onAddClose} title="Actividad">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input type="text" className="form-control" id="nombre" placeholder="" aria-describedby="nombre" onChange={(e) => setNombre(e.target.value)} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="tipoActividad" className="form-label">Tipo actividad</label>
            <input type="text" className="form-control" id="tipoActividad" placeholder="" aria-describedby="tipoActividad" onChange={(e) => setTipoActividad(e.target.value)} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="inmueble" className="form-label">Inmueble</label>
            <input type="text" className="form-control" id="inmueble" placeholder="" aria-describedby="inmueble" onChange={(e) => setInmueble(e.target.value)} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="horaInicio" className="form-label">Hora inicio</label>
            <input type="datetime-local" className="form-control" required id="horaInicio" aria-describedby="horaInicio" defaultValue={seleccionFechaInicio} 
          />
          </div>
          <div className="mb-3">
            <label htmlFor="horaFinal" className="form-label">Hora final</label>
            <input type="datetime-local" className="form-control" required id="horaFinal" aria-describedby="horaFinal" defaultValue={seleccionFechaFin} 
          />
          </div>
          <button type="button" name="delete" className="btn btn-danger" style={{ marginRight: "2em"}} onClick={()=> onAddClose()}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Agendar</button>
        </form>
      </Modal>
    </div>
  );
};

export default AddEventModal;
