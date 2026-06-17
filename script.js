
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