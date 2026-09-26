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

// Función para obtener la fecha actual
function obtenerFechaActual(): string {

return new Date().toISOString().split("T")[0]!;

}

// Pedir y validar título
function pedirTitulo(
rl: Readline,
continuar: (titulo: string) => void
): void {

rl.question(
    "Título: ",
    (titulo: string) => {

        if (titulo.trim() === "") {
            console.log("El título no puede estar vacío.");
            return pedirTitulo(rl, continuar);
        }

        continuar(titulo);
    }
);

}

// Pedir y validar descripción
function pedirDescripcion(
rl: Readline,
continuar: (descripcion: string) => void
): void {

rl.question(
    "Descripción: ",
    (descripcion: string) => {

        // Límite de 200 caracteres
        if (descripcion.length > 200) {
            console.log(
                "La descripción no puede superar los 200 caracteres."
            );

            return pedirDescripcion(rl, continuar);
        }

        // Si está vacía, se coloca un valor por defecto
        if (descripcion.trim() === "") {
            descripcion = "empty";
        }

        continuar(descripcion);
    }
);

}

// Pedir y seleccionar estado
function pedirEstado(
rl: Readline,
continuar: (estado: string) => void
): void {

console.log("\n=== ESTADO ===");
console.log("1. Pendiente");
console.log("2. En proceso");
console.log("3. Finalizada");

rl.question(
    "Elegí un estado: ",
    (opcion: string) => {

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
                pedirEstado(rl, continuar);
        }
    }
);

}

// Pedir y seleccionar dificultad
function pedirDificultad(
rl: Readline,
continuar: (dificultad: string) => void
): void {

console.log("\n=== DIFICULTAD ===");
console.log("1. Facil");
console.log("2. Medio");
console.log("3. Dificil");

rl.question(
    "Elegí una dificultad: ",
    (opcion: string) => {

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
                pedirDificultad(rl, continuar);
        }
    }
);

}

// Función principal para agregar una tarea
function agregarTarea(
rl: Readline,
volverAlMenu: () => void
): void {

pedirTitulo(
    rl,
    (titulo: string) => {

        pedirDescripcion(
            rl,
            (descripcion: string) => {

                pedirEstado(
                    rl,
                    (estado: string) => {

                        pedirDificultad(
                            rl,
                            (dificultad: string) => {

                                // Crear la tarea
                                const tarea: Tarea = {
                                    titulo: titulo,
                                    descripcion: descripcion,
                                    estado: estado,
                                    dificultad: dificultad,
                                    fechaCreacion:
                                        obtenerFechaActual(),
                                    fechaFinalizacion: null
                                };

                                managerTareas.agregarTarea(tarea);

                                console.log(
                                    "\n¡Tarea agregada exitosamente!"
                                );

                                console.log(tarea);

                                // Esperar ENTER antes de volver al menú
                                rl.question(
                                    "\nPresiona ENTER para volver al menú principal...",
                                    () => {
                                        volverAlMenu();
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

module.exports = agregarTarea;
export {};

