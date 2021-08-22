const inquirer = require('inquirer');
require('colors');

const seleccionar = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.yellow} Buscar lugar`
            },
            {
                value: 2,
                name: `${'2.'.yellow} Historial`
            },
            {
                value: 0,
                name: `${'0.'.yellow} Salir`
            }
        ]
    }
];

const inquirerMenu = async() => {
    console.clear();
    console.log('==============================='.magenta);
    console.log('==== Seleccione una opción ====');
    console.log('===============================\n'.magenta);

    const { opcion } = await inquirer.prompt(seleccionar);
    return opcion;

}

const pausa = async() => {
    
    const enter = [
        {
            type: 'input',
            name: 'enter',
            message: `\n\nPresione ${'enter'.green} para continuar\n`
        }
    ];

    await inquirer.prompt(enter);
}

const leerInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async(lugares = []) => {
    const choices = lugares.map((lugar, i) => {
        const idx = `${i + 1}`.green;

        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    // Agregamos opción cancelar en las opciones de borrado
    choices.unshift({
        value: '0',
        name: '0.'.green + 'Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione ciudad:',
            choices
        }
    ]
    const { id } = await inquirer.prompt(preguntas);
    return id;
}

module.exports = {
    inquirerMenu,
    leerInput,
    pausa,
    listarLugares
}