package com.electribill;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet that receives form data from index.jsp
 * and forwards to result.jsp for display.
 * All actual calculation logic lives in result.jsp
 * so it remains portable and easy to follow.
 */
@WebServlet("/calculate")
public class CalculateServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Basic server-side presence check
        String prevStr = request.getParameter("prevReading");
        String currStr = request.getParameter("currReading");

        if (prevStr == null || currStr == null ||
                prevStr.isBlank() || currStr.isBlank()) {
            response.sendRedirect(request.getContextPath() + "/index.jsp");
            return;
        }

        // Forward all parameters to result.jsp for rendering
        request.getRequestDispatcher("/result.jsp").forward(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // GET on /calculate → redirect home
        response.sendRedirect(request.getContextPath() + "/index.jsp");
    }
}
