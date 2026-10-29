package com.cricket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CricketScoreApplication {
    public static void main(String[] args) {
        SpringApplication.run(CricketScoreApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("  Cricket Score Management System");
        System.out.println("  Running at: http://localhost:8080");
        System.out.println("  H2 Console : http://localhost:8080/h2-console");
        System.out.println("========================================\n");
    }
}
