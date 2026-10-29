package com.cricket.service;

import com.cricket.model.Player;
import com.cricket.model.Team;
import com.cricket.repository.PlayerRepository;
import com.cricket.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TeamService {

    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;

    public TeamService(TeamRepository teamRepository, PlayerRepository playerRepository) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + id));
    }

    public Team createTeam(Team team) {
        if (teamRepository.existsByName(team.getName())) {
            throw new RuntimeException("Team already exists: " + team.getName());
        }
        return teamRepository.save(team);
    }

    public Team updateTeam(Long id, Team updatedTeam) {
        Team existing = getTeamById(id);
        existing.setName(updatedTeam.getName());
        existing.setShortName(updatedTeam.getShortName());
        existing.setCountry(updatedTeam.getCountry());
        return teamRepository.save(existing);
    }

    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }

    public List<Player> getPlayersByTeam(Long teamId) {
        return playerRepository.findByTeamId(teamId);
    }

    public Player addPlayerToTeam(Long teamId, Player player) {
        Team team = getTeamById(teamId);
        player.setTeam(team);
        return playerRepository.save(player);
    }
}
