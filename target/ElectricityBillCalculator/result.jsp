<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.electricity.model.Bill" %>
<%-- result.jsp : Electricity Bill – Detailed Result Page --%>
<%
    Bill bill = (Bill) request.getAttribute("bill");
    if (bill == null) {
        response.sendRedirect(request.getContextPath() + "/index.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bill Result – <%= bill.getCustomerName() %></title>

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
        <div class="ms-auto">
            <a href="index.jsp" class="btn btn-outline-light btn-sm">
                <i class="bi bi-calculator me-1"></i>New Calculation
            </a>
        </div>
    </div>
</nav>

<!-- ════════════════════ HERO ════════════════════ -->
<div class="hero-banner py-4">
    <div class="container text-center text-white">
        <i class="bi bi-receipt-cutoff display-5 text-warning"></i>
        <h2 class="fw-bold mt-2">Electricity Bill Statement</h2>
        <p class="mb-0 opacity-75">Billing Period: <strong><%= bill.getMonth() %></strong></p>
    </div>
</div>

<!-- ════════════════════ MAIN CONTENT ════════════════════ -->
<main class="py-5">
    <div class="container">
        <div class="row g-4 justify-content-center">

            <!-- ── BILL STATEMENT CARD ── -->
            <div class="col-12 col-lg-8">
                <div class="card border-0 shadow-lg rounded-4 overflow-hidden" id="billCard">

                    <!-- Bill Header -->
                    <div class="card-header bg-primary text-white py-4">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <div class="bill-icon-circle">
                                    <i class="bi bi-lightning-charge-fill text-warning fs-3"></i>
                                </div>
                            </div>
                            <div class="col">
                                <h4 class="mb-0 fw-bold">ElectroBill</h4>
                                <small class="opacity-75">Official Electricity Bill Statement</small>
                            </div>
                            <div class="col-auto text-end">
                                <span class="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill">
                                    <i class="bi bi-calendar3 me-1"></i><%= bill.getMonth() %>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="card-body p-4">

                        <!-- Consumer Details -->
                        <h6 class="text-primary fw-bold border-bottom pb-2 mb-3">
                            <i class="bi bi-person-badge me-1"></i>Consumer Details
                        </h6>
                        <div class="row g-2 mb-4">
                            <div class="col-sm-6">
                                <div class="detail-row">
                                    <span class="text-muted small">Consumer Name</span>
                                    <p class="fw-semibold mb-0"><%= bill.getCustomerName() %></p>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="detail-row">
                                    <span class="text-muted small">Consumer ID</span>
                                    <p class="fw-semibold mb-0"><%= bill.getCustomerId() %></p>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="detail-row">
                                    <span class="text-muted small">Meter Number</span>
                                    <p class="fw-semibold mb-0"><%= bill.getMeterNumber() %></p>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="detail-row">
                                    <span class="text-muted small">Address</span>
                                    <p class="fw-semibold mb-0"><%= bill.getAddress() %></p>
                                </div>
                            </div>
                        </div>

                        <!-- Meter Readings -->
                        <h6 class="text-primary fw-bold border-bottom pb-2 mb-3">
                            <i class="bi bi-speedometer me-1"></i>Meter Readings
                        </h6>
                        <div class="row g-2 mb-4">
                            <div class="col-sm-4">
                                <div class="reading-box bg-light rounded-3 p-3 text-center">
                                    <i class="bi bi-arrow-up-circle text-secondary fs-4"></i>
                                    <p class="text-muted small mb-1 mt-1">Previous Reading</p>
                                    <h5 class="fw-bold mb-0"><%= bill.getPreviousReading() %> <small class="fs-6 text-muted">kWh</small></h5>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="reading-box bg-light rounded-3 p-3 text-center">
                                    <i class="bi bi-arrow-down-circle text-secondary fs-4"></i>
                                    <p class="text-muted small mb-1 mt-1">Current Reading</p>
                                    <h5 class="fw-bold mb-0"><%= bill.getCurrentReading() %> <small class="fs-6 text-muted">kWh</small></h5>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="reading-box bg-primary bg-opacity-10 border border-primary rounded-3 p-3 text-center">
                                    <i class="bi bi-lightning-fill text-primary fs-4"></i>
                                    <p class="text-muted small mb-1 mt-1">Units Consumed</p>
                                    <h5 class="fw-bold text-primary mb-0"><%= bill.getUnitsConsumed() %> <small class="fs-6">Units</small></h5>
                                </div>
                            </div>
                        </div>

                        <!-- Slab-wise Charge Breakdown -->
                        <h6 class="text-primary fw-bold border-bottom pb-2 mb-3">
                            <i class="bi bi-bar-chart-steps me-1"></i>Slab-wise Charge Breakdown
                        </h6>
                        <div class="table-responsive mb-4">
                            <table class="table table-bordered table-hover align-middle">
                                <thead class="table-primary">
                                    <tr>
                                        <th>Slab</th>
                                        <th>Units Range</th>
                                        <th class="text-center">Rate (₹/Unit)</th>
                                        <th class="text-center">Units Used</th>
                                        <th class="text-end">Charge (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="<%= bill.getSlab1Units() > 0 ? "table-success" : "" %>">
                                        <td><span class="badge bg-success">Slab 1</span></td>
                                        <td>0 – 50 Units</td>
                                        <td class="text-center">3.50</td>
                                        <td class="text-center fw-semibold"><%= (int) bill.getSlab1Units() %></td>
                                        <td class="text-end fw-semibold">₹ <%= String.format("%.2f", bill.getSlab1Charge()) %></td>
                                    </tr>
                                    <tr class="<%= bill.getSlab2Units() > 0 ? "table-primary bg-opacity-25" : "" %>">
                                        <td><span class="badge bg-primary">Slab 2</span></td>
                                        <td>51 – 150 Units</td>
                                        <td class="text-center">4.00</td>
                                        <td class="text-center fw-semibold"><%= (int) bill.getSlab2Units() %></td>
                                        <td class="text-end fw-semibold">₹ <%= String.format("%.2f", bill.getSlab2Charge()) %></td>
                                    </tr>
                                    <tr class="<%= bill.getSlab3Units() > 0 ? "table-warning" : "" %>">
                                        <td><span class="badge bg-warning text-dark">Slab 3</span></td>
                                        <td>151 – 250 Units</td>
                                        <td class="text-center">5.20</td>
                                        <td class="text-center fw-semibold"><%= (int) bill.getSlab3Units() %></td>
                                        <td class="text-end fw-semibold">₹ <%= String.format("%.2f", bill.getSlab3Charge()) %></td>
                                    </tr>
                                    <tr class="<%= bill.getSlab4Units() > 0 ? "table-danger" : "" %>">
                                        <td><span class="badge bg-danger">Slab 4</span></td>
                                        <td>Above 250 Units</td>
                                        <td class="text-center">6.50</td>
                                        <td class="text-center fw-semibold"><%= (int) bill.getSlab4Units() %></td>
                                        <td class="text-end fw-semibold">₹ <%= String.format("%.2f", bill.getSlab4Charge()) %></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Bill Summary -->
                        <h6 class="text-primary fw-bold border-bottom pb-2 mb-3">
                            <i class="bi bi-receipt me-1"></i>Bill Summary
                        </h6>
                        <div class="summary-box rounded-3 p-3 mb-4">
                            <div class="d-flex justify-content-between py-2 border-bottom">
                                <span class="text-muted">Energy Charges</span>
                                <span class="fw-semibold">₹ <%= String.format("%.2f", bill.getEnergyCharge()) %></span>
                            </div>
                            <div class="d-flex justify-content-between py-2 border-bottom">
                                <span class="text-muted">Fixed Charges</span>
                                <span class="fw-semibold">₹ <%= String.format("%.2f", bill.getFixedCharge()) %></span>
                            </div>
                            <div class="d-flex justify-content-between py-2 border-bottom">
                                <span class="text-muted">Service Tax (5%)</span>
                                <span class="fw-semibold">₹ <%= String.format("%.2f", bill.getTaxAmount()) %></span>
                            </div>
                            <div class="d-flex justify-content-between py-2 mt-1">
                                <span class="fw-bold fs-5 text-primary">Total Payable Amount</span>
                                <span class="fw-bold fs-4 text-primary">₹ <%= String.format("%.2f", bill.getTotalAmount()) %></span>
                            </div>
                        </div>

                        <!-- Usage Indicator Bar -->
                        <%
                            int units = bill.getUnitsConsumed();
                            String usageLevel, usageBadge;
                            if (units <= 50) {
                                usageLevel = "Low"; usageBadge = "bg-success";
                            } else if (units <= 150) {
                                usageLevel = "Moderate"; usageBadge = "bg-primary";
                            } else if (units <= 250) {
                                usageLevel = "High"; usageBadge = "bg-warning text-dark";
                            } else {
                                usageLevel = "Very High"; usageBadge = "bg-danger";
                            }
                        %>
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <small class="text-muted">Usage Level:</small>
                            <span class="badge <%= usageBadge %>"><%= usageLevel %></span>
                        </div>
                        <div class="progress rounded-pill" style="height: 10px;">
                            <div class="progress-bar <%= units > 250 ? "bg-danger" : units > 150 ? "bg-warning" : units > 50 ? "bg-primary" : "bg-success" %>"
                                 role="progressbar"
                                 style="width: <%= Math.min((bill.getUnitsConsumed() * 100) / 400, 100) %>%"
                                 aria-valuenow="<%= bill.getUnitsConsumed() %>"
                                 aria-valuemin="0" aria-valuemax="400">
                            </div>
                        </div>
                        <div class="d-flex justify-content-between mt-1">
                            <small class="text-muted">0</small>
                            <small class="text-muted">50</small>
                            <small class="text-muted">150</small>
                            <small class="text-muted">250</small>
                            <small class="text-muted">400+</small>
                        </div>

                    </div><!-- /card-body -->

                    <!-- Action Buttons -->
                    <div class="card-footer bg-light py-3">
                        <div class="d-flex flex-wrap gap-2 justify-content-between align-items-center">
                            <a href="index.jsp" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-left-circle me-1"></i>New Calculation
                            </a>
                            <div class="d-flex gap-2">
                                <button class="btn btn-success" id="printBtn" onclick="window.print()">
                                    <i class="bi bi-printer-fill me-1"></i>Print Bill
                                </button>
                                <button class="btn btn-secondary" id="downloadBtn">
                                    <i class="bi bi-download me-1"></i>Save as PDF
                                </button>
                            </div>
                        </div>
                    </div>

                </div><!-- /card -->
            </div><!-- /col -->

            <!-- ── SIDEBAR ── -->
            <div class="col-12 col-lg-4">

                <!-- Total Amount Highlight -->
                <div class="card border-0 shadow rounded-4 mb-4 text-center p-4 amount-highlight-card">
                    <i class="bi bi-currency-rupee display-4 text-primary"></i>
                    <h6 class="text-muted mt-2 mb-1">Total Payable</h6>
                    <h2 class="fw-bold text-primary">₹ <%= String.format("%.2f", bill.getTotalAmount()) %></h2>
                    <p class="text-muted small mb-0">For <%= bill.getUnitsConsumed() %> units consumed</p>
                </div>

                <!-- Quick Info -->
                <div class="card border-0 shadow rounded-4 mb-4">
                    <div class="card-header bg-secondary text-white rounded-top-4 py-3">
                        <h6 class="mb-0 fw-bold">
                            <i class="bi bi-info-circle me-2"></i>Charge Summary
                        </h6>
                    </div>
                    <ul class="list-group list-group-flush rounded-bottom-4">
                        <li class="list-group-item d-flex justify-content-between">
                            <span class="text-muted small">Energy Charges</span>
                            <strong>₹ <%= String.format("%.2f", bill.getEnergyCharge()) %></strong>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span class="text-muted small">Fixed Charges</span>
                            <strong>₹ <%= String.format("%.2f", bill.getFixedCharge()) %></strong>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span class="text-muted small">Tax (5%)</span>
                            <strong>₹ <%= String.format("%.2f", bill.getTaxAmount()) %></strong>
                        </li>
                        <li class="list-group-item d-flex justify-content-between bg-primary bg-opacity-10 rounded-bottom-4">
                            <span class="fw-bold text-primary">Total</span>
                            <strong class="text-primary">₹ <%= String.format("%.2f", bill.getTotalAmount()) %></strong>
                        </li>
                    </ul>
                </div>

                <!-- Slab Visual -->
                <div class="card border-0 shadow rounded-4">
                    <div class="card-header bg-info text-white rounded-top-4 py-3">
                        <h6 class="mb-0 fw-bold">
                            <i class="bi bi-bar-chart me-2"></i>Slab Contribution
                        </h6>
                    </div>
                    <div class="card-body">
                        <% if (bill.getSlab1Units() > 0) { %>
                        <div class="mb-2">
                            <div class="d-flex justify-content-between small mb-1">
                                <span class="badge bg-success">Slab 1</span>
                                <span><%= (int)bill.getSlab1Units() %> units → ₹ <%= String.format("%.2f", bill.getSlab1Charge()) %></span>
                            </div>
                            <div class="progress" style="height:8px;">
                                <div class="progress-bar bg-success" style="width:<%= bill.getSlab1Units()*2 %>%"></div>
                            </div>
                        </div>
                        <% } %>
                        <% if (bill.getSlab2Units() > 0) { %>
                        <div class="mb-2">
                            <div class="d-flex justify-content-between small mb-1">
                                <span class="badge bg-primary">Slab 2</span>
                                <span><%= (int)bill.getSlab2Units() %> units → ₹ <%= String.format("%.2f", bill.getSlab2Charge()) %></span>
                            </div>
                            <div class="progress" style="height:8px;">
                                <div class="progress-bar bg-primary" style="width:<%= bill.getSlab2Units() %>%"></div>
                            </div>
                        </div>
                        <% } %>
                        <% if (bill.getSlab3Units() > 0) { %>
                        <div class="mb-2">
                            <div class="d-flex justify-content-between small mb-1">
                                <span class="badge bg-warning text-dark">Slab 3</span>
                                <span><%= (int)bill.getSlab3Units() %> units → ₹ <%= String.format("%.2f", bill.getSlab3Charge()) %></span>
                            </div>
                            <div class="progress" style="height:8px;">
                                <div class="progress-bar bg-warning" style="width:<%= bill.getSlab3Units() %>%"></div>
                            </div>
                        </div>
                        <% } %>
                        <% if (bill.getSlab4Units() > 0) { %>
                        <div class="mb-2">
                            <div class="d-flex justify-content-between small mb-1">
                                <span class="badge bg-danger">Slab 4</span>
                                <span><%= (int)bill.getSlab4Units() %> units → ₹ <%= String.format("%.2f", bill.getSlab4Charge()) %></span>
                            </div>
                            <div class="progress" style="height:8px;">
                                <div class="progress-bar bg-danger" style="width:<%= Math.min(bill.getSlab4Units()/3, 100) %>%"></div>
                            </div>
                        </div>
                        <% } %>
                    </div>
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
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="js/app.js"></script>

</body>
</html>
