package com.cricket.controller;

import com.cricket.dto.ApiResponse;
import com.cricket.dto.CreateMatchRequest;
import com.cricket.dto.MatchDTO;
import com.cricket.model.Match;
import com.cricket.service.LiveScoreService;
import com.cricket.service.MatchService;
import com.cricket.service.ScorecardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    private final MatchService matchService;
    private final LiveScoreService liveScoreService;
    private final ScorecardService scorecardService;

    public MatchController(MatchService matchService, LiveScoreService liveScoreService,
                           ScorecardService scorecardService) {
        this.matchService = matchService;
        this.liveScoreService = liveScoreService;
        this.scorecardService = scorecardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchDTO>>> getAllMatches() {
        return ResponseEntity.ok(ApiResponse.success(matchService.getAllMatches()));
    }

    @GetMapping("/live")
    public ResponseEntity<ApiResponse<List<MatchDTO>>> getLiveMatches() {
        return ResponseEntity.ok(ApiResponse.success(matchService.getLiveMatches()));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<MatchDTO>>> getMatchesByStatus(
            @PathVariable Match.MatchStatus status) {
        return ResponseEntity.ok(ApiResponse.success(matchService.getMatchesByStatus(status)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MatchDTO>> getMatch(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(matchService.getMatchDTOById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MatchDTO>> createMatch(
            @Valid @RequestBody CreateMatchRequest request) {
        Match match = matchService.createMatch(request);
        return ResponseEntity.ok(ApiResponse.success("Match created successfully",
                MatchDTO.fromMatch(match)));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<ApiResponse<MatchDTO>> startMatch(@PathVariable Long id) {
        Match match = matchService.startMatch(id);
        liveScoreService.initializeLiveScore(match);
        return ResponseEntity.ok(ApiResponse.success("Match started!", MatchDTO.fromMatch(match)));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<MatchDTO>> completeMatch(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String result = body.getOrDefault("result", "Match completed");
        String winner = body.getOrDefault("winner", "");
        Match match = matchService.completeMatch(id, result, winner);
        liveScoreService.removeLiveScore(id);
        return ResponseEntity.ok(ApiResponse.success("Match completed!", MatchDTO.fromMatch(match)));
    }

    @GetMapping("/{id}/scorecard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getScorecard(@PathVariable Long id) {
        Match match = matchService.getMatchById(id);
        Map<String, Object> summary = scorecardService.getMatchSummary(id, match);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<ApiResponse<List<MatchDTO>>> getMatchesByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(ApiResponse.success(matchService.getMatchesByTeam(teamId)));
    }
}
