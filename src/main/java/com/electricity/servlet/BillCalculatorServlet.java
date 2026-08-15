package com.electricity.servlet;

import com.electricity.model.Bill;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Servlet that handles the electricity bill calculation.
 *
 * <p>Accepts a POST from index.jsp, validates all inputs, builds a
 * {@link Bill} object, stores it as a request attribute, then
 * forwards to result.jsp.
 *
 * URL mapping: /calculateBill (also declared in web.xml for IDE tooling)
 */
@WebServlet(name = "BillCalculatorServlet", urlPatterns = "/calculateBill")
public class BillCalculatorServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    // ── GET ── redirect to the form ───────────────────────────────────────────
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.sendRedirect(request.getContextPath() + "/index.jsp");
    }

    // ── POST ── process the form ───────────────────────────────────────────────
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");

        // ── 1. Read form parameters ───────────────────────────────────────────
        String customerName  = sanitise(request.getParameter("customerName"));
        String customerId    = sanitise(request.getParameter("customerId"));
        String address       = sanitise(request.getParameter("address"));
        String meterNumber   = sanitise(request.getParameter("meterNumber"));
        String month         = sanitise(request.getParameter("month"));
        String prevReadingStr = sanitise(request.getParameter("previousReading"));
        String currReadingStr = sanitise(request.getParameter("currentReading"));

        // ── 2. Server-side validation ─────────────────────────────────────────
        StringBuilder errors = new StringBuilder();

        if (customerName.isEmpty())  errors.append("Customer name is required. ");
        if (customerId.isEmpty())    errors.append("Customer ID is required. ");
        if (address.isEmpty())       errors.append("Address is required. ");
        if (meterNumber.isEmpty())   errors.append("Meter number is required. ");
        if (month.isEmpty())         errors.append("Billing month is required. ");

        int previousReading = 0, currentReading = 0;

        try {
            previousReading = Integer.parseInt(prevReadingStr);
            if (previousReading < 0) errors.append("Previous reading cannot be negative. ");
        } catch (NumberFormatException e) {
            errors.append("Previous reading must be a valid number. ");
        }

        try {
            currentReading = Integer.parseInt(currReadingStr);
            if (currentReading < 0) errors.append("Current reading cannot be negative. ");
        } catch (NumberFormatException e) {
            errors.append("Current reading must be a valid number. ");
        }

        if (errors.length() == 0 && currentReading < previousReading) {
            errors.append("Current reading must be greater than or equal to previous reading. ");
        }

        // ── 3. Return to form with errors, or forward to result ───────────────
        if (errors.length() > 0) {
            request.setAttribute("errorMessage", errors.toString().trim());
            // Preserve user inputs
            request.setAttribute("customerName",   customerName);
            request.setAttribute("customerId",     customerId);
            request.setAttribute("address",        address);
            request.setAttribute("meterNumber",    meterNumber);
            request.setAttribute("month",          month);
            request.setAttribute("previousReading", prevReadingStr);
            request.setAttribute("currentReading",  currReadingStr);

            RequestDispatcher dispatcher = request.getRequestDispatcher("/index.jsp");
            dispatcher.forward(request, response);
            return;
        }

        // ── 4. Build the Bill model (calculation happens in constructor) ───────
        Bill bill = new Bill(customerName, customerId, address,
                             meterNumber, month,
                             previousReading, currentReading);

        request.setAttribute("bill", bill);

        // ── 5. Forward to result JSP ──────────────────────────────────────────
        RequestDispatcher dispatcher = request.getRequestDispatcher("/result.jsp");
        dispatcher.forward(request, response);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    /** Null-safe trim of a request parameter. */
    private String sanitise(String value) {
        return (value == null) ? "" : value.trim();
    }
}
