package com.cricket.controller;

import com.cricket.dto.ApiResponse;
import com.cricket.model.Player;
import com.cricket.repository.PlayerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "*")
public class PlayerController {

    private final PlayerRepository playerRepository;

    public PlayerController(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Player>>> getAllPlayers() {
        return ResponseEntity.ok(ApiResponse.success(playerRepository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Player>> getPlayer(@PathVariable Long id) {
        return playerRepository.findById(id)
                .map(p -> ResponseEntity.ok(ApiResponse.success(p)))
                .orElse(ResponseEntity.ok(ApiResponse.error("Player not found: " + id)));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<Player>>> getPlayersByRole(
            @PathVariable Player.PlayerRole role) {
        return ResponseEntity.ok(ApiResponse.success(playerRepository.findByRole(role)));
    }
}
