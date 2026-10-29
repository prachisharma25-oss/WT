package com.cricket.service;

import com.cricket.model.Match;
import com.cricket.model.Player;
import com.cricket.model.Scorecard;
import com.cricket.repository.PlayerRepository;
import com.cricket.repository.ScorecardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ScorecardService {

    private final ScorecardRepository scorecardRepository;
    private final PlayerRepository playerRepository;

    public ScorecardService(ScorecardRepository scorecardRepository, PlayerRepository playerRepository) {
        this.scorecardRepository = scorecardRepository;
        this.playerRepository = playerRepository;
    }

    public List<Scorecard> getScorecardByMatch(Long matchId) {
        return scorecardRepository.findByMatchId(matchId);
    }

    public List<Scorecard> getScorecardByMatchAndInnings(Long matchId, int innings) {
        return scorecardRepository.findByMatchIdAndInningsNumber(matchId, innings);
    }

    public Scorecard updateBattingScore(Long matchId, Long playerId, int runs, int balls,
                                        int fours, int sixes, boolean isOut,
                                        String dismissalType, String dismissedBy) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found: " + playerId));

        List<Scorecard> existing = scorecardRepository.findByMatchId(matchId);
        Scorecard scorecard = existing.stream()
                .filter(s -> s.getPlayer().getId().equals(playerId))
                .findFirst()
                .orElse(new Scorecard());

        if (scorecard.getId() == null) {
            scorecard.setPlayer(player);
            scorecard.setTeamName(player.getTeam().getName());
        }
        scorecard.setRunsScored(runs);
        scorecard.setBallsFaced(balls);
        scorecard.setFours(fours);
        scorecard.setSixes(sixes);
        scorecard.setOut(isOut);
        scorecard.setDismissalType(dismissalType);
        scorecard.setDismissedBy(dismissedBy);
        return scorecardRepository.save(scorecard);
    }

    public Scorecard updateBowlingScore(Long matchId, Long playerId, double overs,
                                        int runs, int wickets, int maidens) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found: " + playerId));

        List<Scorecard> existing = scorecardRepository.findByMatchId(matchId);
        Scorecard scorecard = existing.stream()
                .filter(s -> s.getPlayer().getId().equals(playerId))
                .findFirst()
                .orElse(new Scorecard());

        if (scorecard.getId() == null) {
            scorecard.setPlayer(player);
            scorecard.setTeamName(player.getTeam().getName());
        }
        scorecard.setOversBowled(overs);
        scorecard.setRunsConceded(runs);
        scorecard.setWicketsTaken(wickets);
        scorecard.setMaidens(maidens);
        return scorecardRepository.save(scorecard);
    }

    public Map<String, Object> getMatchSummary(Long matchId, Match match) {
        Map<String, Object> summary = new HashMap<>();
        List<Scorecard> innings1 = scorecardRepository.findByMatchIdAndInningsNumber(matchId, 1);
        List<Scorecard> innings2 = scorecardRepository.findByMatchIdAndInningsNumber(matchId, 2);

        summary.put("matchId", matchId);
        summary.put("innings1Batting", innings1.stream().filter(s -> s.getBallsFaced() > 0).toList());
        summary.put("innings1Bowling", innings1.stream().filter(s -> s.getOversBowled() > 0).toList());
        summary.put("innings2Batting", innings2.stream().filter(s -> s.getBallsFaced() > 0).toList());
        summary.put("innings2Bowling", innings2.stream().filter(s -> s.getOversBowled() > 0).toList());
        summary.put("result", match.getResult());
        summary.put("status", match.getStatus());
        return summary;
    }

    public Scorecard save(Scorecard scorecard) {
        return scorecardRepository.save(scorecard);
    }
}
