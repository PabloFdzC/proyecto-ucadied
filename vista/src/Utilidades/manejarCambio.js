function manejarCambio(evento, componente){
    const objetivo = evento.target;
    const valor = objetivo.type === 'checkbox' ? objetivo.checked : objetivo.value;
    const nombre = objetivo.name;

    
    componente.setState({
        campos: Object.assign({}, componente.state.campos, {
            [nombre]: valor,
        }),
        errores: Object.assign({}, componente.state.errores, {
            [nombre]: "",
        })
    });
}

export default manejarCambio;