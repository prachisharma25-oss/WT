package com.cricket.repository;

import com.cricket.model.Player;
import com.cricket.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByTeam(Team team);
    List<Player> findByTeamId(Long teamId);
    List<Player> findByRole(Player.PlayerRole role);
}
