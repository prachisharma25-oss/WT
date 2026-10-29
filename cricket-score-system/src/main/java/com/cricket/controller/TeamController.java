package com.cricket.controller;

import com.cricket.dto.ApiResponse;
import com.cricket.model.Player;
import com.cricket.model.Team;
import com.cricket.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Team>>> getAllTeams() {
        return ResponseEntity.ok(ApiResponse.success(teamService.getAllTeams()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Team>> getTeam(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getTeamById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Team>> createTeam(@Valid @RequestBody Team team) {
        return ResponseEntity.ok(ApiResponse.success("Team created", teamService.createTeam(team)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Team>> updateTeam(
            @PathVariable Long id, @RequestBody Team team) {
        return ResponseEntity.ok(ApiResponse.success(teamService.updateTeam(id, team)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.ok(ApiResponse.success("Team deleted", null));
    }

    @GetMapping("/{id}/players")
    public ResponseEntity<ApiResponse<List<Player>>> getPlayersByTeam(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getPlayersByTeam(id)));
    }

    @PostMapping("/{id}/players")
    public ResponseEntity<ApiResponse<Player>> addPlayer(
            @PathVariable Long id, @RequestBody Player player) {
        return ResponseEntity.ok(ApiResponse.success("Player added",
                teamService.addPlayerToTeam(id, player)));
    }
}
