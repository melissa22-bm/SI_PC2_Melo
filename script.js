<<<<<<< HEAD
// 1. Configuración de conexión
const URL_PROYECTO = 'https://ivhxngrjlmcjwmjzkdjo.supabase.co';
const CLAVE_ANONIMA = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2aHhuZ3JqbG1jandtanprZGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MjMxNzAsImV4cCI6MjA5NzI5OTE3MH0.c18HUbjwuiy7O-uCuLG-JrlDXqLcMZNeVMHO5H5keaI';

const miClienteSupabase = window.supabase.createClient(URL_PROYECTO, CLAVE_ANONIMA);

// 2. Función para cargar los catálogos
async function cargarCatalogos() {
    const listaTablas = [
        { id: 'sexo_id', tabla: 'sexos' },
        { id: 'grado_id', tabla: 'grados_academicos' },
        { id: 'carrera_id', tabla: 'carreras_interes' },
        { id: 'modalidad_id', tabla: 'modalidades_estudio' },
        { id: 'filtroSexo', tabla: 'sexos' } // <--- AÑADE ESTA LÍNEA
    ];

    for (let el of listaTablas) {
        const selectElement = document.getElementById(el.id);
        if (!selectElement) continue;

        const { data, error } = await miClienteSupabase.from(el.tabla).select('id, nombre');
        
        if (error) continue;

        // Mantenemos "Todos" para el filtro, o "Seleccione" para los otros
        const placeholder = el.id === 'filtroSexo' ? '<option value="">Todos</option>' : '<option value="">Seleccione...</option>';
        selectElement.innerHTML = placeholder;
        
        data.forEach(item => {
            selectElement.innerHTML += `<option value="${item.id}">${item.nombre}</option>`;
        });
    }
}

// 3. Función actualizada para listar postulantes con nombres reales
async function listarPostulantes() {
    // Usamos el Join para traer los datos relacionados de los catálogos
   // En lugar de .select('*'), usa esta estructura:
    const { data, error } = await miClienteSupabase
        .from('postulantes')
        .select(`
            nombres, 
            apellidos, 
            dni, 
            correo, 
            sexos(nombre), 
            grados_academicos(nombre), 
            carreras_interes(nombre), 
            modalidades_estudio(nombre)
        `);
    
    if (error) {
        console.error("Error al listar:", error);
        return;
    }

    const tbody = document.querySelector('#tablaPostulantes tbody');
    if (!tbody) return;

    tbody.innerHTML = ''; 

    data.forEach(p => {
        // Accedemos a p.nombre_de_tabla.nombre (ej: p.sexos.nombre)
        tbody.innerHTML += `
            <tr>
                <td>${p.nombres}</td>
                <td>${p.apellidos}</td>
                <td>${p.dni}</td>
                <td>${p.correo}</td>
                <td>${p.sexos?.nombre || 'N/A'}</td>
                <td>${p.grados_academicos?.nombre || 'N/A'}</td>
                <td>${p.carreras_interes?.nombre || 'N/A'}</td>
                <td>${p.modalidades_estudio?.nombre || 'N/A'}</td>
            </tr>`;
    });
}

// 4. Función para guardar los datos
document.getElementById('formPostulante').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoPostulante = {
        nombres: document.getElementById('nombres').value,
        apellidos: document.getElementById('apellidos').value,
        dni: document.getElementById('dni').value,
        correo: document.getElementById('correo').value,
        celular: document.getElementById('celular').value,
        edad: parseInt(document.getElementById('edad').value),
        sexo_id: document.getElementById('sexo_id').value,
        grado_id: document.getElementById('grado_id').value,
        carrera_id: document.getElementById('carrera_id').value,
        modalidad_id: document.getElementById('modalidad_id').value
    };

    const { error } = await miClienteSupabase.from('postulantes').insert([nuevoPostulante]);

    if (error) {
        alert("Error al registrar: " + error.message);
    } else {
        alert("¡Registro exitoso!");
        document.getElementById('formPostulante').reset();
        listarPostulantes(); 
    }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogos();
    listarPostulantes();
});

// Listener para cuando cambias el filtro de sexo
document.getElementById('filtroSexo').addEventListener('change', async (e) => {
    const sexoSeleccionado = e.target.value;
    const tbody = document.querySelector('#tablaPostulantes tbody');
    
    // Si no hay filtro, mostramos todos
    if (sexoSeleccionado === "") {
        listarPostulantes();
    } else {
        // Filtramos por sexo_id
        const { data, error } = await miClienteSupabase
            .from('postulantes')
            .select(`
                nombres, apellidos, dni, correo,
                sexos(nombre), grados_academicos(nombre), 
                carreras_interes(nombre), modalidades_estudio(nombre)
            `)
            .eq('sexo_id', sexoSeleccionado);

        if (error) return;

        tbody.innerHTML = '';
        data.forEach(p => {
            tbody.innerHTML += `<tr>
                <td>${p.nombres}</td><td>${p.apellidos}</td><td>${p.dni}</td>
                <td>${p.correo}</td><td>${p.sexos?.nombre || 'N/A'}</td>
                <td>${p.grados_academicos?.nombre || 'N/A'}</td>
                <td>${p.carreras_interes?.nombre || 'N/A'}</td>
                <td>${p.modalidades_estudio?.nombre || 'N/A'}</td>
            </tr>`;
        });
    }
});
=======

const SUPABASE_URL = 'https://ivhxngrjlmcjwmjzkdjo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2aHhuZ3JqbG1jandtanprZGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MjMxNzAsImV4cCI6MjA5NzI5OTE3MH0.c18HUbjwuiy7O-uCuLG-JrlDXqLcMZNeVMHO5H5keaI'; // <--- PON TU CLAVE LARGA AQUÍ

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cargar() {
    // Lista de tablas y sus IDs en tu HTML
    const procesos = [
        { id: 'sexo_id', tabla: 'sexos' },
        { id: 'grado_id', tabla: 'grados_academicos' },
        { id: 'carrera_id', tabla: 'carreras_interes' },
        { id: 'modalidad_id', tabla: 'modalidades_estudio' }
    ];

    for (let p of procesos) {
        // Obtenemos los datos
        const { data, error } = await supabase.from(p.tabla).select('*');
        if (error) {
            console.error("Error en " + p.tabla, error);
            continue;
        }
        
        const select = document.getElementById(p.id);
        data.forEach(item => {
            // CAMBIA 'nombre' por el nombre real de tu columna en Supabase si es diferente
            let texto = item.nombre || item.descripcion || Object.values(item)[1]; 
            select.innerHTML += `<option value="${item.id}">${texto}</option>`;
        });
    }
}
cargar();
>>>>>>> b29ed05e7b5f28ea52db5f44dd0115ac1ccfd3cb
