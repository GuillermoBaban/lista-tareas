const bd = firebase.firestore();

const btnA = document.querySelector('#btn');
const contenidoP = document.querySelector('#contenidoP');
const contenedorT = document.querySelector('#cont-tareas')

let datosEditados = false;
let id = '';

const guardarT = (titulo,descriP) => {
    
    bd.collection('tareas').doc().set({
        titulo,
        descriP
        
    })
}

const obtenerDatos = () => bd.collection('tareas').get();
const reemplazoD = (id) => bd.collection('tareas').doc(id).get();

const seObtinenTareas = (callback) => bd.collection('tareas').onSnapshot(callback)

const eliminarDatos = (id) => {
    bd.collection('tareas').doc(id).delete();
}

const actualizarDatos = (id,actualizarDatos) => 
    bd.collection('tareas').doc(id).update(actualizarDatos)

window.addEventListener('DOMContentLoaded', async (e) => {

    seObtinenTareas ((datosO) => {
        contenedorT.innerHTML = '';
        datosO.forEach(doc => {
            const dato = doc.data();
            dato.id = doc.id;

            contenedorT.innerHTML += `<div class="card card-body mx-auto text-center mt-5" style="width: 18rem;">
                <h5>${dato.titulo}</h5>
                <p>${dato.descriP}</p>
                <div>
                    <button id="btn-editar" data-id="${dato.id}" class="btn btn-warning">Editar</button>
                    <button id="btn-eliminar" data-id="${dato.id}" class="btn btn-danger">Eliminar</button>
                </div>
            </div>`;
            const btnEliminar = document.querySelectorAll('#btn-eliminar');
            const btnEditar = document.querySelectorAll('#btn-editar');
            btnEliminar.forEach(btn => {
                try {
                    btn.addEventListener('click', async (e) => {
                        await eliminarDatos(e.target.dataset.id);
                   });
                } catch (error) {
                    console.log(error)
                }

            });
            btnEditar.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    try{
                        const tarea = await reemplazoD(e.target.dataset.id);
                    datosEditados = true;
                    id = tarea.id;
                    contenidoP['entradaU'].value = tarea.data().titulo;
                    contenidoP['descri'].value = tarea.data().descriP;
                    contenidoP['btn'].innerHTML = 'Actualizar'
                    } catch (error){
                        console.log(error)
                    }
                });
            }); 
        });
    })

})

btnA.addEventListener('click', async (e) => {
    e.preventDefault();
    let titulo = document.querySelector('#entradaU');    
    let descriP = document.querySelector('#descri');
    try {
        if (!datosEditados) {
            await guardarT(titulo.value, descriP.value);
            
        }else {
            await actualizarDatos(id,{
                titulo: titulo.value,
                descriP: descriP.value
            })
            datosEditados = false;
            id = ''
            contenidoP['btn'].innerHTML = 'Agregar'
    
    
        }
        contenidoP.reset();
        titulo.focus();
    } catch(error){
        console.log(error)
    }
})


