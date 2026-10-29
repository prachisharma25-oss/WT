package com.cricket.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team1_id", nullable = false)
    private Team team1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team2_id", nullable = false)
    private Team team2;

    @Enumerated(EnumType.STRING)
    private MatchFormat format;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    private String venue;
    private LocalDateTime matchDate;

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
    private int winMarginRuns;
    private int winMarginWickets;

    private String tossWinner;
    private String tossDecision;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Scorecard> scorecards = new ArrayList<>();

    public enum MatchFormat { TEST, ODI, T20 }
    public enum MatchStatus { UPCOMING, LIVE, COMPLETED, ABANDONED }

    public Match() {}

    public String getCurrentScoreString() {
        if (currentInnings == 1) {
            return innings1Runs + "/" + innings1Wickets + " (" + String.format("%.1f", innings1Overs) + " ov)";
        } else {
            return innings2Runs + "/" + innings2Wickets + " (" + String.format("%.1f", innings2Overs) + " ov)";
        }
    }

    public int getMaxOvers() {
        return switch (format) {
            case T20 -> 20;
            case ODI -> 50;
            case TEST -> 90;
        };
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Team getTeam1() { return team1; }
    public void setTeam1(Team team1) { this.team1 = team1; }
    public Team getTeam2() { return team2; }
    public void setTeam2(Team team2) { this.team2 = team2; }
    public MatchFormat getFormat() { return format; }
    public void setFormat(MatchFormat format) { this.format = format; }
    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public LocalDateTime getMatchDate() { return matchDate; }
    public void setMatchDate(LocalDateTime matchDate) { this.matchDate = matchDate; }
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
    public int getWinMarginRuns() { return winMarginRuns; }
    public void setWinMarginRuns(int winMarginRuns) { this.winMarginRuns = winMarginRuns; }
    public int getWinMarginWickets() { return winMarginWickets; }
    public void setWinMarginWickets(int winMarginWickets) { this.winMarginWickets = winMarginWickets; }
    public String getTossWinner() { return tossWinner; }
    public void setTossWinner(String tossWinner) { this.tossWinner = tossWinner; }
    public String getTossDecision() { return tossDecision; }
    public void setTossDecision(String tossDecision) { this.tossDecision = tossDecision; }
    public List<Scorecard> getScorecards() { return scorecards; }
    public void setScorecards(List<Scorecard> scorecards) { this.scorecards = scorecards; }
}
