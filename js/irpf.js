// =====================
// CALCULADORA IRPF 2026
// Modelo 130 — Estimación directa
// =====================

function formatEur(n) {
  return n.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' €';
}

function mostrarResultado(id, valor) {
  document.getElementById(id).textContent = valor;
}

function calcularIRPF() {
  const ingresosTri  = parseFloat(document.getElementById('ingresos-tri').value)  || 0;
  const gastosTri    = parseFloat(document.getElementById('gastos-tri').value)    || 0;
  const pagosAnt     = parseFloat(document.getElementById('pagos-ant').value)     || 0;
  const retenciones  = parseFloat(document.getElementById('retenciones').value)   || 0;

  if (ingresosTri <= 0) {
    alert('Introduce unos ingresos válidos para calcular.');
    return;
  }

  // Rendimiento neto del trimestre
  const netoTri = ingresosTri - gastosTri;

  // Base acumulada (rendimiento neto acumulado en el año)
  // El modelo 130 trabaja sobre acumulado — aquí calculamos sobre el trimestre actual
  const baseAcumulada = netoTri;

  // 20% sobre base acumulada
  const veintePorciento = baseAcumulada * 0.20;

  // Menos pagos anteriores y retenciones soportadas
  const deducciones = pagosAnt + retenciones;

  // Resultado final
  const aIngresar = veintePorciento - deducciones;

  // Mostrar resultados
  mostrarResultado('r-neto-tri',   formatEur(netoTri));
  mostrarResultado('r-base-acum',  formatEur(baseAcumulada));
  mostrarResultado('r-veinte',     formatEur(veintePorciento));
  mostrarResultado('r-menos',      '– ' + formatEur(deducciones));
  mostrarResultado('r-ingreso',    formatEur(Math.max(0, aIngresar)));

  // Mensaje según resultado
  const aviso = document.getElementById('r-aviso');
  const totalEl = document.getElementById('resultado-total-irpf');

  if (aIngresar <= 0) {
    aviso.textContent = '✅ Resultado negativo o cero — este trimestre no tienes que ingresar nada. El exceso se acumula para el siguiente trimestre.';
    totalEl.classList.add('negativo');
    totalEl.classList.remove('cero');
    mostrarResultado('r-ingreso', '0,00 €');
  } else if (aIngresar < 50) {
    aviso.textContent = '⚠️ Importe reducido — recuerda que si el resultado es menor de 50€ puedes acumularlo al siguiente trimestre.';
    totalEl.classList.remove('negativo', 'cero');
  } else {
    aviso.textContent = '📅 Presenta el modelo 130 antes del día 20 del mes siguiente al trimestre.';
    totalEl.classList.remove('negativo', 'cero');
  }

  const resultado = document.getElementById('resultado-irpf');
  resultado.style.display = 'block';
  resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Enter en inputs
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const active = document.activeElement;
    if (active && active.closest('main')) {
      calcularIRPF();
    }
  }
});