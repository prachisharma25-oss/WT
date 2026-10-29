package com.cricket.repository;

import com.cricket.model.Scorecard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScorecardRepository extends JpaRepository<Scorecard, Long> {

    List<Scorecard> findByMatchId(Long matchId);

    List<Scorecard> findByMatchIdAndInningsNumber(Long matchId, int inningsNumber);

    List<Scorecard> findByMatchIdAndTeamName(Long matchId, String teamName);

    @Query("SELECT s FROM Scorecard s WHERE s.match.id = :matchId AND s.inningsNumber = :innings AND s.oversBowled > 0")
    List<Scorecard> findBowlingCardByMatchAndInnings(Long matchId, int innings);

    @Query("SELECT s FROM Scorecard s WHERE s.player.id = :playerId ORDER BY s.id DESC")
    List<Scorecard> findByPlayerId(Long playerId);
}
