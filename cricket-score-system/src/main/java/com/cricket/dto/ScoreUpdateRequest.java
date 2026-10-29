package com.cricket.dto;

public class ScoreUpdateRequest {
    private Long matchId;
    private int runs;
    private boolean isWicket;
    private boolean isWide;
    private boolean isNoBall;
    private boolean isBye;
    private boolean isLegBye;
    private String wicketType;
    private String batsmanOut;
    private String newBatsman;
    private String commentary;

    public ScoreUpdateRequest() {}

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }
    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; }
    public boolean isWicket() { return isWicket; }
    public void setWicket(boolean wicket) { isWicket = wicket; }
    public boolean isWide() { return isWide; }
    public void setWide(boolean wide) { isWide = wide; }
    public boolean isNoBall() { return isNoBall; }
    public void setNoBall(boolean noBall) { isNoBall = noBall; }
    public boolean isBye() { return isBye; }
    public void setBye(boolean bye) { isBye = bye; }
    public boolean isLegBye() { return isLegBye; }
    public void setLegBye(boolean legBye) { isLegBye = legBye; }
    public String getWicketType() { return wicketType; }
    public void setWicketType(String wicketType) { this.wicketType = wicketType; }
    public String getBatsmanOut() { return batsmanOut; }
    public void setBatsmanOut(String batsmanOut) { this.batsmanOut = batsmanOut; }
    public String getNewBatsman() { return newBatsman; }
    public void setNewBatsman(String newBatsman) { this.newBatsman = newBatsman; }
    public String getCommentary() { return commentary; }
    public void setCommentary(String commentary) { this.commentary = commentary; }
}
