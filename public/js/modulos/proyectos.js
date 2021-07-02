import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {

    btnEliminar.addEventListener('click', e => {

        // Extraer url unico de cada proyecto
        const urlProyecto = e.target.dataset.proyectoUrl;
        
        //console.log(urlProyecto);
        // sweetalert para mostrar ventana de eliminación
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Este cambio es irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'No, Cancelar'
          }).then((result) => {
            if (result.value) {
              // Petición a axios
              const url = `${location.origin}/proyectos/${urlProyecto}`;
              
              axios.delete(url, {params: {urlProyecto}})
                .then(function(respuesta){
                  console.log(respuesta);
                
                // Sirve para enviar alerta con sweetalert2
                Swal.fire(
                  'Borrado!',
                  respuesta.data,
                  'OK'
                );
      
                // Redireccionar al inicio
                setTimeout(() => {
                  window.location.href= '/'
                }, 3000);
            })
            .catch( () => {
              // Sirve para enviar alerta con sweetalert2
              Swal.fire({
                type:'error',
                title: 'Hubo un error',
                text: 'No se pudo eliminar el proyecto'
              })
            })
          }
    })
  })
}

export default btnEliminar;