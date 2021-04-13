const fs = require("fs");
const axios = require("axios");


class Busquedas {

    historial = [];
    dbPath = "./db/database.json"

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map(ciudad => {

            let palabras = ciudad.split(" ");
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(" ");

        });
    }

    async ciudad(lugar = "") {

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: {
                    "access_token": process.env.MAPBOX_KEY,
                    "limit": 5,
                    "language": "es"
                }
            });

            const resp = await instance.get();


            //retornamos un objeto de forma explicita
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));




            return [];//retornar los lugares q coincidan
        } catch (error) {
            console.error(error);
        }

    }

    async climaLugar(lat, lon) {
        try {
            //intance axios.create()
            //resp.data

            //return {desc, min, max, temp}

            const instance = axios.create({
                baseURL: "https://api.openweathermap.org/data/2.5/weather",
                params: {
                    "lat": lat,
                    "lon": lon,
                    "appid": process.env.OPEN_WEATHER,
                    "units": "metric",
                    "lang": "es"
                }
            })

            const resp = await instance.get(); 

            return {
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                temp: resp.data.main.temp,
                description: resp.data.weather[0].description
            }

            
        } catch (err) {
            console.error(err);
        }
    }

    agregarHistorial(lugar = ""){

        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        //prevenir duplicado
        this.historial.unshift(lugar.toLocaleLowerCase());

        //grabar en db
        this.guardarDB();


    }

    guardarDB(){

        const payload = {
            historial: this.historial
        }


        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){
        if(!fs.existsSync(this.dbPath)) return;

        const info =  fs.readFileSync(this.dbPath, {encoding: "utf-8"});
        const data = JSON.parse(info);

        this.historial = data.historial;

    }
}

module.exports = Busquedas;