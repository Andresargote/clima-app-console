const { leerInput, inquireMenu, pause, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busqedas");
const {agregarHistorial} = require("./models/busqedas");
require("dotenv").config();

const main = async () => {
    let opt;
    const busquedas = new Busquedas();

    do {

        opt = await inquireMenu();

        switch(opt){
            case 1:
                //mostrar mensaje
                const lugar = await leerInput("Ciudad: ");

                //buscar los lugares
                const lugares = await busquedas.ciudad(lugar);
                const idSeleccionado = await listarLugares(lugares);
                if(idSeleccionado === "0") continue;

                //sellecionar el lugar
                const lugarSeleccionado = lugares.find(lugar => lugar.id === idSeleccionado);

                //guardar en db
                busquedas.agregarHistorial(lugarSeleccionado.nombre)

                //clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);

                //mostrar resultados

                console.log("\nInformacion de la ciudad \n".green);
                console.log("Ciudad:", lugarSeleccionado.nombre);
                console.log("Lat:", lugarSeleccionado.lat);
                console.log("Lng:", lugarSeleccionado.lng);
                console.log("Temperatura:", clima.temp);
                console.log("Temperatura minima:", clima.min);
                console.log("Temperatura maxima:", clima.max);
                console.log("Descripcion del clima:", clima.description);

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, index) => {
                    const idx = `${index + 1}`.green;
                    console.log(`${idx} ${lugar}`);
                })


        }

        if (opt !== 0 ) await pause();
        


    } while(opt !== 0)
}

main();