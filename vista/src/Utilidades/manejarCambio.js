function manejarCambio(evento, componente){
    const objetivo = evento.target;
    const valor = objetivo.type === 'checkbox' ? objetivo.checked : objetivo.value;
    const nombre = objetivo.name;

    var estadoNuevo = {};
    estadoNuevo[nombre] = valor;
    componente.setState(estadoNuevo);
}

export default manejarCambio;