<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electricity Bill Receipt</title>
    <style>
        /* Base Reset & Styling */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7f6;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            /* FIXED: Prevents card from sticking to screen boundaries on small devices */
            padding: 20px; 
            box-sizing: border-box;
        }

        /* Invoice Container Card */
        .invoice-card {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            width: 100%;
            /* FIXED: Changed width to max-width to allow fluid scaling down */
            max-width: 450px;
            padding: 30px;
            box-sizing: border-box;
        }

        /* Header Accent Banner */
        .invoice-header {
            text-align: center;
            border-bottom: 2px dashed #e0e0e0;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }

        .invoice-header h2 {
            margin: 0;
            color: #2c3e50;
            font-size: 24px;
            letter-spacing: 0.5px;
        }

        /* Status Alerts (Success/Error) */
        .alert {
            padding: 10px 15px;
            border-radius: 6px;
            font-size: 14px;
            margin-bottom: 15px;
            display: block;
            text-align: center;
            font-weight: 500;
        }
        .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .alert-danger {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        /* Information Details Grid */
        .invoice-details {
            margin-bottom: 25px;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f1f1f1;
            /* FIXED: Allows content to drop to the next line smoothly if text is very long */
            gap: 10px; 
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .label {
            color: #7f8c8d;
            font-weight: 500;
            white-space: nowrap;
        }

        .value {
            color: #2c3e50;
            font-weight: 600;
            text-align: right;
            word-break: break-word;
        }

        /* Total Highlight Section */
        .total-section {
            background-color: #eef2f7;
            border-radius: 8px;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            gap: 10px;
        }

        .total-label {
            font-size: 18px;
            font-weight: bold;
            color: #34495e;
        }

        .total-amount {
            font-size: 22px;
            font-weight: 800;
            color: #2e7d32;
            text-align: right;
        }

        /* NEW: Responsive adjustments for small phones (< 400px wide) */
        @media (max-width: 400px) {
            body {
                padding: 10px;
            }
            .invoice-card {
                padding: 20px;
            }
            .invoice-header h2 {
                font-size: 20px;
            }
            .total-label {
                font-size: 16px;
            }
            .total-amount {
                font-size: 19px;
            }
        }

        /* NEW: Print Stylesheet - Hides database notification blocks if printed */
        @media print {
            body {
                background: #fff;
            }
            .invoice-card {
                box-shadow: none;
                padding: 0;
            }
            .alert {
                display: none !important;
            }
        }
    </style>
</head>
<body>

<div class="invoice-card">
    <div class="invoice-header">
        <h2>Electricity Bill</h2>
    </div>

    <?php
    // Get form data safely
    $name = isset($_POST['name']) ? $_POST['name'] : 'N/A';
    $units = isset($_POST['units']) ? floatval($_POST['units']) : 0;
    $month = isset($_POST['month']) ? $_POST['month'] : 'N/A';

    $server = "localhost";
    $username = "root";
    $password = "";
    $database = "electricity_db";

    // Establish connection
    $conn = mysqli_connect($server, $username, $password, $database);

    if (!$conn) {
        echo "<div class='alert alert-danger'>Connection failed: " . mysqli_connect_error() . "</div>";
        exit();
    }

    // Calculate bill structure
    $bill = 0;
    if ($units <= 100) {
        $bill = $units * 5;
    }
    elseif ($units <= 300) {
        $bill = (100 * 5) + (($units - 100) * 7);
    }
    else {
        $bill = (100 * 5) + (200 * 7) + (($units - 300) * 10);
    }

    // Database Insert
    $sql = "INSERT INTO cust(customer_name, units, total_bill, months)
            VALUES ('$name', '$units', '$bill', '$month')";

    if (mysqli_query($conn, $sql)) {
        echo "<div class='alert alert-success'>Bill saved successfully!</div>";
    } else {
        echo "<div class='alert alert-danger'>Database Error: " . mysqli_error($conn) . "</div>";
    }

    mysqli_close($conn);
    ?>

    <!-- Visual Output UI -->
    <div class="invoice-details">
        <div class="detail-row">
            <span class="label">Customer Name</span>
            <span class="value"><?php echo htmlspecialchars($name); ?></span>
        </div>
        <div class="detail-row">
            <span class="label">Billing Month</span>
            <span class="value"><?php echo htmlspecialchars($month); ?></span>
        </div>
        <div class="detail-row">
            <span class="label">Units Consumed</span>
            <span class="value"><?php echo number_format($units); ?> kWh</span>
        </div>
    </div>

    <div class="total-section">
        <span class="total-label">Total Bill</span>
        <span class="total-amount">₹<?php echo number_format($bill, 2); ?></span>
    </div>
</div>

</body>
</html>