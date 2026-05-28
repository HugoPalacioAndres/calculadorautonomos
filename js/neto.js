// =====================
// CALCULADORA SALARIO NETO 2026
// =====================

const TRAMOS_RETA = [
  { min: 0,        max: 670,    base: 653.59  },
  { min: 670,      max: 900,    base: 718.95  },
  { min: 900,      max: 1166,   base: 849.67  },
  { min: 1166,     max: 1300,   base: 950     },
  { min: 1300,     max: 1500,   base: 960     },
  { min: 1500,     max: 1700,   base: 960     },
  { min: 1700,     max: 1850,   base: 1143.75 },
  { min: 1850,     max: 2030,   base: 1209    },
  { min: 2030,     max: 2330,   base: 1274    },
  { min: 2330,     max: 2760,   base: 1395    },
  { min: 2760,     max: 3190,   base: 1520    },
  { min: 3190,     max: 3620,   base: 1633    },
  { min: 3620,     max: 4050,   base: 1766    },
  { min: 4050,     max: 6000,   base: 1900    },
  { min: 6000,     max: Infinity, base: 4139.40 },
];

const TRAMOS_IRPF = [
  { min: 0,      max: 12450,  tipo: 0.19 },
  { min: 12450,  max: 20200,  tipo: 0.24 },
  { min: 20200,  max: 35200,  tipo: 0.30 },
  { min: 35200,  max: 60000,  tipo: 0.37 },
  { min: 60000,  max: 300000, tipo: 0.45 },
  { min: 300000, max: Infinity, tipo: 0.47 },
];

const TIPO_RETA = 0.3093;
const MIN_PERSONAL = 5550;

function formatEur(n) {
  return n.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' €';
}

function getVal(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function calcularReta(netoMensual) {
  const tramo = TRAMOS_RETA.find(t => netoMensual >= t.min && netoMensual < t.max)
    || TRAMOS_RETA[TRAMOS_RETA.length - 1];
  return tramo.base * TIPO_RETA * 12;
}

function calcularIRPF(base, hijos, discapacidad) {
  // Mínimo personal y familiar
  let minimo = MIN_PERSONAL;
  if (hijos >= 1) minimo += 2400;
  if (hijos >= 2) minimo += 2700;
  if (hijos >= 3) minimo += 4000;
  if (hijos >= 4) minimo += 4500;
  if (discapacidad >= 33) minimo += 3000;
  if (discapacidad >= 65) minimo += 9000;

  const baseIRPF = Math.max(0, base - minimo);
  let irpf = 0;

  for (const t of TRAMOS_IRPF) {
    if (baseIRPF <= t.min) break;
    const tramo = Math.min(baseIRPF, t.max) - t.min;
    irpf += tramo * t.tipo;
  }

  return irpf;
}

function calcularNeto() {
  const brutos      = getVal('ingresos-brutos');
  const gastos      = getVal('gastos-deducibles');
  const hijos       = getVal('hijos');
  const discap      = getVal('discapacidad');

  if (brutos <= 0) {
    alert('Introduce unos ingresos válidos para calcular.');
    return;
  }

  const neto        = brutos - gastos;
  const netoMensual = neto / 12;
  const reta        = calcularReta(netoMensual);
  const baseIRPF    = Math.max(0, neto - reta);
  const irpf        = calcularIRPF(baseIRPF, hijos, discap);
  const cargas      = reta + irpf;
  const netoFinal   = brutos - gastos - cargas;
  const netoMes     = netoFinal / 12;

  document.getElementById('r-brutos').textContent    = formatEur(brutos);
  document.getElementById('r-gastos').textContent    = '– ' + formatEur(gastos);
  document.getElementById('r-neto').textContent      = formatEur(neto);
  document.getElementById('r-reta').textContent      = '– ' + formatEur(reta);
  document.getElementById('r-irpf').textContent      = '– ' + formatEur(irpf);
  document.getElementById('r-cargas').textContent    = '– ' + formatEur(cargas);
  document.getElementById('r-neto-anual').textContent = formatEur(netoFinal);
  document.getElementById('r-neto-mensual').textContent = formatEur(netoMes);

  // Barra de distribución
  const pNeto   = Math.max(0, (netoFinal / brutos) * 100);
  const pReta   = (reta / brutos) * 100;
  const pIrpf   = (irpf / brutos) * 100;
  const pGastos = (gastos / brutos) * 100;

  document.getElementById('barra-neto-w').style.width   = pNeto   + '%';
  document.getElementById('barra-reta-w').style.width   = pReta   + '%';
  document.getElementById('barra-irpf-w').style.width   = pIrpf   + '%';
  document.getElementById('barra-gastos-w').style.width = pGastos + '%';

  // Aviso
  const pct = Math.round((netoFinal / brutos) * 100);
  document.getElementById('r-aviso-neto').textContent =
    `💡 Te quedas con el ${pct}% de tus ingresos brutos — el resto va en impuestos y cotizaciones.`;

  const resultado = document.getElementById('resultado-neto');
  resultado.style.display = 'block';
  resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Enter en inputs
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    if (document.activeElement && document.activeElement.closest('main')) {
      calcularNeto();
    }
  }
});