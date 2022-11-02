import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";

import './Calendar.css';

const Calendar = (props) => {
  const [events, setEvents] = useState([
    {title: "EVENTO HORA", start: new Date()},
    {title: "EVENTO DIA", start: "2022-10-05", end: "2020-10-08"},
]);
  //^^ESTO ES UN EJEMPLO DE EVENTO


  const [addModalOpen, setAddModalOpen] = useState(false);
  const [start, setStartDate] = useState();
  const [end, setEndDate] = useState();
  const calendarRef = useRef(null);

  const onDateClick = (arg) => {
    const today = new Date();
    const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (arg.date >= todayAtMidnight) {
      setStartDate(arg.date.toISOString().slice(0, 16));
      setEndDate(arg.date.toISOString().slice(0, 16));
      /* setAddModalOpen(true); */
      alert("Selección hoy o futuro.  Fecha:" + arg.date);
    }
    else{
      alert("Selección fecha pasada.  Fecha:" + arg.date);
    }
  };

  const onEventClick = (info) => {
    alert("Click sobre evento")
    //Cuando se le da click a un evento mostado en el calendario caerá acá
  };

  return (
    <div style={props.style}>
      <FullCalendar
            /* customButtons={{myCustomButton: {text: 'Agregar Inmueble',click: function() {alert('Boton presionado!');},},}} */
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={onDateClick}
            eventClick={onEventClick}
            locale={"es"}
            editable={true}
            events={events}
            aspectRatio={2}
            headerToolbar={{ left: 'prev next', center: 'title', right: ''  }}
          />
    </div>
  );
};

export default Calendar;