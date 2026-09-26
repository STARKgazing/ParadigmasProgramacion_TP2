const verTarea = require("./verTarea");
const buscarTarea = require("./buscarTarea");
const agregarTarea = require("./agregarTarea");

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function mainMenu(): void {

    console.log("=== TO DO LIST ===");
    console.log("1. Ver mis tareas");
    console.log("2. Buscar una Tarea");
    console.log("3. Agregar una tarea");
    console.log("0. Salir");

    rl.question("Choose an option: ", (answer: string) => {

        const option: number = Number(answer);

        switch (option) {

            case 1:
                verTarea(rl, mainMenu);
                break;

            case 2:
                buscarTarea(rl, mainMenu);
                break;

            case 3:
                agregarTarea(rl, mainMenu);
                break;

            case 0:
                console.log("Prende y Apaga la luz!");
                rl.close();
                break;

            default:
                console.log("Opcion Invalida.");
                mainMenu();
        }
    });
}


mainMenu();
export {};

