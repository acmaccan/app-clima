// Importamos fileSystem
const fs = require('fs');

// Importamos axios
const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/database.json';
    
    constructor() {
        // Leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map(lugar =>{
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token' : process.env.MAPBOX_KEY,
            'limit' : 5,
            'language' : 'es'
        }
    }

    async ciudad ( lugar = ''){
        // Petición HTTP para traer información, siempre con try catch
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({ // Retornamos lugar según búsqueda de user
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            return[]; // Arreglo vacío porque no encontró nada
        }
        
    }

    get paramsOpenWeather() {
        return {
            appid : process.env.OPENWEATHER_KEY,
            units : 'metric',
            lang : 'es'
        }
    }

    async climaLugar(lat, lon) {
        // Petición HTTP para traer información, siempre con try catch
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}
            });

            const resp = await instance.get();

            // Retornamos lugar según búsqueda de user
            const {weather, main} = resp.data;             
            return { 
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };

        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = ''){
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        };

        // Mantengo hasta 6 ciudades en mi historial
        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        //Guardar en DB
        this.guardarDB();
    }
    // Grabar búsquedas en arreglo
    guardarDB(){
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload)); //Serializar
    }
    leerDB(){
    // Si no existiera el archivo
    if(!fs.existsSync(this.dbPath)) return;

    // Si existiera
    const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
    const data = JSON.parse(info); // Deserializar

    this.historial = data.historial;
    }
}

// Exportamos módulos para tenerlos disponibles a requerirlos en otros archivos
module.exports = Busquedas;