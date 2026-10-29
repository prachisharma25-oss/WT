package com.cricket.controller;

import com.cricket.dto.ApiResponse;
import com.cricket.model.LiveScore;
import com.cricket.service.LiveScoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/api/live")
@CrossOrigin(origins = "*")
public class LiveScoreController {

    private final LiveScoreService liveScoreService;

    public LiveScoreController(LiveScoreService liveScoreService) {
        this.liveScoreService = liveScoreService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Collection<LiveScore>>> getAllLiveScores() {
        Map<Long, LiveScore> scores = liveScoreService.getAllLiveScores();
        return ResponseEntity.ok(ApiResponse.success(scores.values()));
    }

    @GetMapping("/{matchId}")
    public ResponseEntity<ApiResponse<LiveScore>> getLiveScore(@PathVariable Long matchId) {
        LiveScore score = liveScoreService.getLiveScore(matchId);
        if (score == null) {
            return ResponseEntity.ok(ApiResponse.error("No live score found for match: " + matchId));
        }
        return ResponseEntity.ok(ApiResponse.success(score));
    }
}
