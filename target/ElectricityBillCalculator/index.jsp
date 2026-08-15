<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%-- index.jsp : Electricity Bill Calculator – Input Form --%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electricity Bill Calculator</title>

    <!-- Bootstrap 5 CSS -->
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <!-- Custom Styles -->
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

<!-- ════════════════════ NAVBAR ════════════════════ -->
<nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
    <div class="container">
        <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="index.jsp">
            <i class="bi bi-lightning-charge-fill text-warning fs-4"></i>
            <span>ElectroBill</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link active" href="index.jsp">
                        <i class="bi bi-calculator me-1"></i>Calculator
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#rateCard" data-bs-toggle="modal">
                        <i class="bi bi-table me-1"></i>Rate Card
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- ════════════════════ HERO BANNER ════════════════════ -->
<div class="hero-banner py-4 py-md-5">
    <div class="container text-center text-white">
        <i class="bi bi-lightning-charge-fill display-4 text-warning"></i>
        <h1 class="display-5 fw-bold mt-2">Electricity Bill Calculator</h1>
        <p class="lead mb-0 opacity-75">Enter your meter readings to get an instant bill breakdown</p>
    </div>
</div>

<!-- ════════════════════ MAIN CONTENT ════════════════════ -->
<main class="py-5">
    <div class="container">
        <div class="row g-4 justify-content-center">

            <!-- ── FORM CARD ── -->
            <div class="col-12 col-lg-7">
                <div class="card shadow-lg border-0 rounded-4">
                    <div class="card-header bg-primary text-white rounded-top-4 py-3">
                        <h5 class="mb-0 fw-semibold">
                            <i class="bi bi-person-lines-fill me-2"></i>Consumer Details &amp; Meter Readings
                        </h5>
                    </div>
                    <div class="card-body p-4">

                        <!-- Server-side Error Alert -->
                        <%
                            String errorMessage = (String) request.getAttribute("errorMessage");
                            if (errorMessage != null && !errorMessage.isEmpty()) {
                        %>
                        <div class="alert alert-danger alert-dismissible fade show" role="alert" id="serverError">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>
                            <%= errorMessage %>
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                        <%  } %>

                        <form id="billForm" action="calculateBill" method="post" novalidate>

                            <!-- Consumer Information -->
                            <h6 class="text-primary fw-bold mb-3 border-bottom pb-2">
                                <i class="bi bi-person-badge me-1"></i>Consumer Information
                            </h6>
                            <div class="row g-3 mb-3">
                                <div class="col-md-6">
                                    <label for="customerName" class="form-label fw-medium">
                                        Full Name <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-person"></i></span>
                                        <input type="text" class="form-control" id="customerName"
                                               name="customerName" placeholder="Enter full name"
                                               value="${customerName}" required>
                                        <div class="invalid-feedback">Please enter the customer name.</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="customerId" class="form-label fw-medium">
                                        Consumer ID <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-hash"></i></span>
                                        <input type="text" class="form-control" id="customerId"
                                               name="customerId" placeholder="e.g. EB-2024-001"
                                               value="${customerId}" required>
                                        <div class="invalid-feedback">Please enter the consumer ID.</div>
                                    </div>
                                </div>
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-12">
                                    <label for="address" class="form-label fw-medium">
                                        Address <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
                                        <input type="text" class="form-control" id="address"
                                               name="address" placeholder="Enter full address"
                                               value="${address}" required>
                                        <div class="invalid-feedback">Please enter the address.</div>
                                    </div>
                                </div>
                            </div>

                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <label for="meterNumber" class="form-label fw-medium">
                                        Meter Number <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-speedometer2"></i></span>
                                        <input type="text" class="form-control" id="meterNumber"
                                               name="meterNumber" placeholder="e.g. MTR-567890"
                                               value="${meterNumber}" required>
                                        <div class="invalid-feedback">Please enter the meter number.</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="month" class="form-label fw-medium">
                                        Billing Month <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-calendar3"></i></span>
                                        <input type="month" class="form-control" id="month"
                                               name="month" value="${month}" required>
                                        <div class="invalid-feedback">Please select the billing month.</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Meter Readings -->
                            <h6 class="text-primary fw-bold mb-3 border-bottom pb-2">
                                <i class="bi bi-speedometer me-1"></i>Meter Readings (kWh / Units)
                            </h6>
                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <label for="previousReading" class="form-label fw-medium">
                                        Previous Reading <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-arrow-up-circle"></i></span>
                                        <input type="number" class="form-control" id="previousReading"
                                               name="previousReading" placeholder="e.g. 1200" min="0"
                                               value="${previousReading}" required>
                                        <span class="input-group-text text-muted">Units</span>
                                        <div class="invalid-feedback">Enter a valid non-negative reading.</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="currentReading" class="form-label fw-medium">
                                        Current Reading <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-arrow-down-circle"></i></span>
                                        <input type="number" class="form-control" id="currentReading"
                                               name="currentReading" placeholder="e.g. 1480" min="0"
                                               value="${currentReading}" required>
                                        <span class="input-group-text text-muted">Units</span>
                                        <div class="invalid-feedback">Enter a valid reading ≥ previous reading.</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Live Units Preview (jQuery) -->
                            <div id="unitsPreview" class="alert alert-info d-none mb-4" role="alert">
                                <i class="bi bi-info-circle-fill me-2"></i>
                                Units consumed this month:
                                <strong id="previewUnits" class="fs-5">0</strong> kWh
                                &nbsp;|&nbsp; Estimated charge (energy only):
                                <strong id="previewCharge">₹ 0.00</strong>
                            </div>

                            <!-- Submit -->
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button type="reset" class="btn btn-outline-secondary px-4"
                                        id="resetBtn">
                                    <i class="bi bi-arrow-counterclockwise me-1"></i>Reset
                                </button>
                                <button type="submit" class="btn btn-primary px-5 fw-semibold"
                                        id="submitBtn">
                                    <i class="bi bi-calculator-fill me-2"></i>Calculate Bill
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <!-- ── SIDEBAR : Rate Card ── -->
            <div class="col-12 col-lg-4">

                <!-- Rate Card -->
                <div class="card border-0 shadow rounded-4 mb-4">
                    <div class="card-header bg-warning text-dark rounded-top-4 py-3">
                        <h6 class="mb-0 fw-bold">
                            <i class="bi bi-table me-2"></i>Current Tariff Rates
                        </h6>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover table-striped mb-0 rounded-bottom-4 overflow-hidden">
                            <thead class="table-dark">
                                <tr>
                                    <th>Slab (Units)</th>
                                    <th class="text-end">Rate / Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="badge bg-success me-1">1</span>0 – 50</td>
                                    <td class="text-end fw-semibold">₹ 3.50</td>
                                </tr>
                                <tr>
                                    <td><span class="badge bg-primary me-1">2</span>51 – 150</td>
                                    <td class="text-end fw-semibold">₹ 4.00</td>
                                </tr>
                                <tr>
                                    <td><span class="badge bg-warning text-dark me-1">3</span>151 – 250</td>
                                    <td class="text-end fw-semibold">₹ 5.20</td>
                                </tr>
                                <tr>
                                    <td><span class="badge bg-danger me-1">4</span>Above 250</td>
                                    <td class="text-end fw-semibold">₹ 6.50</td>
                                </tr>
                            </tbody>
                            <tfoot class="table-secondary">
                                <tr>
                                    <td>Fixed Charge</td>
                                    <td class="text-end fw-semibold">₹ 50.00 / month</td>
                                </tr>
                                <tr>
                                    <td>Service Tax</td>
                                    <td class="text-end fw-semibold">5 %</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <!-- Quick Tips -->
                <div class="card border-0 shadow rounded-4">
                    <div class="card-header bg-info text-white rounded-top-4 py-3">
                        <h6 class="mb-0 fw-bold">
                            <i class="bi bi-lightbulb me-2"></i>Energy Saving Tips
                        </h6>
                    </div>
                    <ul class="list-group list-group-flush rounded-bottom-4">
                        <li class="list-group-item d-flex align-items-start gap-2">
                            <i class="bi bi-check-circle-fill text-success mt-1"></i>
                            <small>Use LED bulbs instead of incandescent lights.</small>
                        </li>
                        <li class="list-group-item d-flex align-items-start gap-2">
                            <i class="bi bi-check-circle-fill text-success mt-1"></i>
                            <small>Switch off appliances at the plug when not in use.</small>
                        </li>
                        <li class="list-group-item d-flex align-items-start gap-2">
                            <i class="bi bi-check-circle-fill text-success mt-1"></i>
                            <small>Set AC temperature to 24–26 °C for optimal efficiency.</small>
                        </li>
                        <li class="list-group-item d-flex align-items-start gap-2">
                            <i class="bi bi-check-circle-fill text-success mt-1"></i>
                            <small>Use natural light during daytime hours.</small>
                        </li>
                        <li class="list-group-item d-flex align-items-start gap-2 rounded-bottom-4">
                            <i class="bi bi-check-circle-fill text-success mt-1"></i>
                            <small>Install solar panels to reduce grid dependency.</small>
                        </li>
                    </ul>
                </div>

            </div><!-- /sidebar -->
        </div><!-- /row -->
    </div><!-- /container -->
</main>

<!-- ════════════════════ FOOTER ════════════════════ -->
<footer class="bg-dark text-white py-4 mt-4">
    <div class="container text-center">
        <p class="mb-1">
            <i class="bi bi-lightning-charge-fill text-warning me-1"></i>
            <strong>ElectroBill</strong> &mdash; Electricity Bill Calculator
        </p>
        <small class="text-muted">
            Tariff rates are for illustrative purposes only. &copy; 2024
        </small>
    </div>
</footer>

<!-- ════════════════════ SCRIPTS ════════════════════ -->

<!-- jQuery 3.7 -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- Bootstrap 5 Bundle (Popper included) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- Custom JS -->
<script src="js/app.js"></script>

</body>
</html>
