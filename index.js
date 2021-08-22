// Importamos menú desde helper inquirer
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");

// Importamos modelo
const Busquedas = require('./models/busquedas');

// Importamos dot.env
require('dotenv').config();

// Llamamos a nuestro archivo env
//console.log(process.env.MAPBOX_KEY);
//console.log(process.env.OPENWEATHER_KEY);

// Creamos el main
const main = async() =>{
    let opt;
    const busquedas = new Busquedas();

    do{
        // Imprimimos el menú
        opt = await inquirerMenu();
        //console.log({opt});
        
        switch(opt) {
            case 1:
                // Le solicitamos al user que ingrese un lugar
                const lugar = await leerInput('Ciudad: '); 
                
                // Buscamos lugares
                const lugares = await busquedas.ciudad(lugar);
                
                // Seleccionar lugar
                const idSeleccionado = await listarLugares(lugares);

                if(idSeleccionado === '0') continue;
                const lugarSeleccionado = lugares.find(l => l.id === idSeleccionado);

                // Guardamos historial
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                // Clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);

                // Mostramos resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSeleccionado.nombre.green);
                console.log('Lat: ', lugarSeleccionado.lat);
                console.log('Lng: ', lugarSeleccionado.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Mínima: ', clima.min);
                console.log('Máxima: ', clima.max);
                console.log('Como está el clima: ', clima.desc.green);
                break;

            case 2:
                // Historial
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
                break;
        }

        // Agregamos pausa
        await pausa();

    // Mientras no sea 0. Al ser 0 salir de app
    } while (opt !== '0');
};

// Ejecutamos el main
main();