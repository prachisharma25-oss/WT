package com.cricket.service;

import com.cricket.dto.CreateMatchRequest;
import com.cricket.dto.MatchDTO;
import com.cricket.model.Match;
import com.cricket.model.Team;
import com.cricket.repository.MatchRepository;
import com.cricket.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MatchService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;

    public MatchService(MatchRepository matchRepository, TeamRepository teamRepository) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
    }

    public List<MatchDTO> getAllMatches() {
        return matchRepository.findAllOrderByDateDesc()
                .stream().map(MatchDTO::fromMatch).collect(Collectors.toList());
    }

    public List<MatchDTO> getLiveMatches() {
        return matchRepository.findByStatus(Match.MatchStatus.LIVE)
                .stream().map(MatchDTO::fromMatch).collect(Collectors.toList());
    }

    public List<MatchDTO> getMatchesByStatus(Match.MatchStatus status) {
        return matchRepository.findByStatusOrderByMatchDateDesc(status)
                .stream().map(MatchDTO::fromMatch).collect(Collectors.toList());
    }

    public Match getMatchById(Long id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found with id: " + id));
    }

    public MatchDTO getMatchDTOById(Long id) {
        return MatchDTO.fromMatch(getMatchById(id));
    }

    public Match createMatch(CreateMatchRequest req) {
        Team team1 = teamRepository.findById(req.getTeam1Id())
                .orElseThrow(() -> new RuntimeException("Team 1 not found"));
        Team team2 = teamRepository.findById(req.getTeam2Id())
                .orElseThrow(() -> new RuntimeException("Team 2 not found"));

        Match match = new Match();
        match.setTitle(req.getTitle());
        match.setTeam1(team1);
        match.setTeam2(team2);
        match.setFormat(req.getFormat());
        match.setStatus(Match.MatchStatus.UPCOMING);
        match.setVenue(req.getVenue());
        match.setMatchDate(req.getMatchDate() != null ? req.getMatchDate() : LocalDateTime.now());
        match.setTossWinner(req.getTossWinner());
        match.setTossDecision(req.getTossDecision());
        match.setCurrentInnings(1);

        if (req.getBattingTeam() != null && !req.getBattingTeam().isEmpty()) {
            match.setBattingTeam(req.getBattingTeam());
            match.setBowlingTeam(req.getBattingTeam().equals(team1.getName())
                    ? team2.getName() : team1.getName());
        } else {
            match.setBattingTeam(team1.getName());
            match.setBowlingTeam(team2.getName());
        }

        return matchRepository.save(match);
    }

    public Match startMatch(Long matchId) {
        Match match = getMatchById(matchId);
        match.setStatus(Match.MatchStatus.LIVE);
        match.setMatchDate(LocalDateTime.now());
        return matchRepository.save(match);
    }

    public Match updateScore(Long matchId, int runs, int wickets, double overs, int innings) {
        Match match = getMatchById(matchId);
        if (innings == 1) {
            match.setInnings1Runs(match.getInnings1Runs() + runs);
            match.setInnings1Wickets(match.getInnings1Wickets() + wickets);
            match.setInnings1Overs(overs);
        } else {
            match.setInnings2Runs(match.getInnings2Runs() + runs);
            match.setInnings2Wickets(match.getInnings2Wickets() + wickets);
            match.setInnings2Overs(overs);
        }
        return matchRepository.save(match);
    }

    public Match switchInnings(Long matchId) {
        Match match = getMatchById(matchId);
        match.setCurrentInnings(2);
        String prevBatting = match.getBattingTeam();
        match.setBattingTeam(match.getBowlingTeam());
        match.setBowlingTeam(prevBatting);
        return matchRepository.save(match);
    }

    public Match completeMatch(Long matchId, String result, String winner) {
        Match match = getMatchById(matchId);
        match.setStatus(Match.MatchStatus.COMPLETED);
        match.setResult(result);
        match.setWinnerTeam(winner);
        return matchRepository.save(match);
    }

    public List<MatchDTO> getMatchesByTeam(Long teamId) {
        return matchRepository.findByTeamId(teamId)
                .stream().map(MatchDTO::fromMatch).collect(Collectors.toList());
    }

    public Match saveMatch(Match match) {
        return matchRepository.save(match);
    }
}
