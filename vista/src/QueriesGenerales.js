import axios from 'axios'

export async function postear(url, datos){
    const resp = await axios.post(url, datos);
    return resp;
}

export async function obtener(url, datos){
    const resp = await axios.get(url, datos);
    return resp;
}

export async function modificar(url, datos){
    const resp = await axios.put(url, datos);
    return resp;
}

export async function eliminar(url, datos){
    const resp = await axios.delete(url, datos);
    return resp;    
}