package com.cricket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "scorecards")
public class Scorecard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    @JsonIgnore
    private Match match;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    private int inningsNumber;
    private String teamName;

    // Batting
    private int runsScored;
    private int ballsFaced;
    private int fours;
    private int sixes;
    private boolean isOut;
    private String dismissalType;
    private String dismissedBy;
    private String caughtBy;

    // Bowling
    private double oversBowled;
    private int runsConceded;
    private int wicketsTaken;
    private int maidens;
    private int noBalls;
    private int wides;

    // Fielding
    private int catches;
    private int runOuts;
    private int stumpings;

    public Scorecard() {}

    public double getBattingStrikeRate() {
        if (ballsFaced == 0) return 0.0;
        return (double) runsScored / ballsFaced * 100;
    }

    public double getBowlingEconomy() {
        if (oversBowled == 0) return 0.0;
        return runsConceded / oversBowled;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Match getMatch() { return match; }
    public void setMatch(Match match) { this.match = match; }
    public Player getPlayer() { return player; }
    public void setPlayer(Player player) { this.player = player; }
    public int getInningsNumber() { return inningsNumber; }
    public void setInningsNumber(int inningsNumber) { this.inningsNumber = inningsNumber; }
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    public int getRunsScored() { return runsScored; }
    public void setRunsScored(int runsScored) { this.runsScored = runsScored; }
    public int getBallsFaced() { return ballsFaced; }
    public void setBallsFaced(int ballsFaced) { this.ballsFaced = ballsFaced; }
    public int getFours() { return fours; }
    public void setFours(int fours) { this.fours = fours; }
    public int getSixes() { return sixes; }
    public void setSixes(int sixes) { this.sixes = sixes; }
    public boolean isOut() { return isOut; }
    public void setOut(boolean out) { isOut = out; }
    public String getDismissalType() { return dismissalType; }
    public void setDismissalType(String dismissalType) { this.dismissalType = dismissalType; }
    public String getDismissedBy() { return dismissedBy; }
    public void setDismissedBy(String dismissedBy) { this.dismissedBy = dismissedBy; }
    public String getCaughtBy() { return caughtBy; }
    public void setCaughtBy(String caughtBy) { this.caughtBy = caughtBy; }
    public double getOversBowled() { return oversBowled; }
    public void setOversBowled(double oversBowled) { this.oversBowled = oversBowled; }
    public int getRunsConceded() { return runsConceded; }
    public void setRunsConceded(int runsConceded) { this.runsConceded = runsConceded; }
    public int getWicketsTaken() { return wicketsTaken; }
    public void setWicketsTaken(int wicketsTaken) { this.wicketsTaken = wicketsTaken; }
    public int getMaidens() { return maidens; }
    public void setMaidens(int maidens) { this.maidens = maidens; }
    public int getNoBalls() { return noBalls; }
    public void setNoBalls(int noBalls) { this.noBalls = noBalls; }
    public int getWides() { return wides; }
    public void setWides(int wides) { this.wides = wides; }
    public int getCatches() { return catches; }
    public void setCatches(int catches) { this.catches = catches; }
    public int getRunOuts() { return runOuts; }
    public void setRunOuts(int runOuts) { this.runOuts = runOuts; }
    public int getStumpings() { return stumpings; }
    public void setStumpings(int stumpings) { this.stumpings = stumpings; }
}
