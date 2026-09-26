const managerTareas = require("./managerTareas");

// Tipo de dato para una tarea
interface Tarea {
titulo: string;
descripcion: string;
estado: string;
dificultad: string;
fechaCreacion: string;
fechaFinalizacion: string | null;
}

// Tipo para readline
interface Readline {
question(
pregunta: string,
callback: (respuesta: string) => void
): void;

close(): void;

}

// Obtener la fecha actual
function obtenerFechaActual(): string {
return new Date().toISOString().split("T")[0]!;
}

// Determinar si una entrada fue dejada en blanco
function estaEnBlanco(valor: string): boolean {
return valor.trim() === "";
}

// Editar título
function editarTitulo(
rl: Readline,
tarea: Tarea,
continuar: (titulo: string) => void
): void {

rl.question(
    "Título [" + tarea.titulo + "]: ",
    (nuevoTitulo: string) => {

        // ENTER sin espacios = mantener el valor actual
        if (nuevoTitulo === "") {
            continuar(tarea.titulo);
            return;
        }

        // No permitir título compuesto solamente por espacios
        if (estaEnBlanco(nuevoTitulo)) {
            console.log("El título no puede estar vacío.");
            editarTitulo(rl, tarea, continuar);
            return;
        }

        continuar(nuevoTitulo);
    }
);

}

// Editar descripción
function editarDescripcion(
rl: Readline,
tarea: Tarea,
continuar: (descripcion: string) => void
): void {

rl.question(
    "Descripción [" + tarea.descripcion + "]: ",
    (nuevaDescripcion: string) => {

        // ENTER = mantener el valor actual
        if (nuevaDescripcion === "") {
            continuar(tarea.descripcion);
            return;
        }

        // Espacios + ENTER = dejar descripción vacía
        if (estaEnBlanco(nuevaDescripcion)) {
            continuar("empty");
            return;
        }

        if (nuevaDescripcion.length > 200) {
            console.log(
                "La descripción no puede superar los 200 caracteres."
            );

            editarDescripcion(
                rl,
                tarea,
                continuar
            );

            return;
        }

        continuar(nuevaDescripcion);
    }
);

}

// Editar estado
function editarEstado(
rl: Readline,
tarea: Tarea,
continuar: (estado: string) => void
): void {

console.log("\n=== ESTADO ===");
console.log("Estado actual: " + tarea.estado);
console.log("1. Pendiente");
console.log("2. En Proceso");
console.log("3. Finalizada");

rl.question(
    "Elegí un estado (ENTER para mantener): ",
    (opcion: string) => {

        if (opcion === "") {
            continuar(tarea.estado);
            return;
        }

        switch (opcion) {

            case "1":
                continuar("Pendiente");
                break;

            case "2":
                continuar("En proceso");
                break;

            case "3":
                continuar("Finalizada");
                break;

            default:
                console.log("Opción inválida.");
                editarEstado(rl, tarea, continuar);
        }
    }
);

}

// Editar dificultad
function editarDificultad(
rl: Readline,
tarea: Tarea,
continuar: (dificultad: string) => void
): void {

console.log("\n=== DIFICULTAD ===");
console.log("Dificultad actual: " + tarea.dificultad);
console.log("1. Facil");
console.log("2. Medio");
console.log("3. Dificil");

rl.question(
    "Elegí una dificultad (ENTER para mantener): ",
    (opcion: string) => {

        if (opcion === "") {
            continuar(tarea.dificultad);
            return;
        }

        switch (opcion) {

            case "1":
                continuar("Facil");
                break;

            case "2":
                continuar("Medio");
                break;

            case "3":
                continuar("Dificil");
                break;

            default:
                console.log("Opción inválida.");
                editarDificultad(rl, tarea, continuar);
        }
    }
);

}

