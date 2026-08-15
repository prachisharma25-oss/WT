<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.text.DecimalFormat" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bill Summary — ElectriBill</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <%
        /* ── Retrieve form parameters ── */
        String customerName = request.getParameter("customerName");
        String meterId      = request.getParameter("meterId");
        String monthParam   = request.getParameter("month");

        double prevReading = 0, currReading = 0;
        boolean hasError   = false;
        String errorMsg    = "";

        try {
            prevReading = Double.parseDouble(request.getParameter("prevReading"));
            currReading = Double.parseDouble(request.getParameter("currReading"));
        } catch (NumberFormatException e) {
            hasError = true;
            errorMsg = "Invalid meter readings. Please enter numeric values.";
        }

        double unitsConsumed = currReading - prevReading;

        if (!hasError && unitsConsumed < 0) {
            hasError = true;
            errorMsg = "Current reading cannot be less than previous reading.";
        }

        /* ── Slab-wise calculation ── */
        double slab1 = 0, slab2 = 0, slab3 = 0, slab4 = 0, totalAmount = 0;

        if (!hasError) {
            if (unitsConsumed <= 50) {
                slab1 = unitsConsumed * 3.50;
            } else if (unitsConsumed <= 150) {
                slab1 = 50 * 3.50;
                slab2 = (unitsConsumed - 50) * 4.00;
            } else if (unitsConsumed <= 250) {
                slab1 = 50  * 3.50;
                slab2 = 100 * 4.00;
                slab3 = (unitsConsumed - 150) * 5.20;
            } else {
                slab1 = 50  * 3.50;
                slab2 = 100 * 4.00;
                slab3 = 100 * 5.20;
                slab4 = (unitsConsumed - 250) * 6.50;
            }
            totalAmount = slab1 + slab2 + slab3 + slab4;
        }

        DecimalFormat df = new DecimalFormat("0.00");

        /* ── Determine consumption tier label ── */
        String tier = "";
        if (!hasError) {
            if      (unitsConsumed <= 50)  tier = "Low";
            else if (unitsConsumed <= 150) tier = "Moderate";
            else if (unitsConsumed <= 250) tier = "High";
            else                           tier = "Very High";
        }
    %>

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

        <main class="main-content">
            <div class="container">

                <% if (hasError) { %>
                <!-- Error State -->
                <div class="error-card">
                    <div class="error-icon">⚠️</div>
                    <h2>Calculation Error</h2>
                    <p><%= errorMsg %></p>
                    <a href="index.jsp" class="btn-back">← Go Back & Retry</a>
                </div>

                <% } else { %>

                <!-- Bill Header -->
                <div class="bill-container">
                    <div class="bill-header">
                        <div class="bill-title">
                            <span class="bill-icon">📄</span>
                            <div>
                                <h2>Electricity Bill</h2>
                                <span class="bill-month"><%= monthParam %> 2026</span>
                            </div>
                        </div>
                        <div class="tier-badge tier-<%= tier.toLowerCase().replace(" ", "-") %>">
                            <%= tier %> Usage
                        </div>
                    </div>

                    <!-- Customer Info -->
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Customer Name</span>
                            <span class="info-value"><%= customerName %></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Meter / Account ID</span>
                            <span class="info-value"><%= meterId %></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Previous Reading</span>
                            <span class="info-value"><%= df.format(prevReading) %> units</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Current Reading</span>
                            <span class="info-value"><%= df.format(currReading) %> units</span>
                        </div>
                        <div class="info-item highlight-info">
                            <span class="info-label">Units Consumed</span>
                            <span class="info-value units-consumed"><%= df.format(unitsConsumed) %> units</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Billing Month</span>
                            <span class="info-value"><%= monthParam %></span>
                        </div>
                    </div>

                    <!-- Slab Breakdown -->
                    <div class="breakdown-section">
                        <h3 class="breakdown-title">Slab-wise Breakdown</h3>
                        <table class="breakdown-table">
                            <thead>
                                <tr>
                                    <th>Slab</th>
                                    <th>Units</th>
                                    <th>Rate (₹/unit)</th>
                                    <th>Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Slab 1: Always shown -->
                                <tr class="<%= unitsConsumed <= 50 ? "active-slab" : "" %>">
                                    <td>First 50 units</td>
                                    <td><%= unitsConsumed <= 50 ? df.format(unitsConsumed) : "50.00" %></td>
                                    <td>3.50</td>
                                    <td>₹ <%= df.format(slab1) %></td>
                                </tr>

                                <!-- Slab 2 -->
                                <% if (unitsConsumed > 50) { %>
                                <tr class="<%= (unitsConsumed > 50 && unitsConsumed <= 150) ? "active-slab" : "" %>">
                                    <td>Next 100 units (51–150)</td>
                                    <td><%= unitsConsumed <= 150 ? df.format(unitsConsumed - 50) : "100.00" %></td>
                                    <td>4.00</td>
                                    <td>₹ <%= df.format(slab2) %></td>
                                </tr>
                                <% } %>

                                <!-- Slab 3 -->
                                <% if (unitsConsumed > 150) { %>
                                <tr class="<%= (unitsConsumed > 150 && unitsConsumed <= 250) ? "active-slab" : "" %>">
                                    <td>Next 100 units (151–250)</td>
                                    <td><%= unitsConsumed <= 250 ? df.format(unitsConsumed - 150) : "100.00" %></td>
                                    <td>5.20</td>
                                    <td>₹ <%= df.format(slab3) %></td>
                                </tr>
                                <% } %>

                                <!-- Slab 4 -->
                                <% if (unitsConsumed > 250) { %>
                                <tr class="active-slab">
                                    <td>Above 250 units</td>
                                    <td><%= df.format(unitsConsumed - 250) %></td>
                                    <td>6.50</td>
                                    <td>₹ <%= df.format(slab4) %></td>
                                </tr>
                                <% } %>
                            </tbody>
                            <tfoot>
                                <tr class="total-row">
                                    <td colspan="3">Total Amount</td>
                                    <td>₹ <%= df.format(totalAmount) %></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <!-- Total Amount Card -->
                    <div class="total-card">
                        <div class="total-label">Total Amount Payable</div>
                        <div class="total-amount">₹ <%= df.format(totalAmount) %></div>
                        <div class="total-note">Inclusive of all applicable charges</div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <a href="index.jsp" class="btn-back">← Calculate Again</a>
                        <button onclick="window.print()" class="btn-print">🖨 Print Bill</button>
                    </div>
                </div>

                <% } %>
            </div>
        </main>

        <footer class="footer">
            <p>© 2026 ElectriBill — Electricity Bill Calculator &nbsp;|&nbsp; Built with JSP</p>
        </footer>
    </div>

    <script src="js/script.js"></script>
</body>
</html>
