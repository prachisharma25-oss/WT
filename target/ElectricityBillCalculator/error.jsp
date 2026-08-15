<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%-- error.jsp : Generic Error Page --%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error – ElectroBill</title>
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<nav class="navbar navbar-dark bg-primary shadow-sm">
    <div class="container">
        <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="index.jsp">
            <i class="bi bi-lightning-charge-fill text-warning fs-4"></i>
            <span>ElectroBill</span>
        </a>
    </div>
</nav>

<div class="container py-5 text-center">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <i class="bi bi-exclamation-triangle-fill text-danger display-1 mb-3"></i>
            <h2 class="fw-bold mb-3">
                <%
                    Integer statusCode = (Integer) request.getAttribute("jakarta.servlet.error.status_code");
                    if (statusCode != null && statusCode == 404) {
                        out.print("Page Not Found");
                    } else {
                        out.print("Something Went Wrong");
                    }
                %>
            </h2>
            <p class="text-muted mb-4">
                We encountered an unexpected problem. Please try again or return to the calculator.
            </p>
            <a href="index.jsp" class="btn btn-primary px-5">
                <i class="bi bi-house-fill me-2"></i>Return to Calculator
            </a>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
