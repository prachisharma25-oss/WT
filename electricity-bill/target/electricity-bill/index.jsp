<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electricity Bill Calculator</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="page-wrapper">
        <!-- Header -->
        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <span class="logo-icon">⚡</span>
                    <span class="logo-text">ElectriBill</span>
                </div>
                <p class="header-tagline">Smart Electricity Bill Calculator</p>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <div class="container">

                <!-- Rate Card -->
                <section class="rate-card">
                    <h2 class="section-title">Tariff Rates</h2>
                    <div class="rate-grid">
                        <div class="rate-item">
                            <span class="rate-range">First 50 units</span>
                            <span class="rate-price">₹ 3.50 <small>/unit</small></span>
                        </div>
                        <div class="rate-item">
                            <span class="rate-range">Next 100 units</span>
                            <span class="rate-price">₹ 4.00 <small>/unit</small></span>
                        </div>
                        <div class="rate-item">
                            <span class="rate-range">Next 100 units</span>
                            <span class="rate-price">₹ 5.20 <small>/unit</small></span>
                        </div>
                        <div class="rate-item highlight">
                            <span class="rate-range">Above 250 units</span>
                            <span class="rate-price">₹ 6.50 <small>/unit</small></span>
                        </div>
                    </div>
                </section>

                <!-- Calculator Form -->
                <section class="calculator-section">
                    <h2 class="section-title">Calculate Your Bill</h2>
                    <form action="calculate" method="post" class="bill-form" id="billForm">
                        <div class="form-group">
                            <label for="customerName">Customer Name</label>
                            <input type="text" id="customerName" name="customerName"
                                   placeholder="Enter your name"
                                   value="<%= request.getParameter("customerName") != null ? request.getParameter("customerName") : "" %>"
                                   required>
                        </div>

                        <div class="form-group">
                            <label for="meterId">Meter ID / Account No.</label>
                            <input type="text" id="meterId" name="meterId"
                                   placeholder="e.g. MTR-2024-001"
                                   value="<%= request.getParameter("meterId") != null ? request.getParameter("meterId") : "" %>"
                                   required>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="prevReading">Previous Reading (units)</label>
                                <input type="number" id="prevReading" name="prevReading"
                                       placeholder="0" min="0"
                                       value="<%= request.getParameter("prevReading") != null ? request.getParameter("prevReading") : "" %>"
                                       required>
                            </div>
                            <div class="form-group">
                                <label for="currReading">Current Reading (units)</label>
                                <input type="number" id="currReading" name="currReading"
                                       placeholder="0" min="0"
                                       value="<%= request.getParameter("currReading") != null ? request.getParameter("currReading") : "" %>"
                                       required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="month">Billing Month</label>
                            <select id="month" name="month" required>
                                <option value="">-- Select Month --</option>
                                <%
                                    String[] months = {"January","February","March","April","May","June",
                                                       "July","August","September","October","November","December"};
                                    String selectedMonth = request.getParameter("month");
                                    for (String m : months) {
                                        String sel = (m.equals(selectedMonth)) ? "selected" : "";
                                %>
                                <option value="<%= m %>" <%= sel %>><%= m %></option>
                                <% } %>
                            </select>
                        </div>

                        <button type="submit" class="btn-calculate">
                            <span>⚡ Calculate Bill</span>
                        </button>
                    </form>
                </section>

            </div>
        </main>

        <footer class="footer">
            <p>© 2026 ElectriBill — Electricity Bill Calculator &nbsp;|&nbsp; Built with JSP</p>
        </footer>
    </div>

    <script src="js/script.js"></script>
</body>
</html>
