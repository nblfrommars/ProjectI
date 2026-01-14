package com.example.demo.controller;

import com.example.demo.dto.DailyStatsResponse;
import com.example.demo.dto.ProductSalesDTO;
import com.example.demo.service.StatisticsService;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/today")
    public ResponseEntity<DailyStatsResponse> getDailyStats() {
        return ResponseEntity.ok(statisticsService.getDailyStats());
    }

    @GetMapping("/range-summary")
    public ResponseEntity<DailyStatsResponse> getRangeSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(statisticsService.getStatsByRange(startDate, endDate));
    }

     @GetMapping("/product-report")
    public ResponseEntity<List<ProductSalesDTO>> getProductReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(statisticsService.getProductSalesStats(startDate, endDate));
    }
}