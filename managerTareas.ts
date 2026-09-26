const fs = require("fs");
const path = require("path");

// Tipo de dato para una tarea
interface Tarea {
titulo: string;
descripcion: string;
estado: string;
dificultad: string;
fechaCreacion: string;
fechaFinalizacion: string | null;
}

const archivoTareas: string =
path.join(__dirname, "tareas.json");

// Cargar las tareas desde el archivo JSON
function cargarTareas(): Tarea[] {

try {
    const datos: string =
        fs.readFileSync(archivoTareas, "utf8");

    if (datos.trim() === "") {
        return [];
    }

    return JSON.parse(datos) as Tarea[];

} catch (error: unknown) {
    console.log("No se pudieron cargar las tareas.");
    return [];
}

}

// Guardar las tareas en el archivo JSON
function guardarTareas(tareas: Tarea[]): void {

fs.writeFileSync(
    archivoTareas,
    JSON.stringify(tareas, null, 4),
    "utf8"
);

}

// Agregar una tarea
function agregarTarea(tarea: Tarea): void {

const tareas: Tarea[] = cargarTareas();

tareas.push(tarea);

guardarTareas(tareas);

}

module.exports = {
cargarTareas,
guardarTareas,
agregarTarea
};

export {};
