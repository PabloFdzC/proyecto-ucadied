import axios from 'axios'

class QueriesGenerales {
    constructor(config){
        if(!config){
            config = {};
        }
        this.url = config.url ? config.url : "http://132.226.153.180:8080/"; 
        this.http = axios.create({
            baseURL: this.url, 
            headers: (typeof config.headers) === "object" &&  config.headers ? config.headers : {
            "Content-type": "application/json"
            },
            withCredentials: true
        })
    }
    

    async postear(url, datos){
        const resp = await this.http.post(url, datos);
        return resp;
    }

    async obtener(url, datos){
        const resp = await this.http.get(url, {params:datos});
        return resp;
    }

    async modificar(url, datos){
        const resp = await this.http.put(url, datos);
        return resp;
    }

    async eliminar(url, datos){
        const resp = await this.http.delete(url, datos);
        return resp;    
    }
}

export default QueriesGenerales;