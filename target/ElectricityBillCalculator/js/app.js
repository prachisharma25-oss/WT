/**
 * app.js  –  ElectroBill: Electricity Bill Calculator
 * jQuery-powered interactivity for index.jsp and result.jsp
 */

$(function () {

    "use strict";

    /* ════════════════════════════════════════════════════════════════════
       CONSTANTS  (must mirror Bill.java constants)
    ════════════════════════════════════════════════════════════════════ */
    var RATE_SLAB1 = 3.50;
    var RATE_SLAB2 = 4.00;
    var RATE_SLAB3 = 5.20;
    var RATE_SLAB4 = 6.50;

    /**
     * Calculates the energy-only charge for the given number of units.
     * Mirrors the slab logic in Bill.java.
     *
     * @param  {number} units  Total units consumed
     * @return {number}        Energy charge (before fixed charge and tax)
     */
    function calculateEnergyCharge(units) {
        if (units <= 0) return 0;

        var charge = 0;

        // Slab 1: 0 – 50
        charge += Math.min(units, 50) * RATE_SLAB1;

        // Slab 2: 51 – 150
        if (units > 50) {
            charge += Math.min(units - 50, 100) * RATE_SLAB2;
        }

        // Slab 3: 151 – 250
        if (units > 150) {
            charge += Math.min(units - 150, 100) * RATE_SLAB3;
        }

        // Slab 4: above 250
        if (units > 250) {
            charge += (units - 250) * RATE_SLAB4;
        }

        return charge;
    }

    /* ════════════════════════════════════════════════════════════════════
       LIVE UNITS PREVIEW
       Updates the #unitsPreview banner as the user types readings.
    ════════════════════════════════════════════════════════════════════ */
    var $prevReading = $('#previousReading');
    var $currReading = $('#currentReading');
    var $preview     = $('#unitsPreview');
    var $previewUnits  = $('#previewUnits');
    var $previewCharge = $('#previewCharge');

    function updatePreview() {
        var prev  = parseInt($prevReading.val(), 10);
        var curr  = parseInt($currReading.val(), 10);

        if (!isNaN(prev) && !isNaN(curr) && curr >= prev) {
            var units  = curr - prev;
            var charge = calculateEnergyCharge(units);

            $previewUnits.text(units);
            $previewCharge.text('₹ ' + charge.toFixed(2));
            $preview.removeClass('d-none alert-info alert-warning alert-danger');

            // Change alert colour based on slab
            if (units <= 50) {
                $preview.addClass('alert-success');
            } else if (units <= 150) {
                $preview.addClass('alert-info');
            } else if (units <= 250) {
                $preview.addClass('alert-warning');
            } else {
                $preview.addClass('alert-danger');
            }
        } else {
            $preview.addClass('d-none');
        }
    }

    $prevReading.on('input', updatePreview);
    $currReading.on('input', updatePreview);

    /* ════════════════════════════════════════════════════════════════════
       CLIENT-SIDE FORM VALIDATION (Bootstrap 5 pattern)
    ════════════════════════════════════════════════════════════════════ */
    var $form      = $('#billForm');
    var $submitBtn = $('#submitBtn');

    $form.on('submit', function (event) {

        // Native HTML5 constraint check
        if (!this.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            $form.addClass('was-validated');
            // Scroll to first invalid field
            var $firstInvalid = $form.find(':invalid').first();
            $('html, body').animate({ scrollTop: $firstInvalid.offset().top - 120 }, 300);
            return;
        }

        var prev = parseInt($prevReading.val(), 10);
        var curr = parseInt($currReading.val(), 10);

        // Custom cross-field validation
        if (!isNaN(prev) && !isNaN(curr) && curr < prev) {
            event.preventDefault();
            $currReading.addClass('is-invalid');
            $currReading.siblings('.invalid-feedback')
                        .text('Current reading must be ≥ previous reading.');
            $currReading[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Show loading state on submit button
        $submitBtn.html(
            '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' +
            'Calculating…'
        ).addClass('btn-loading');

        $form.addClass('was-validated');
    });

    // Clear cross-field error when current reading changes
    $currReading.on('input', function () {
        $(this).removeClass('is-invalid');
    });

    /* ════════════════════════════════════════════════════════════════════
       RESET BUTTON – clear validation state
    ════════════════════════════════════════════════════════════════════ */
    $('#resetBtn').on('click', function () {
        $form.removeClass('was-validated');
        $form.find('.is-invalid').removeClass('is-invalid');
        $preview.addClass('d-none');
    });

    /* ════════════════════════════════════════════════════════════════════
       INPUT FORMATTING – prevent negative numbers
    ════════════════════════════════════════════════════════════════════ */
    $('input[type="number"]').on('input', function () {
        var val = parseInt($(this).val(), 10);
        if (val < 0) $(this).val(0);
    });

    /* ════════════════════════════════════════════════════════════════════
       RESULT PAGE – animated counter for total amount
    ════════════════════════════════════════════════════════════════════ */
    if ($('#billCard').length) {

        // Animate total amount on page load
        var $amountEl = $('.amount-highlight-card h2');
        if ($amountEl.length) {
            var raw     = $amountEl.text().replace(/[^0-9.]/g, '');
            var target  = parseFloat(raw);
            var start   = 0;
            var duration = 1200;
            var startTime = null;

            function animateCount(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                // ease-out cubic
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = (start + eased * (target - start)).toFixed(2);
                $amountEl.text('₹ ' + current);
                if (progress < 1) {
                    requestAnimationFrame(animateCount);
                }
            }

            requestAnimationFrame(animateCount);
        }

        /* ── Save as PDF ─────────────────────────────────────────────── */
        $('#downloadBtn').on('click', function () {
            // Use the browser's native print-to-PDF
            window.print();
        });

        /* ── Animate progress bars on scroll into view ───────────────── */
        var progressObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    $(entry.target).find('.progress-bar').each(function () {
                        var $bar  = $(this);
                        var width = $bar.css('width');
                        $bar.css('width', '0%')
                            .animate({ width: width }, 800);
                    });
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        $('.progress').each(function () {
            progressObserver.observe(this.closest('.card') || this);
        });

    }

    /* ════════════════════════════════════════════════════════════════════
       TOOLTIP INITIALIZATION (Bootstrap)
    ════════════════════════════════════════════════════════════════════ */
    var tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach(function (el) {
        new bootstrap.Tooltip(el);
    });

    /* ════════════════════════════════════════════════════════════════════
       SET DEFAULT BILLING MONTH TO CURRENT MONTH
    ════════════════════════════════════════════════════════════════════ */
    var $monthInput = $('#month');
    if ($monthInput.length && !$monthInput.val()) {
        var now   = new Date();
        var yr    = now.getFullYear();
        var mo    = String(now.getMonth() + 1).padStart(2, '0');
        $monthInput.val(yr + '-' + mo);
    }

});
