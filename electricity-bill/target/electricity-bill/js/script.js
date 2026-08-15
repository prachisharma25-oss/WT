/* ========================================
   ElectriBill — Client-side Validation
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('billForm');
    if (!form) return;

    const prevInput = document.getElementById('prevReading');
    const currInput = document.getElementById('currReading');

    /* Live validation: current reading must be >= previous */
    function validateReadings() {
        const prev = parseFloat(prevInput.value);
        const curr = parseFloat(currInput.value);

        if (!isNaN(prev) && !isNaN(curr)) {
            if (curr < prev) {
                currInput.setCustomValidity('Current reading must be ≥ previous reading.');
                currInput.style.borderColor = '#ef4444';
            } else {
                currInput.setCustomValidity('');
                currInput.style.borderColor = '';
            }
        }
    }

    prevInput?.addEventListener('input', validateReadings);
    currInput?.addEventListener('input', validateReadings);

    /* Live units preview */
    function showUnitsPreview() {
        const prev = parseFloat(prevInput.value);
        const curr = parseFloat(currInput.value);

        let preview = document.getElementById('unitsPreview');

        if (!isNaN(prev) && !isNaN(curr) && curr >= prev) {
            const units = curr - prev;

            if (!preview) {
                preview = document.createElement('small');
                preview.id = 'unitsPreview';
                preview.style.cssText = 'color:#f59e0b; font-size:0.8rem; margin-top:0.25rem;';
                currInput.parentElement.appendChild(preview);
            }
            preview.textContent = `Units consumed: ${units.toFixed(2)}`;
        } else if (preview) {
            preview.textContent = '';
        }
    }

    prevInput?.addEventListener('input', showUnitsPreview);
    currInput?.addEventListener('input', showUnitsPreview);

    /* Form submit feedback */
    form.addEventListener('submit', (e) => {
        const btn = form.querySelector('.btn-calculate');
        if (btn && form.checkValidity()) {
            btn.textContent = '⏳ Calculating...';
            btn.style.opacity = '0.8';
        }
    });

    /* Animate result rows on result page */
    const rows = document.querySelectorAll('.breakdown-table tbody tr');
    rows.forEach((row, i) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 100 + i * 80);
    });

    /* Animate total amount counter on result page */
    const totalAmountEl = document.querySelector('.total-amount');
    if (totalAmountEl) {
        const raw = totalAmountEl.textContent.replace(/[₹,\s]/g, '');
        const target = parseFloat(raw);

        if (!isNaN(target)) {
            let start = 0;
            const duration = 800;
            const step = 16;
            const increment = target / (duration / step);

            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    start = target;
                    clearInterval(timer);
                }
                totalAmountEl.textContent = '₹ ' + start.toFixed(2);
            }, step);
        }
    }
});
