// =====================
// CALCULADORA IVA 2026
// Modelo 303 — Liquidación trimestral
// =====================

function formatEur(n) {
  return n.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' €';
}

function getVal(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function mostrarResultado(id, valor) {
  document.getElementById(id).textContent = valor;
}

function calcularIVA() {
  // IVA repercutido
  const repBase21 = getVal('base-rep-21');
  const repBase10 = getVal('base-rep-10');
  const repBase4  = getVal('base-rep-4');

  const repCuota21 = repBase21 * 0.21;
  const repCuota10 = repBase10 * 0.10;
  const repCuota4  = repBase4  * 0.04;
  const totalRep   = repCuota21 + repCuota10 + repCuota4;

  // IVA soportado
  const sopBase21 = getVal('base-sop-21');
  const sopBase10 = getVal('base-sop-10');
  const sopBase4  = getVal('base-sop-4');
  const compAnt   = getVal('comp-ant');

  const sopCuota21 = sopBase21 * 0.21;
  const sopCuota10 = sopBase10 * 0.10;
  const sopCuota4  = sopBase4  * 0.04;
  const totalSop   = sopCuota21 + sopCuota10 + sopCuota4;

  // Diferencia y resultado final
  const diferencia    = totalRep - totalSop;
  const resultadoFinal = diferencia - compAnt;

  // Mostrar resultados
  mostrarResultado('r-rep-total',  formatEur(totalRep));
  mostrarResultado('r-sop-total',  formatEur(totalSop));
  mostrarResultado('r-diferencia', formatEur(diferencia));
  mostrarResultado('r-comp',       compAnt > 0 ? '– ' + formatEur(compAnt) : '0,00 €');

  const totalEl = document.getElementById('resultado-total-iva');
  const aviso   = document.getElementById('r-aviso-iva');
  const label   = document.getElementById('r-label-total');

  if (resultadoFinal > 0) {
    mostrarResultado('r-resultado-final', formatEur(resultadoFinal));
    label.textContent = 'A ingresar a Hacienda';
    totalEl.classList.remove('devolucion', 'compensar');
    aviso.textContent = '📅 Presenta el modelo 303 antes del día 20 del mes siguiente al trimestre.';
  } else if (resultadoFinal === 0) {
    mostrarResultado('r-resultado-final', '0,00 €');
    label.textContent = 'Resultado cero — sin ingreso ni devolución';
    totalEl.classList.remove('devolucion');
    totalEl.classList.add('compensar');
    aviso.textContent = '✅ El IVA repercutido y soportado se compensan exactamente.';
  } else {
    mostrarResultado('r-resultado-final', formatEur(Math.abs(resultadoFinal)));
    label.textContent = 'A compensar o solicitar devolución';
    totalEl.classList.add('devolucion');
    totalEl.classList.remove('compensar');
    aviso.textContent = '✅ Resultado negativo — puedes compensarlo en el siguiente trimestre o solicitar devolución en enero.';
  }

  const resultado = document.getElementById('resultado-iva');
  resultado.style.display = 'block';
  resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Enter en inputs
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const active = document.activeElement;
    if (active && active.closest('main')) {
      calcularIVA();
    }
  }
});