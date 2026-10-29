package com.cricket.service;

import com.cricket.model.LiveScore;
import com.cricket.model.Match;
import com.cricket.repository.MatchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LiveScoreService {

    private static final Logger log = LoggerFactory.getLogger(LiveScoreService.class);

    private final MatchRepository matchRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private final Map<Long, LiveScore> liveScores = new ConcurrentHashMap<>();
    private final Map<Long, SimulationState> simulationStates = new ConcurrentHashMap<>();

    private static final String[] BATSMEN_NAMES = {
        "R. Sharma", "S. Dhawan", "V. Kohli", "S. Iyer", "H. Pandya",
        "K.L. Rahul", "R. Jadeja", "B. Kumar", "J. Bumrah", "K. Yadav"
    };
    private static final String[] BOWLER_NAMES = {
        "J. Bumrah", "M. Shami", "B. Kumar", "K. Yadav", "R. Ashwin",
        "R. Jadeja", "H. Pandya", "S. Tiwary", "U. Yadav", "D. Chahar"
    };

    public LiveScoreService(MatchRepository matchRepository, SimpMessagingTemplate messagingTemplate) {
        this.matchRepository = matchRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public LiveScore getLiveScore(Long matchId) {
        return liveScores.get(matchId);
    }

    public Map<Long, LiveScore> getAllLiveScores() {
        return Collections.unmodifiableMap(liveScores);
    }

    public void initializeLiveScore(Match match) {
        LiveScore ls = new LiveScore();
        ls.setMatchId(match.getId());
        ls.setMatchTitle(match.getTitle());
        ls.setBattingTeam(match.getBattingTeam());
        ls.setBowlingTeam(match.getBowlingTeam());
        ls.setRuns(match.getInnings1Runs());
        ls.setWickets(match.getInnings1Wickets());
        ls.setOvers(0.0);
        ls.setCurrentInnings(1);
        ls.setMatchStatus("LIVE");
        ls.setStriker(BATSMEN_NAMES[0]);
        ls.setNonStriker(BATSMEN_NAMES[1]);
        ls.setCurrentBowler(BOWLER_NAMES[0]);
        ls.setRecentBalls("");
        ls.setLastUpdated(LocalDateTime.now());

        liveScores.put(match.getId(), ls);
        simulationStates.put(match.getId(), new SimulationState(match));
        log.info("Initialized live score for match: {}", match.getId());
    }

    public void removeLiveScore(Long matchId) {
        liveScores.remove(matchId);
        simulationStates.remove(matchId);
    }

    @Scheduled(fixedDelay = 4000)
    public void simulateLiveScores() {
        List<Match> liveMatches = matchRepository.findByStatus(Match.MatchStatus.LIVE);

        for (Match match : liveMatches) {
            try {
                LiveScore score = liveScores.computeIfAbsent(match.getId(), id -> {
                    LiveScore ls = new LiveScore();
                    ls.setMatchId(id);
                    ls.setMatchTitle(match.getTitle());
                    ls.setBattingTeam(match.getBattingTeam());
                    ls.setBowlingTeam(match.getBowlingTeam());
                    ls.setMatchStatus("LIVE");
                    ls.setStriker(BATSMEN_NAMES[0]);
                    ls.setNonStriker(BATSMEN_NAMES[1]);
                    ls.setCurrentBowler(BOWLER_NAMES[0]);
                    ls.setRecentBalls("");
                    return ls;
                });

                SimulationState state = simulationStates.computeIfAbsent(
                        match.getId(), id -> new SimulationState(match));

                simulateBall(score, state, match);
                score.setLastUpdated(LocalDateTime.now());

                messagingTemplate.convertAndSend("/topic/scores/" + match.getId(), score);
                messagingTemplate.convertAndSend("/topic/scores/live", score);

            } catch (Exception e) {
                log.error("Error simulating score for match {}: {}", match.getId(), e.getMessage());
            }
        }
    }

    private void simulateBall(LiveScore score, SimulationState state, Match match) {
        Random rand = new Random();
        int maxOvers = match.getMaxOvers();

        if (score.getWickets() >= 10 || state.ballsInCurrentInnings >= maxOvers * 6) {
            if (score.getCurrentInnings() == 1) {
                score.setFirstInningsScore(score.getRuns() + "/" + score.getWickets()
                        + " (" + formatOvers(state.ballsInCurrentInnings) + " ov)");
                int target = score.getRuns() + 1;
                score.setCurrentInnings(2);
                score.setRuns(0);
                score.setWickets(0);
                score.setOvers(0.0);
                score.setTargetRuns(target);

                String prevBatting = score.getBattingTeam();
                score.setBattingTeam(score.getBowlingTeam());
                score.setBowlingTeam(prevBatting);

                state.ballsInCurrentInnings = 0;
                state.ballsInCurrentOver = 0;
                state.strikerIndex = 0;
                state.nonStrikerIndex = 1;
                state.bowlerIndex = 0;
                state.strikerRuns = 0;
                state.strikerBalls = 0;
                state.nonStrikerRuns = 0;
                state.nonStrikerBalls = 0;
                score.setStriker(BATSMEN_NAMES[state.strikerIndex]);
                score.setNonStriker(BATSMEN_NAMES[state.nonStrikerIndex]);
                score.setStrikerRuns(0);
                score.setStrikerBalls(0);
                score.setNonStrikerRuns(0);
                score.setNonStrikerBalls(0);
            } else {
                score.setMatchStatus("COMPLETED");
            }
            return;
        }

        // Wide
        if (rand.nextInt(20) == 0) {
            score.setRuns(score.getRuns() + 1);
            score.setRunsInCurrentOver(score.getRunsInCurrentOver() + 1);
            appendBall(score, "Wd");
            return;
        }

        // No ball
        if (rand.nextInt(25) == 0) {
            int extraRuns = rand.nextInt(4);
            score.setRuns(score.getRuns() + 1 + extraRuns);
            score.setRunsInCurrentOver(score.getRunsInCurrentOver() + 1 + extraRuns);
            appendBall(score, "Nb+" + extraRuns);
            return;
        }

        // Legal delivery
        state.ballsInCurrentInnings++;
        state.ballsInCurrentOver++;

        int outcome = simulateDelivery(rand, score.getWickets());

        if (outcome == -1) {
            // Wicket
            score.setWickets(score.getWickets() + 1);
            score.setLastWicket(score.getStriker() + " " + state.strikerRuns
                    + "(" + state.strikerBalls + ")");
            appendBall(score, "W");

            state.strikerIndex = Math.min(state.strikerIndex + 2, BATSMEN_NAMES.length - 1);
            state.strikerRuns = 0;
            state.strikerBalls = 0;
            score.setStriker(BATSMEN_NAMES[state.strikerIndex]);
            score.setStrikerRuns(0);
            score.setStrikerBalls(0);
        } else {
            score.setRuns(score.getRuns() + outcome);
            score.setRunsInCurrentOver(score.getRunsInCurrentOver() + outcome);
            state.strikerRuns += outcome;
            state.strikerBalls++;
            state.nonStrikerBalls++;
            score.setStrikerRuns(state.strikerRuns);
            score.setStrikerBalls(state.strikerBalls);
            score.setNonStrikerRuns(state.nonStrikerRuns);
            score.setNonStrikerBalls(state.nonStrikerBalls);
            appendBall(score, String.valueOf(outcome));

            // Rotate strike on odd runs
            if (outcome % 2 != 0) {
                int tmpR = state.strikerRuns;
                int tmpB = state.strikerBalls;
                int tmpIdx = state.strikerIndex;
                state.strikerRuns = state.nonStrikerRuns;
                state.strikerBalls = state.nonStrikerBalls;
                state.strikerIndex = state.nonStrikerIndex;
                state.nonStrikerRuns = tmpR;
                state.nonStrikerBalls = tmpB;
                state.nonStrikerIndex = tmpIdx;
                score.setStriker(BATSMEN_NAMES[state.strikerIndex]);
                score.setNonStriker(BATSMEN_NAMES[state.nonStrikerIndex]);
                score.setStrikerRuns(state.strikerRuns);
                score.setStrikerBalls(state.strikerBalls);
                score.setNonStrikerRuns(state.nonStrikerRuns);
                score.setNonStrikerBalls(state.nonStrikerBalls);
            }
        }

        // End of over
        if (state.ballsInCurrentOver == 6) {
            state.ballsInCurrentOver = 0;
            state.bowlerIndex = (state.bowlerIndex + 1) % BOWLER_NAMES.length;
            score.setCurrentBowler(BOWLER_NAMES[state.bowlerIndex]);
            score.setBowlerOvers(score.getBowlerOvers() + 1);
            score.setBowlerRuns(0);
            score.setBowlerWickets(0);
            score.setRunsInCurrentOver(0);
            // Rotate strike end of over
            int tmpR = state.strikerRuns;
            int tmpB = state.strikerBalls;
            int tmpIdx = state.strikerIndex;
            state.strikerRuns = state.nonStrikerRuns;
            state.strikerBalls = state.nonStrikerBalls;
            state.strikerIndex = state.nonStrikerIndex;
            state.nonStrikerRuns = tmpR;
            state.nonStrikerBalls = tmpB;
            state.nonStrikerIndex = tmpIdx;
            score.setStriker(BATSMEN_NAMES[state.strikerIndex]);
            score.setNonStriker(BATSMEN_NAMES[state.nonStrikerIndex]);
            score.setStrikerRuns(state.strikerRuns);
            score.setStrikerBalls(state.strikerBalls);
            score.setNonStrikerRuns(state.nonStrikerRuns);
            score.setNonStrikerBalls(state.nonStrikerBalls);
        }

        score.setOvers(formatOvers(state.ballsInCurrentInnings));

        double totalOvers = state.ballsInCurrentInnings / 6.0;
        if (totalOvers > 0) {
            score.setCurrentRunRate(String.format("%.2f", score.getRuns() / totalOvers));
        }

        if (score.getCurrentInnings() == 2 && score.getTargetRuns() > 0) {
            int ballsLeft = (maxOvers * 6) - state.ballsInCurrentInnings;
            int runsNeeded = score.getTargetRuns() - score.getRuns();
            score.setRunsRequired(Math.max(0, runsNeeded));
            score.setBallsRemaining(Math.max(0, ballsLeft));
            if (ballsLeft > 0 && runsNeeded > 0) {
                double rrr = runsNeeded / (ballsLeft / 6.0);
                score.setRequiredRunRate(String.format("%.2f", rrr));
            } else {
                score.setRequiredRunRate("0.00");
            }
        }
    }

    private int simulateDelivery(Random rand, int wickets) {
        int r = rand.nextInt(100);
        if (wickets < 5) {
            if (r < 35) return 0;
            if (r < 60) return 1;
            if (r < 72) return 2;
            if (r < 77) return 3;
            if (r < 87) return 4;
            if (r < 89) return 5;
            if (r < 96) return 6;
            return -1;
        } else {
            if (r < 40) return 0;
            if (r < 65) return 1;
            if (r < 75) return 2;
            if (r < 78) return 3;
            if (r < 86) return 4;
            if (r < 88) return 5;
            if (r < 93) return 6;
            return -1;
        }
    }

    private void appendBall(LiveScore score, String ball) {
        String recent = score.getRecentBalls();
        if (recent == null) recent = "";
        String[] balls = recent.isEmpty() ? new String[0] : recent.split(" ");
        List<String> list = new ArrayList<>(Arrays.asList(balls));
        list.add(ball);
        if (list.size() > 12) list = list.subList(list.size() - 12, list.size());
        score.setRecentBalls(String.join(" ", list));
    }

    private double formatOvers(int totalBalls) {
        int completedOvers = totalBalls / 6;
        int ballsInOver = totalBalls % 6;
        return Double.parseDouble(completedOvers + "." + ballsInOver);
    }

    private static class SimulationState {
        int ballsInCurrentInnings = 0;
        int ballsInCurrentOver = 0;
        int strikerIndex = 0;
        int nonStrikerIndex = 1;
        int bowlerIndex = 0;
        int strikerRuns = 0;
        int strikerBalls = 0;
        int nonStrikerRuns = 0;
        int nonStrikerBalls = 0;

        SimulationState(Match match) {
            double overs = match.getInnings1Overs();
            int completedOvers = (int) overs;
            int balls = (int) Math.round((overs - completedOvers) * 10);
            this.ballsInCurrentInnings = completedOvers * 6 + balls;
        }
    }
}