// Editar fecha de finalización
function editarFechaFinalizacion(
rl: Readline,
tarea: Tarea,
continuar: (fecha: string | null) => void
): void {

const fechaCreacion: string = tarea.fechaCreacion;

rl.question(
    "Fecha de finalización [" +
    (tarea.fechaFinalizacion || "sin fecha") +
    "]: ",
    (nuevaFecha: string) => {

        // ENTER = mantener el valor actual
        if (nuevaFecha === "") {
            continuar(tarea.fechaFinalizacion);
            return;
        }

        // Espacios + ENTER = quitar fecha
        if (estaEnBlanco(nuevaFecha)) {
            continuar(null);
            return;
        }

        // Validar formato YYYY-MM-DD
        const fechaValida: boolean =
            /^\d{4}-\d{2}-\d{2}$/.test(nuevaFecha);

        if (!fechaValida) {
            console.log(
                "La fecha debe tener el formato YYYY-MM-DD."
            );

            editarFechaFinalizacion(
                rl,
                tarea,
                continuar
            );

            return;
        }

        // Comprobar que realmente sea una fecha válida
        const fecha: Date =
            new Date(nuevaFecha + "T00:00:00");

        if (isNaN(fecha.getTime())) {
            console.log("La fecha no es válida.");

            editarFechaFinalizacion(
                rl,
                tarea,
                continuar
            );

            return;
        }

        // La fecha final no puede ser anterior a la creación
        if (nuevaFecha < fechaCreacion) {
            console.log(
                "La fecha de finalización no puede ser anterior " +
                "a la fecha de creación."
            );

            editarFechaFinalizacion(
                rl,
                tarea,
                continuar
            );

            return;
        }

        continuar(nuevaFecha);
    }
);

}

// Comenzar edición
function editarTarea(
rl: Readline,
tarea: Tarea,
tareas: Tarea[],
volverAlMenu: () => void
): void {

console.log("\n=== EDITAR TAREA ===");
console.log("ENTER = mantener el valor actual.");
console.log(
    "ESPACIO + ENTER = dejar vacío cuando sea posible."
);
console.log("");

editarTitulo(
    rl,
    tarea,
    (nuevoTitulo: string) => {

        editarDescripcion(
            rl,
            tarea,
            (nuevaDescripcion: string) => {

                editarEstado(
                    rl,
                    tarea,
                    (nuevoEstado: string) => {

                        editarDificultad(
                            rl,
                            tarea,
                            (nuevaDificultad: string) => {

                                editarFechaFinalizacion(
                                    rl,
                                    tarea,
                                    (
                                        nuevaFechaFinalizacion:
                                        string | null
                                    ) => {

                                        // Actualizar la tarea seleccionada
                                        tarea.titulo = nuevoTitulo;
                                        tarea.descripcion =
                                            nuevaDescripcion;
                                        tarea.estado =
                                            nuevoEstado;
                                        tarea.dificultad =
                                            nuevaDificultad;
                                        tarea.fechaFinalizacion =
                                            nuevaFechaFinalizacion;

                                        // La fecha de creación NO se modifica
                                        // porque no la tocamos.

                                        managerTareas.guardarTareas(
                                            tareas
                                        );

                                        console.log(
                                            "\n¡Tarea modificada exitosamente!"
                                        );

                                        console.log(
                                            "\n=== TAREA ACTUALIZADA ==="
                                        );

                                        console.log(
                                            "Título: " +
                                            tarea.titulo
                                        );

                                        console.log(
                                            "Descripción: " +
                                            tarea.descripcion
                                        );

                                        console.log(
                                            "Estado: " +
                                            tarea.estado
                                        );

                                        console.log(
                                            "Dificultad: " +
                                            tarea.dificultad
                                        );

                                        console.log(
                                            "Fecha de creación: " +
                                            tarea.fechaCreacion
                                        );

                                        console.log(
                                            "Fecha de finalización: " +
                                            (
                                                tarea.fechaFinalizacion ||
                                                "sin fecha"
                                            )
                                        );

                                        console.log(
                                            "\n0. Volver al menú principal"
                                        );

                                        rl.question(
                                            "Elegí una opción: ",
                                            (
                                                opcion: string
                                            ) => {

                                                if (
                                                    opcion === "0"
                                                ) {
                                                    volverAlMenu();
                                                    return;
                                                }

                                                console.log(
                                                    "Opción inválida."
                                                );

                                                editarTarea(
                                                    rl,
                                                    tarea,
                                                    tareas,
                                                    volverAlMenu
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
);

}

module.exports = editarTarea;
export {};
