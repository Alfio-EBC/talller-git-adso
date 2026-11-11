
/* =================================================================
   PASO 1. La lista de usuarios
   Cada usuario tiene cuatro datos:
       usuario  = el nombre con el que entra
       clave    = su contraseña
       activo   = true si puede entrar, false si está bloqueado
       fecha    = la fecha en que entró la última vez
   ================================================================= */

var usuarios = [
    { usuario: "ana",    clave: "12345", activo: true,  fecha: "" },
    { usuario: "luis",   clave: "54321", activo: true,  fecha: "" },
    { usuario: "carlos", clave: "11111", activo: false, fecha: "" }
];


/* =================================================================
   PASO 2. Guardar y recuperar del navegador

   localStorage solo guarda TEXTO, por eso:
       JSON.stringify  convierte la lista a texto     (para guardar)
       JSON.parse      convierte el texto a lista     (para leer)
   ================================================================= */

function guardar() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function cargar() {
    var texto = localStorage.getItem("usuarios");

    if (texto == null) {
        // Es la primera vez que se abre: guardamos la lista inicial
        guardar();
    } else {
        // Ya había datos guardados: los recuperamos
        usuarios = JSON.parse(texto);
    }
}


/* =================================================================
   PASO 3. Buscar un usuario por su nombre
   Recorre la lista uno por uno. Si lo encuentra lo devuelve,
   y si llega al final sin encontrarlo devuelve null.
   ================================================================= */

function buscarUsuario(nombre) {

    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].usuario == nombre) {
            return usuarios[i];
        }
    }
    return null;
}


/* =================================================================
   PASO 4. Mostrar un mensaje en la pantalla
   ================================================================= */

function mostrarMensaje(texto, tipo) {
    document.getElementById("mensaje").innerHTML =
        "<div class='mensaje " + tipo + "'>" + texto + "</div>";
}


/* =================================================================
   PASO 5. Validar el ingreso
   Se hacen cuatro preguntas, una detrás de otra.
   Si alguna falla, el programa se detiene ahí mismo con "return".
   ================================================================= */

function entrar() {

    var nombre = document.getElementById("usuario").value;
    var clave  = document.getElementById("clave").value;

    // --- Pregunta 1: ¿escribió los dos datos? ---
    if (nombre == "" || clave == "") {
        mostrarMensaje("Debe digitar el usuario y la contraseña.", "error");
        return;
    }

    // --- Pregunta 2: ¿ese usuario existe? ---
    var persona = buscarUsuario(nombre);

    if (persona == null) {
        mostrarMensaje("Usuario o contraseña incorrectos.", "error");
        return;
    }

    // --- Pregunta 3: ¿la cuenta está activa? ---
    if (persona.activo == false) {
        mostrarMensaje("Esta cuenta está inactiva.", "aviso");
        return;
    }

    // --- Pregunta 4: ¿la contraseña coincide? ---
    if (persona.clave != clave) {
        mostrarMensaje("Usuario o contraseña incorrectos.", "error");
        return;
    }

    // --- Si llegó hasta aquí, las cuatro preguntas se cumplieron ---

    // Guardamos la fecha anterior ANTES de cambiarla, para mostrarla
    var fechaAnterior = persona.fecha;

    // Anotamos la fecha y la hora de este momento
    persona.fecha = new Date().toLocaleString();
    guardar();

    mostrarBienvenida(persona, fechaAnterior);
}


/* =================================================================
   PASO 6. Mostrar la pantalla de bienvenida
   Se oculta la pantalla 1 y se muestra la pantalla 2.
   ================================================================= */

function mostrarBienvenida(persona, fechaAnterior) {

    document.getElementById("pantallaIngreso").style.display = "none";
    document.getElementById("pantallaBienvenida").style.display = "block";

    document.getElementById("saludo").innerHTML =
        "Hola, " + persona.usuario + ". Ingresó el " + persona.fecha;

    if (fechaAnterior == "") {
        document.getElementById("fechaAnterior").innerHTML =
            "Es su primer ingreso al sistema.";
    } else {
        document.getElementById("fechaAnterior").innerHTML =
            "Su ingreso anterior fue el " + fechaAnterior;
    }

    llenarTabla();
}


/* =================================================================
   PASO 7. Llenar la tabla con todos los usuarios
   Se arma una fila de la tabla por cada usuario de la lista.
   ================================================================= */

function llenarTabla() {

    var filas = "";

    for (var i = 0; i < usuarios.length; i++) {

        var estado = "Activo";
        if (usuarios[i].activo == false) {
            estado = "Inactivo";
        }

        var fecha = usuarios[i].fecha;
        if (fecha == "") {
            fecha = "Nunca";
        }

        filas = filas + "<tr>" +
                        "<td>" + usuarios[i].usuario + "</td>" +
                        "<td>" + estado + "</td>" +
                        "<td>" + fecha + "</td>" +
                        "</tr>";
    }

    document.getElementById("filasTabla").innerHTML = filas;
}


/* =================================================================
   PASO 8. Salir
   Vuelve a la pantalla del formulario y limpia los campos.
   ================================================================= */

function salir() {

    document.getElementById("pantallaBienvenida").style.display = "none";
    document.getElementById("pantallaIngreso").style.display = "block";

    document.getElementById("usuario").value = "";
    document.getElementById("clave").value = "";
    document.getElementById("mensaje").innerHTML = "";
}


/* =================================================================
   Esta línea se ejecuta apenas se abre la página:
   recupera los usuarios guardados en el navegador.
   ================================================================= */

cargar();

