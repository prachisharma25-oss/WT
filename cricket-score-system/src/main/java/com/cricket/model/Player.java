package com.cricket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Player name is required")
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private PlayerRole role;

    private boolean isCaptain;
    private boolean isWicketKeeper;

    private int careerMatches;
    private int careerRuns;
    private int careerWickets;
    private double careerAverage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    @JsonIgnore
    private Team team;

    public enum PlayerRole {
        BATSMAN, BOWLER, ALL_ROUNDER, WICKET_KEEPER
    }

    public Player() {}

    public Player(String name, PlayerRole role, Team team) {
        this.name = name;
        this.role = role;
        this.team = team;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public PlayerRole getRole() { return role; }
    public void setRole(PlayerRole role) { this.role = role; }
    public boolean isCaptain() { return isCaptain; }
    public void setCaptain(boolean captain) { isCaptain = captain; }
    public boolean isWicketKeeper() { return isWicketKeeper; }
    public void setWicketKeeper(boolean wicketKeeper) { isWicketKeeper = wicketKeeper; }
    public int getCareerMatches() { return careerMatches; }
    public void setCareerMatches(int careerMatches) { this.careerMatches = careerMatches; }
    public int getCareerRuns() { return careerRuns; }
    public void setCareerRuns(int careerRuns) { this.careerRuns = careerRuns; }
    public int getCareerWickets() { return careerWickets; }
    public void setCareerWickets(int careerWickets) { this.careerWickets = careerWickets; }
    public double getCareerAverage() { return careerAverage; }
    public void setCareerAverage(double careerAverage) { this.careerAverage = careerAverage; }
    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
}
