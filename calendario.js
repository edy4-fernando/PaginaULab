let fechaActual = new Date();

// Datos de eventos
const eventosCalendario = {
    '2025-12-06': [
        { 
            fecha: '6 de Diciembre, 2025',
            lugar: 'Patio del Piso 11',
            hora: '18:00 hrs'
        }
    ],
    '2024-11-20': [
        { 
            fecha: '20 de Noviembre, 2024',
            lugar: 'Sala de Conferencias',
            hora: '15:00 hrs'
        }
    ]
};

const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function renderizarCalendario() {
    const calendario = document.getElementById('calendarioGrid');
    const mesAnio = document.getElementById('calendarioMesAnio');
    
    if (!calendario || !mesAnio) return;
    
    calendario.innerHTML = '';
    
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    
    mesAnio.textContent = `${nombresMeses[mes]} ${anio}`;
    
    // Días de la semana
    nombresDias.forEach(dia => {
        const nombreDia = document.createElement('div');
        nombreDia.className = 'calendario-day-name';
        nombreDia.textContent = dia;
        calendario.appendChild(nombreDia);
    });
    
    // Primer día del mes
    const primerDia = new Date(anio, mes, 1).getDay();
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const diasEnMesAnterior = new Date(anio, mes, 0).getDate();
    
    // Días del mes anterior
    for (let i = primerDia - 1; i >= 0; i--) {
        const dia = crearElementoDia(diasEnMesAnterior - i, mes - 1, anio, true);
        calendario.appendChild(dia);
    }
    
    // Días del mes actual
    for (let i = 1; i <= diasEnMes; i++) {
        const dia = crearElementoDia(i, mes, anio, false);
        calendario.appendChild(dia);
    }
    
    // Días del siguiente mes
    const celdasTotales = calendario.children.length - 7;
    const celdasRestantes = 42 - celdasTotales;
    for (let i = 1; i <= celdasRestantes; i++) {
        const dia = crearElementoDia(i, mes + 1, anio, true);
        calendario.appendChild(dia);
    }
}

function crearElementoDia(numDia, mes, anio, esOtroMes) {
    const dia = document.createElement('div');
    dia.className = 'calendario-day';
    
    if (esOtroMes) {
        dia.classList.add('other-month');
    }
    
    const fechaStr = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(numDia).padStart(2, '0')}`;
    
    // Verificar si es hoy
    const hoy = new Date();
    if (!esOtroMes && numDia === hoy.getDate() && 
        mes === hoy.getMonth() && anio === hoy.getFullYear()) {
        dia.classList.add('today');
    }
    
    // Verificar si tiene eventos - marcar con círculo
    if (eventosCalendario[fechaStr]) {
        dia.classList.add('has-event');
    }
    
    dia.innerHTML = `<span class="calendario-day-number">${numDia}</span>`;
    
    dia.onclick = () => {
        if (eventosCalendario[fechaStr]) {
            abrirModal(fechaStr);
        }
    };
    
    return dia;
}

function abrirModal(fechaStr) {
    const modal = document.getElementById('calendarioModal');
    const modalTitulo = document.getElementById('modalTitulo');
    const modalEventos = document.getElementById('modalEventosContenido');
    
    if (!modal || !modalTitulo || !modalEventos) return;
    
    const eventosDelDia = eventosCalendario[fechaStr];
    
    if (eventosDelDia && eventosDelDia.length > 0) {
        modalTitulo.textContent = 'Eventos del día';
        
        modalEventos.innerHTML = eventosDelDia.map(evento => `
            <div class="calendario-evento">
                <div class="calendario-evento-item">
                    📅 <strong>${evento.fecha}</strong>
                </div>
                <div class="calendario-evento-item">
                    📍 <strong>${evento.lugar}</strong>
                </div>
                <div class="calendario-evento-item">
                    ⏰ <strong>${evento.hora}</strong>
                </div>
            </div>
        `).join('');
    } else {
        modalTitulo.textContent = 'Sin eventos';
        modalEventos.innerHTML = '<div class="calendario-no-eventos">No hay eventos programados para este día</div>';
    }
    
    modal.classList.add('active');
}

function cerrarModal() {
    const modal = document.getElementById('calendarioModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function cambiarMes(direccion) {
    fechaActual.setMonth(fechaActual.getMonth() + direccion);
    renderizarCalendario();
}

function irAHoy() {
    fechaActual = new Date();
    renderizarCalendario();
}

// Contador regresivo para el evento del 6 de Diciembre
function actualizarContador() {
    const fechaEvento = new Date('2025-12-06T18:00:00');
    const ahora = new Date();
    const diferencia = fechaEvento - ahora;

    const contadorElemento = document.getElementById('contadorEvento');
    if (!contadorElemento) return;

    if (diferencia > 0) {
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        contadorElemento.innerHTML = 
            `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    } else {
        contadorElemento.innerHTML = '¡El evento ya comenzó! 🎉';
    }
}

// Cerrar modal al hacer clic fuera
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('calendarioModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModal();
            }
        });
    }
    
    // Renderizar el calendario al cargar la página
    renderizarCalendario();
    
    // Iniciar contador regresivo
    actualizarContador();
    setInterval(actualizarContador, 1000);
});

function irArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    const btn = document.getElementById('btnArriba');
    if (window.scrollY > 300) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
});

function toggleMenu() {
    const menu = document.getElementById('menuNav');
    menu.classList.toggle('active');
}

function closeMenu() {
    const menu = document.getElementById('menuNav');
    menu.classList.remove('active');
}
// Efecto parallax en el header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.encabezado');
    const scrolled = window.pageYOffset;
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
        header.style.opacity = 1 - (scrolled / 500);
    }
});