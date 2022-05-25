const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');
const formulario = document.querySelector('#nueva-cita');
// Muestra las citas
const contenedorCitas = document.querySelector('#citas');

let editando;


// Classes
class Citas {
    constructor() {
        this.citas = []
    }
    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }
    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }
    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => {
          return  cita.id === citaActualizada.id ? citaActualizada : cita
        })
    }
}
class Mascota {
    constructor(nombre, propietario, telefono, fecha, hora, sintomas) {
        this.nombre = nombre;
        this.propietario = propietario;
        this.telefono = telefono;
        this.fecha = fecha;
        this.hora = hora;
        this.sintomas = sintomas;
        this.id = '';
    }
    comprobarValores() {
        if (this.nombre === '' || this.nombre === undefined || this.propietario === '' || this.propietario === undefined || this.telefono === '' || this.telefono === undefined || this.fecha === '' || this.fecha === undefined || this.hora === '' || this.hora === undefined || this.sintomas === '' || this.sintomas === undefined) {
            ui.imprimirAlerta("Todos los campos son obligatorios", 'error');
            // console.log(this.nombre, this.propietario, this.propietario, this.telefono, this.fecha, this.hora, this.sintomas)
            return false;
        }
        return true;
    }
    reinicarValores() {
        this.nombre = ''
        this.propietario = ''
        this.telefono = ''
        this.fecha = ''
        this.hora = ''
        this.sintomas = ''
        this.id = ''
    }
}

class UI {
    imprimirAlerta(msg, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        if (tipo) {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        divMensaje.textContent = msg;
        // Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
        // Quitar la alerta
        setTimeout(() => {
            divMensaje.remove()
        }, 2000)
    }
    mostrarCitas({ citas }) {
        this.limpiarHtml()
        citas.forEach(cita => {
            const { nombre, propietario, telefono, fecha, hora, sintomas, id } = cita;
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;
            // Scripting elementos cita
            const nombreParrafo = document.createElement('h2');
            nombreParrafo.classList.add('card-title', 'font-weight-bolder');
            nombreParrafo.textContent = nombre;

            // propietario
            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
             <span class="font-weight-bolder">Propietario:</span> ${propietario} 
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
             <span class="font-weight-bolder">telefono:</span> ${telefono} 
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
             <span class="font-weight-bolder">fecha:</span> ${fecha} 
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
             <span class="font-weight-bolder">hora:</span> ${hora} 
            `;
            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
             <span class="font-weight-bolder">sintomas:</span> ${sintomas} 
            `;

            // boton para elimar esta cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar';
            btnEliminar.onclick = () => {
                eliminarCita(id)
            }

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info', 'mr-2');
            btnEditar.innerHTML = 'Editar';
            btnEditar.onclick = () => {
                editarCita(cita)
            }
            // agregar parrafos a div cita
            divCita.append(nombreParrafo, propietarioParrafo, telefonoParrafo, fechaParrafo, horaParrafo, sintomasParrafo, btnEliminar, btnEditar);
            // agregar cita a html
            contenedorCitas.appendChild(divCita);
        })
    }
    limpiarHtml() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}
const ui = new UI();
const administrarCitas = new Citas();
let mascota = new Mascota();

// funciones

const datosCita = () => {
    // Si no se esta editando se crea un nuevo objeto
    if (!editando) {
        mascota = new Mascota(mascotaInput.value, propietarioInput.value, telefonoInput.value, fechaInput.value, horaInput.value, sintomasInput.value)
    }else {
        // mascota = new Mascota(mascotaInput.value, propietarioInput.value, telefonoInput.value, fechaInput.value, horaInput.value, sintomasInput.value)
        mascota.nombre = mascotaInput.value;
        mascota.propietario = propietarioInput.value;
        mascota.telefono = telefonoInput.value;
        mascota.fecha = fechaInput.value;
        mascota.hora = horaInput.value;
        mascota.sintomas = sintomasInput.value
    }
}


const nuevaCita = e => {
    e.preventDefault()
    // Si no se esta editando se crea un nuevo objeto
    if (!editando) {
        const resultado = mascota.comprobarValores();
        if (resultado) {
            console.log("Nuevo registro")
            mascota.id = Date.now();

            // Se agrega el objeto al obj de cita
            administrarCitas.agregarCita({ ...mascota })

            // Se reiniciar las propiedades del objeto
            mascota.reinicarValores();

            formulario.reset()
            // mostrarHTML
            ui.mostrarCitas(administrarCitas);
            // Agregado correctamente
            ui.imprimirAlerta('Agregado correctamente')
        }
    } else {
        console.log(mascota)
        // Se reiniciar las propiedades del objeto
        administrarCitas.editarCita({ ...mascota })
        // mostrarHTML
        ui.mostrarCitas(administrarCitas);
        ui.imprimirAlerta('Editado correctamente')
        formulario.querySelector('button[type="submit"]').textContent = 'CREAR CITA';
        formulario.reset()
        mascota.reinicarValores();
        editando = false;
    }

}

const eliminarCita = id => {
    console.log(id)
    // Eliminar cita en clase
    administrarCitas.eliminarCita(id)
    // MOstrar mensaje
    ui.imprimirAlerta('Cita borrada correctamente');
    // Imprimir html
    ui.mostrarCitas(administrarCitas);
}

const editarCita = cita => {
    const { nombre, propietario, telefono, fecha, hora, sintomas, id } = cita;
    // console.log(cita)
    mascotaInput.value = nombre;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    mascota.nombre = nombre;
    mascota.propietario = propietario;
    mascota.telefono = telefono;
    mascota.fecha = fecha;
    mascota.hora = hora;
    mascota.sintomas = sintomas;
    mascota.id = id;
    // console.log(mascota)
    // cambiar texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambio';
    editando = true

}

const eventListeners = () => {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);
    formulario.addEventListener('submit', nuevaCita);
}






// eventos
eventListeners()
formulario.reset();
