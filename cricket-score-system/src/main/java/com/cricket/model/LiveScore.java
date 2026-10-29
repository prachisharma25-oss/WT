package com.cricket.model;

import java.time.LocalDateTime;

public class LiveScore {

    private Long matchId;
    private String matchTitle;
    private String battingTeam;
    private String bowlingTeam;
    private int runs;
    private int wickets;
    private double overs;
    private int currentInnings;

    private String currentOverSummary;
    private int runsInCurrentOver;

    private String striker;
    private int strikerRuns;
    private int strikerBalls;

    private String nonStriker;
    private int nonStrikerRuns;
    private int nonStrikerBalls;

    private String currentBowler;
    private double bowlerOvers;
    private int bowlerRuns;
    private int bowlerWickets;

    private String firstInningsScore;

    private String requiredRunRate;
    private String currentRunRate;
    private int targetRuns;
    private int runsRequired;
    private int ballsRemaining;

    private String matchStatus;
    private String lastWicket;
    private String recentBalls;

    private LocalDateTime lastUpdated;

    public LiveScore() {}

    // Getters and Setters
    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }
    public String getMatchTitle() { return matchTitle; }
    public void setMatchTitle(String matchTitle) { this.matchTitle = matchTitle; }
    public String getBattingTeam() { return battingTeam; }
    public void setBattingTeam(String battingTeam) { this.battingTeam = battingTeam; }
    public String getBowlingTeam() { return bowlingTeam; }
    public void setBowlingTeam(String bowlingTeam) { this.bowlingTeam = bowlingTeam; }
    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; }
    public int getWickets() { return wickets; }
    public void setWickets(int wickets) { this.wickets = wickets; }
    public double getOvers() { return overs; }
    public void setOvers(double overs) { this.overs = overs; }
    public int getCurrentInnings() { return currentInnings; }
    public void setCurrentInnings(int currentInnings) { this.currentInnings = currentInnings; }
    public String getCurrentOverSummary() { return currentOverSummary; }
    public void setCurrentOverSummary(String currentOverSummary) { this.currentOverSummary = currentOverSummary; }
    public int getRunsInCurrentOver() { return runsInCurrentOver; }
    public void setRunsInCurrentOver(int runsInCurrentOver) { this.runsInCurrentOver = runsInCurrentOver; }
    public String getStriker() { return striker; }
    public void setStriker(String striker) { this.striker = striker; }
    public int getStrikerRuns() { return strikerRuns; }
    public void setStrikerRuns(int strikerRuns) { this.strikerRuns = strikerRuns; }
    public int getStrikerBalls() { return strikerBalls; }
    public void setStrikerBalls(int strikerBalls) { this.strikerBalls = strikerBalls; }
    public String getNonStriker() { return nonStriker; }
    public void setNonStriker(String nonStriker) { this.nonStriker = nonStriker; }
    public int getNonStrikerRuns() { return nonStrikerRuns; }
    public void setNonStrikerRuns(int nonStrikerRuns) { this.nonStrikerRuns = nonStrikerRuns; }
    public int getNonStrikerBalls() { return nonStrikerBalls; }
    public void setNonStrikerBalls(int nonStrikerBalls) { this.nonStrikerBalls = nonStrikerBalls; }
    public String getCurrentBowler() { return currentBowler; }
    public void setCurrentBowler(String currentBowler) { this.currentBowler = currentBowler; }
    public double getBowlerOvers() { return bowlerOvers; }
    public void setBowlerOvers(double bowlerOvers) { this.bowlerOvers = bowlerOvers; }
    public int getBowlerRuns() { return bowlerRuns; }
    public void setBowlerRuns(int bowlerRuns) { this.bowlerRuns = bowlerRuns; }
    public int getBowlerWickets() { return bowlerWickets; }
    public void setBowlerWickets(int bowlerWickets) { this.bowlerWickets = bowlerWickets; }
    public String getFirstInningsScore() { return firstInningsScore; }
    public void setFirstInningsScore(String firstInningsScore) { this.firstInningsScore = firstInningsScore; }
    public String getRequiredRunRate() { return requiredRunRate; }
    public void setRequiredRunRate(String requiredRunRate) { this.requiredRunRate = requiredRunRate; }
    public String getCurrentRunRate() { return currentRunRate; }
    public void setCurrentRunRate(String currentRunRate) { this.currentRunRate = currentRunRate; }
    public int getTargetRuns() { return targetRuns; }
    public void setTargetRuns(int targetRuns) { this.targetRuns = targetRuns; }
    public int getRunsRequired() { return runsRequired; }
    public void setRunsRequired(int runsRequired) { this.runsRequired = runsRequired; }
    public int getBallsRemaining() { return ballsRemaining; }
    public void setBallsRemaining(int ballsRemaining) { this.ballsRemaining = ballsRemaining; }
    public String getMatchStatus() { return matchStatus; }
    public void setMatchStatus(String matchStatus) { this.matchStatus = matchStatus; }
    public String getLastWicket() { return lastWicket; }
    public void setLastWicket(String lastWicket) { this.lastWicket = lastWicket; }
    public String getRecentBalls() { return recentBalls; }
    public void setRecentBalls(String recentBalls) { this.recentBalls = recentBalls; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
