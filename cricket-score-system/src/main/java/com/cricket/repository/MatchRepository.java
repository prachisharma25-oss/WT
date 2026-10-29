package com.cricket.repository;

import com.cricket.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByStatus(Match.MatchStatus status);

    List<Match> findByStatusOrderByMatchDateDesc(Match.MatchStatus status);

    @Query("SELECT m FROM Match m WHERE m.team1.id = :teamId OR m.team2.id = :teamId ORDER BY m.matchDate DESC")
    List<Match> findByTeamId(Long teamId);

    List<Match> findByFormatAndStatus(Match.MatchFormat format, Match.MatchStatus status);

    @Query("SELECT m FROM Match m ORDER BY m.matchDate DESC")
    List<Match> findAllOrderByDateDesc();
}
