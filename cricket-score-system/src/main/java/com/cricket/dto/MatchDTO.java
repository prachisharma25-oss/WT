package com.cricket.dto;

import com.cricket.model.Match;

import java.time.LocalDateTime;

public class MatchDTO {
    private Long id;
    private String title;
    private String team1Name;
    private String team1Short;
    private String team2Name;
    private String team2Short;
    private Match.MatchFormat format;
    private Match.MatchStatus status;
    private String venue;
    private LocalDateTime matchDate;
    private String currentScore;
    private int currentInnings;
    private String battingTeam;
    private String bowlingTeam;
    private int innings1Runs;
    private int innings1Wickets;
    private double innings1Overs;
    private int innings2Runs;
    private int innings2Wickets;
    private double innings2Overs;
    private String result;
    private String winnerTeam;
    private String tossWinner;
    private String tossDecision;

    public MatchDTO() {}

    public static MatchDTO fromMatch(Match m) {
        MatchDTO dto = new MatchDTO();
        dto.id = m.getId();
        dto.title = m.getTitle();
        dto.team1Name = m.getTeam1().getName();
        dto.team1Short = m.getTeam1().getShortName();
        dto.team2Name = m.getTeam2().getName();
        dto.team2Short = m.getTeam2().getShortName();
        dto.format = m.getFormat();
        dto.status = m.getStatus();
        dto.venue = m.getVenue();
        dto.matchDate = m.getMatchDate();
        dto.currentScore = m.getCurrentScoreString();
        dto.currentInnings = m.getCurrentInnings();
        dto.battingTeam = m.getBattingTeam();
        dto.bowlingTeam = m.getBowlingTeam();
        dto.innings1Runs = m.getInnings1Runs();
        dto.innings1Wickets = m.getInnings1Wickets();
        dto.innings1Overs = m.getInnings1Overs();
        dto.innings2Runs = m.getInnings2Runs();
        dto.innings2Wickets = m.getInnings2Wickets();
        dto.innings2Overs = m.getInnings2Overs();
        dto.result = m.getResult();
        dto.winnerTeam = m.getWinnerTeam();
        dto.tossWinner = m.getTossWinner();
        dto.tossDecision = m.getTossDecision();
        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTeam1Name() { return team1Name; }
    public void setTeam1Name(String team1Name) { this.team1Name = team1Name; }
    public String getTeam1Short() { return team1Short; }
    public void setTeam1Short(String team1Short) { this.team1Short = team1Short; }
    public String getTeam2Name() { return team2Name; }
    public void setTeam2Name(String team2Name) { this.team2Name = team2Name; }
    public String getTeam2Short() { return team2Short; }
    public void setTeam2Short(String team2Short) { this.team2Short = team2Short; }
    public Match.MatchFormat getFormat() { return format; }
    public void setFormat(Match.MatchFormat format) { this.format = format; }
    public Match.MatchStatus getStatus() { return status; }
    public void setStatus(Match.MatchStatus status) { this.status = status; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public LocalDateTime getMatchDate() { return matchDate; }
    public void setMatchDate(LocalDateTime matchDate) { this.matchDate = matchDate; }
    public String getCurrentScore() { return currentScore; }
    public void setCurrentScore(String currentScore) { this.currentScore = currentScore; }
    public int getCurrentInnings() { return currentInnings; }
    public void setCurrentInnings(int currentInnings) { this.currentInnings = currentInnings; }
    public String getBattingTeam() { return battingTeam; }
    public void setBattingTeam(String battingTeam) { this.battingTeam = battingTeam; }
    public String getBowlingTeam() { return bowlingTeam; }
    public void setBowlingTeam(String bowlingTeam) { this.bowlingTeam = bowlingTeam; }
    public int getInnings1Runs() { return innings1Runs; }
    public void setInnings1Runs(int innings1Runs) { this.innings1Runs = innings1Runs; }
    public int getInnings1Wickets() { return innings1Wickets; }
    public void setInnings1Wickets(int innings1Wickets) { this.innings1Wickets = innings1Wickets; }
    public double getInnings1Overs() { return innings1Overs; }
    public void setInnings1Overs(double innings1Overs) { this.innings1Overs = innings1Overs; }
    public int getInnings2Runs() { return innings2Runs; }
    public void setInnings2Runs(int innings2Runs) { this.innings2Runs = innings2Runs; }
    public int getInnings2Wickets() { return innings2Wickets; }
    public void setInnings2Wickets(int innings2Wickets) { this.innings2Wickets = innings2Wickets; }
    public double getInnings2Overs() { return innings2Overs; }
    public void setInnings2Overs(double innings2Overs) { this.innings2Overs = innings2Overs; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public String getWinnerTeam() { return winnerTeam; }
    public void setWinnerTeam(String winnerTeam) { this.winnerTeam = winnerTeam; }
    public String getTossWinner() { return tossWinner; }
    public void setTossWinner(String tossWinner) { this.tossWinner = tossWinner; }
    public String getTossDecision() { return tossDecision; }
    public void setTossDecision(String tossDecision) { this.tossDecision = tossDecision; }
}
