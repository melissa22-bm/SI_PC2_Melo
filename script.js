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
    const { data, error } = await miClienteSupabase
        .from('postulantes')
        .select(`
            nombres, apellidos, dni, correo, celular, edad,
            institucion_educativa, promedio_academico, observaciones,
            sexos(nombre), grados_academicos(nombre), 
            carreras_interes(nombre), modalidades_estudio(nombre)
        `);
    
    if (error) { console.error(error); return; }

    const tbody = document.querySelector('#tablaPostulantes tbody');
    tbody.innerHTML = ''; 

    data.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.nombres}</td>
                <td>${p.apellidos}</td>
                <td>${p.dni}</td>
                <td>${p.correo}</td>
                <td>${p.celular || 'N/A'}</td>
                <td>${p.edad || 'N/A'}</td>
                <td>${p.sexos?.nombre || 'N/A'}</td>
                <td>${p.institucion_educativa || 'N/A'}</td>
                <td>${p.promedio_academico || 'N/A'}</td>
                <td>${p.grados_academicos?.nombre || 'N/A'}</td>
                <td>${p.carreras_interes?.nombre || 'N/A'}</td>
                <td>${p.modalidades_estudio?.nombre || 'N/A'}</td>
                <td>${p.observaciones || 'N/A'}</td>
            </tr>`;
    });
}

// 4. Función para guardar los datos con validaciones estrictas
document.getElementById('formPostulante').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura de valores
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const dni = document.getElementById('dni').value;
    const correo = document.getElementById('correo').value;
    const celular = document.getElementById('celular').value;
    const edad = parseInt(document.getElementById('edad').value);

    // Validaciones Profesionales
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nombres) || !/^[A-Za-zÀ-ÿ\s]+$/.test(apellidos)) {
        alert("Error: Nombres y apellidos solo deben contener letras.");
        return; 
    }
    if (!/^\d{8}$/.test(dni)) {
        alert("Error: El DNI debe tener exactamente 8 dígitos.");
        return;
    }
    if (!/^\d{9}$/.test(celular)) {
        alert("Error: El celular debe tener exactamente 9 dígitos.");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        alert("Error: Formato de correo electrónico inválido.");
        return;
    }
    if (isNaN(edad) || edad < 16 || edad > 100) {
        alert("Error: La edad debe ser un número entre 16 y 100.");
        return;
    }

    // Si pasó las validaciones, preparamos el objeto
    // Dentro de la función de registro:
    const nuevoPostulante = {
        nombres: document.getElementById('nombres').value,
        apellidos: document.getElementById('apellidos').value,
        dni: document.getElementById('dni').value,
        correo: document.getElementById('correo').value,
        celular: document.getElementById('celular').value,
        edad: parseInt(document.getElementById('edad').value),
        institucion_educativa: document.getElementById('institucion').value,
        promedio_academico: parseFloat(document.getElementById('promedio').value),
        observaciones: document.getElementById('observaciones').value,
        sexo_id: document.getElementById('sexo_id').value,
        grado_id: document.getElementById('grado_id').value,
        carrera_id: document.getElementById('carrera_id').value,
        modalidad_id: document.getElementById('modalidad_id').value
    };

    // Envío a Supabase
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
