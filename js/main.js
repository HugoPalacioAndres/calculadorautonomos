// =====================
// TRAMOS RETA 2026
// =====================
const TRAMOS = [
  { min: 0,       max: 670,    baseMin: 653.59,  label: "Tramo 1  · Hasta 670 €/mes" },
  { min: 670,     max: 900,    baseMin: 718.95,  label: "Tramo 2  · 670 – 900 €/mes" },
  { min: 900,     max: 1166,   baseMin: 849.67,  label: "Tramo 3  · 900 – 1.166 €/mes" },
  { min: 1166,    max: 1300,   baseMin: 950,     label: "Tramo 4  · 1.166 – 1.300 €/mes" },
  { min: 1300,    max: 1500,   baseMin: 960,     label: "Tramo 5  · 1.300 – 1.500 €/mes" },
  { min: 1500,    max: 1700,   baseMin: 960,     label: "Tramo 6  · 1.500 – 1.700 €/mes" },
  { min: 1700,    max: 1850,   baseMin: 1143.75, label: "Tramo 7  · 1.700 – 1.850 €/mes" },
  { min: 1850,    max: 2030,   baseMin: 1209,    label: "Tramo 8  · 1.850 – 2.030 €/mes" },
  { min: 2030,    max: 2330,   baseMin: 1274,    label: "Tramo 9  · 2.030 – 2.330 €/mes" },
  { min: 2330,    max: 2760,   baseMin: 1395,    label: "Tramo 10 · 2.330 – 2.760 €/mes" },
  { min: 2760,    max: 3190,   baseMin: 1520,    label: "Tramo 11 · 2.760 – 3.190 €/mes" },
  { min: 3190,    max: 3620,   baseMin: 1633,    label: "Tramo 12 · 3.190 – 3.620 €/mes" },
  { min: 3620,    max: 4050,   baseMin: 1766,    label: "Tramo 13 · 3.620 – 4.050 €/mes" },
  { min: 4050,    max: 6000,   baseMin: 1900,    label: "Tramo 14 · 4.050 – 6.000 €/mes" },
  { min: 6000,    max: Infinity, baseMin: 4139.40, label: "Tramo 15 · Más de 6.000 €/mes" },
];

const TIPO_COTIZACION = 0.3093; // 30,93% tipo general 2026

// =====================
// UTILIDADES
// =====================
function formatEur(n) {
  return n.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' €';
}

function getTramo(netoMensual) {
  return TRAMOS.find(t => netoMensual >= t.min && netoMensual < t.max)
    || TRAMOS[TRAMOS.length - 1];
}

function mostrarResultado(id, valor) {
  document.getElementById(id).textContent = valor;
}

// =====================
// CALCULADORA CUOTA
// =====================
function calcularCuota() {
  const ingresos = parseFloat(document.getElementById('ingresos').value) || 0;
  const gastos   = parseFloat(document.getElementById('gastos').value)   || 0;

  if (ingresos <= 0) {
    alert('Introduce unos ingresos válidos para calcular.');
    return;
  }

  const netoAnual    = ingresos - gastos;
  const netoMensual  = netoAnual / 12;
  const tramo        = getTramo(netoMensual);
  const base         = tramo.baseMin;
  const cuota        = base * TIPO_COTIZACION;

  mostrarResultado('r-neto',     formatEur(netoAnual));
  mostrarResultado('r-neto-mes', formatEur(netoMensual));
  mostrarResultado('r-base',     formatEur(base));
  mostrarResultado('r-tipo',     (TIPO_COTIZACION * 100).toFixed(2) + '%');
  mostrarResultado('r-cuota',    formatEur(cuota));
  mostrarResultado('r-tramo',    '📍 ' + tramo.label);

  const resultado = document.getElementById('resultado');
  resultado.style.display = 'block';
  resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// =====================
// NAV ACTIVO
// =====================
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

// =====================
// ENTER EN INPUTS
// =====================
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const active = document.activeElement;
    if (active && active.closest('#cuota')) {
      calcularCuota();
    }
  }
});