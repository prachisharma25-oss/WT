package com.cricket.config;

import com.cricket.model.*;
import com.cricket.repository.*;
import com.cricket.service.LiveScoreService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final LiveScoreService liveScoreService;

    public DataSeeder(TeamRepository teamRepository, PlayerRepository playerRepository,
                      MatchRepository matchRepository, LiveScoreService liveScoreService) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.matchRepository = matchRepository;
        this.liveScoreService = liveScoreService;
    }

    @Override
    public void run(String... args) {
        log.info("Seeding cricket data...");
        seedTeamsAndPlayers();
        seedMatches();
        log.info("Data seeding complete.");
    }

    private void seedTeamsAndPlayers() {
        Team india       = teamRepository.save(new Team("India",        "IND", "India"));
        Team australia   = teamRepository.save(new Team("Australia",    "AUS", "Australia"));
        Team england     = teamRepository.save(new Team("England",      "ENG", "England"));
        Team pakistan    = teamRepository.save(new Team("Pakistan",     "PAK", "Pakistan"));
        Team southAfrica = teamRepository.save(new Team("South Africa", "SA",  "South Africa"));
        Team newZealand  = teamRepository.save(new Team("New Zealand",  "NZ",  "New Zealand"));

        seedPlayers(india,       buildIndiaPlayers(india));
        seedPlayers(australia,   buildAustraliaPlayers(australia));
        seedPlayers(england,     buildEnglandPlayers(england));
        seedPlayers(pakistan,    buildPakistanPlayers(pakistan));
        seedPlayers(southAfrica, buildSAPlayers(southAfrica));
        seedPlayers(newZealand,  buildNZPlayers(newZealand));

        log.info("Seeded 6 teams with players");
    }

    private void seedPlayers(Team team, List<Player> players) {
        playerRepository.saveAll(players);
    }

    private List<Player> buildIndiaPlayers(Team t) {
        return List.of(
            p("Rohit Sharma",     Player.PlayerRole.BATSMAN,        t, true,  false, 250, 9205,  8,  48.2),
            p("Shubman Gill",     Player.PlayerRole.BATSMAN,        t, false, false,  80, 2100,  0,  40.5),
            p("Virat Kohli",      Player.PlayerRole.BATSMAN,        t, false, false, 295,13848,  4,  57.3),
            p("Shreyas Iyer",     Player.PlayerRole.BATSMAN,        t, false, false,  60, 1735,  0,  45.6),
            p("KL Rahul",         Player.PlayerRole.WICKET_KEEPER,  t, false, true,   72, 2218,  0,  47.1),
            p("Hardik Pandya",    Player.PlayerRole.ALL_ROUNDER,    t, false, false, 100, 1855, 75,  33.2),
            p("Ravindra Jadeja",  Player.PlayerRole.ALL_ROUNDER,    t, false, false, 185, 2756,201,  32.4),
            p("R. Ashwin",        Player.PlayerRole.BOWLER,         t, false, false, 115,  590,287,  12.1),
            p("Jasprit Bumrah",   Player.PlayerRole.BOWLER,         t, false, false,  90,  180,149,   6.2),
            p("Mohammed Shami",   Player.PlayerRole.BOWLER,         t, false, false,  88,  165,195,   4.1),
            p("Kuldeep Yadav",    Player.PlayerRole.BOWLER,         t, false, false,  70,  145,168,   5.3)
        );
    }

    private List<Player> buildAustraliaPlayers(Team t) {
        return List.of(
            p("David Warner",      Player.PlayerRole.BATSMAN,       t, false, false, 161, 8786,  3, 44.6),
            p("Travis Head",       Player.PlayerRole.BATSMAN,       t, false, false,  55, 1908,  0, 42.3),
            p("Steve Smith",       Player.PlayerRole.BATSMAN,       t, false, false, 175,10007, 17, 57.5),
            p("Marnus Labuschagne",Player.PlayerRole.BATSMAN,       t, false, false,  65, 2829,  5, 55.3),
            p("Pat Cummins",       Player.PlayerRole.BOWLER,        t, true,  false,  82,  460,236,  8.4),
            p("Mitchell Starc",    Player.PlayerRole.BOWLER,        t, false, false, 105,  620,345,  7.2),
            p("Josh Hazlewood",    Player.PlayerRole.BOWLER,        t, false, false,  98,  390,278,  5.8),
            p("Glenn Maxwell",     Player.PlayerRole.ALL_ROUNDER,   t, false, false, 135, 3867, 68, 35.1),
            p("Alex Carey",        Player.PlayerRole.WICKET_KEEPER, t, false, true,   68, 1245,  0, 36.2),
            p("Cameron Green",     Player.PlayerRole.ALL_ROUNDER,   t, false, false,  42,  755, 45, 28.9),
            p("Adam Zampa",        Player.PlayerRole.BOWLER,        t, false, false,  90,  280,174,  5.1)
        );
    }

    private List<Player> buildEnglandPlayers(Team t) {
        return List.of(
            p("Jos Buttler",    Player.PlayerRole.WICKET_KEEPER, t, true,  true,  156, 4280,  0, 41.2),
            p("Joe Root",       Player.PlayerRole.BATSMAN,       t, false, false, 172,11426, 36, 49.8),
            p("Ben Stokes",     Player.PlayerRole.ALL_ROUNDER,   t, false, false, 105, 3072,189, 35.6),
            p("Jonny Bairstow", Player.PlayerRole.BATSMAN,       t, false, false, 102, 3815,  0, 39.2),
            p("Harry Brook",    Player.PlayerRole.BATSMAN,       t, false, false,  40, 1578,  0, 50.2),
            p("James Anderson", Player.PlayerRole.BOWLER,        t, false, false, 188,  780,700,  8.1),
            p("Stuart Broad",   Player.PlayerRole.BOWLER,        t, false, false, 167, 1045,604,  9.5),
            p("Mark Wood",      Player.PlayerRole.BOWLER,        t, false, false,  72,  480,185,  8.8),
            p("Adil Rashid",    Player.PlayerRole.BOWLER,        t, false, false,  85,  310,158,  6.2),
            p("Dawid Malan",    Player.PlayerRole.BATSMAN,       t, false, false,  60, 1735,  0, 39.4),
            p("Liam Livingstone",Player.PlayerRole.ALL_ROUNDER,  t, false, false,  55, 1205, 28, 30.5)
        );
    }

    private List<Player> buildPakistanPlayers(Team t) {
        return List.of(
            p("Babar Azam",       Player.PlayerRole.BATSMAN,       t, true,  false, 195, 8348,  5, 52.3),
            p("Mohammad Rizwan",  Player.PlayerRole.WICKET_KEEPER, t, false, true,  122, 3510,  0, 46.8),
            p("Shaheen Afridi",   Player.PlayerRole.BOWLER,        t, false, false,  72,  680,187, 12.1),
            p("Naseem Shah",      Player.PlayerRole.BOWLER,        t, false, false,  35,  320, 98,  9.5),
            p("Fakhar Zaman",     Player.PlayerRole.BATSMAN,       t, false, false,  80, 2847,  0, 40.2),
            p("Shadab Khan",      Player.PlayerRole.ALL_ROUNDER,   t, false, false,  88,  945,150, 18.5),
            p("Haris Rauf",       Player.PlayerRole.BOWLER,        t, false, false,  55,  480,118, 11.8),
            p("Iftikhar Ahmed",   Player.PlayerRole.ALL_ROUNDER,   t, false, false,  60,  785, 20, 28.4),
            p("Abdullah Shafique",Player.PlayerRole.BATSMAN,       t, false, false,  30,  896,  0, 41.6),
            p("Saud Shakeel",     Player.PlayerRole.BATSMAN,       t, false, false,  28,  784,  0, 38.9),
            p("Usama Mir",        Player.PlayerRole.BOWLER,        t, false, false,  25,  220, 52, 10.2)
        );
    }

    private List<Player> buildSAPlayers(Team t) {
        return List.of(
            p("Temba Bavuma",        Player.PlayerRole.BATSMAN,       t, true,  false,  95, 2845,  0, 40.5),
            p("Quinton de Kock",     Player.PlayerRole.WICKET_KEEPER, t, false, true,  145, 5890,  0, 44.2),
            p("Kagiso Rabada",       Player.PlayerRole.BOWLER,        t, false, false,  92,  620,262,  9.8),
            p("Anrich Nortje",       Player.PlayerRole.BOWLER,        t, false, false,  48,  380,102, 10.5),
            p("Heinrich Klaasen",    Player.PlayerRole.BATSMAN,       t, false, false,  72, 1845,  0, 41.8),
            p("Aiden Markram",       Player.PlayerRole.ALL_ROUNDER,   t, false, false,  88, 2340, 10, 38.4),
            p("Marco Jansen",        Player.PlayerRole.ALL_ROUNDER,   t, false, false,  40,  455, 85, 18.6),
            p("Keshav Maharaj",      Player.PlayerRole.BOWLER,        t, false, false,  65,  480,152, 10.1),
            p("Rassie van der Dussen",Player.PlayerRole.BATSMAN,      t, false, false,  68, 1872,  0, 42.8),
            p("David Miller",        Player.PlayerRole.BATSMAN,       t, false, false, 105, 2720,  0, 42.5),
            p("Lungi Ngidi",         Player.PlayerRole.BOWLER,        t, false, false,  62,  480,148, 10.2)
        );
    }

    private List<Player> buildNZPlayers(Team t) {
        return List.of(
            p("Kane Williamson", Player.PlayerRole.BATSMAN,       t, true,  false, 168, 8497, 12, 54.6),
            p("Devon Conway",    Player.PlayerRole.BATSMAN,       t, false, false,  60, 2145,  0, 46.3),
            p("Trent Boult",     Player.PlayerRole.BOWLER,        t, false, false,  95,  620,317,  9.2),
            p("Tim Southee",     Player.PlayerRole.BOWLER,        t, false, false, 145,  890,387,  8.6),
            p("Tom Latham",      Player.PlayerRole.WICKET_KEEPER, t, false, true,  130, 3845,  0, 39.1),
            p("Daryl Mitchell",  Player.PlayerRole.ALL_ROUNDER,   t, false, false,  55, 1478, 15, 39.2),
            p("Glenn Phillips",  Player.PlayerRole.ALL_ROUNDER,   t, false, false,  65, 1234,  8, 35.6),
            p("Mitchell Santner",Player.PlayerRole.ALL_ROUNDER,   t, false, false,  85,  945,120, 18.8),
            p("Matt Henry",      Player.PlayerRole.BOWLER,        t, false, false,  58,  450,145, 10.5),
            p("Will Young",      Player.PlayerRole.BATSMAN,       t, false, false,  38, 1045,  0, 37.5),
            p("Ish Sodhi",       Player.PlayerRole.BOWLER,        t, false, false,  65,  380,130,  7.8)
        );
    }

    private Player p(String name, Player.PlayerRole role, Team team,
                     boolean isCaptain, boolean isWk,
                     int matches, int runs, int wickets, double avg) {
        Player player = new Player();
        player.setName(name);
        player.setRole(role);
        player.setTeam(team);
        player.setCaptain(isCaptain);
        player.setWicketKeeper(isWk);
        player.setCareerMatches(matches);
        player.setCareerRuns(runs);
        player.setCareerWickets(wickets);
        player.setCareerAverage(avg);
        return player;
    }

    private void seedMatches() {
        List<Team> teams = teamRepository.findAll();
        Team india       = find(teams, "IND");
        Team australia   = find(teams, "AUS");
        Team england     = find(teams, "ENG");
        Team pakistan    = find(teams, "PAK");
        Team southAfrica = find(teams, "SA");
        Team newZealand  = find(teams, "NZ");

        // Live match 1 — IND vs AUS T20, 1st innings in progress
        Match live1 = buildMatch("IND vs AUS - 1st T20I", india, australia,
                Match.MatchFormat.T20, Match.MatchStatus.LIVE, "Wankhede Stadium, Mumbai",
                "India", "bat", india.getName(), australia.getName(),
                142, 6, 18.4, 0, 0, 0.0);
        Match saved1 = matchRepository.save(live1);
        liveScoreService.initializeLiveScore(saved1);

        // Live match 2 — ENG vs PAK ODI, 2nd innings
        Match live2 = buildMatch("ENG vs PAK - 2nd ODI", england, pakistan,
                Match.MatchFormat.ODI, Match.MatchStatus.LIVE, "Lord's Cricket Ground, London",
                "England", "bat", pakistan.getName(), england.getName(),
                312, 9, 49.3, 87, 2, 22.5);
        live2.setCurrentInnings(2);
        Match saved2 = matchRepository.save(live2);
        liveScoreService.initializeLiveScore(saved2);

        // Live match 3 — SA vs NZ T20
        Match live3 = buildMatch("SA vs NZ - T20 World Cup", southAfrica, newZealand,
                Match.MatchFormat.T20, Match.MatchStatus.LIVE, "Newlands, Cape Town",
                "South Africa", "field", newZealand.getName(), southAfrica.getName(),
                176, 7, 20.0, 45, 1, 6.2);
        live3.setCurrentInnings(2);
        Match saved3 = matchRepository.save(live3);
        liveScoreService.initializeLiveScore(saved3);

        // Completed match
        Match completed = buildMatch("IND vs ENG - 1st Test", india, england,
                Match.MatchFormat.TEST, Match.MatchStatus.COMPLETED, "Eden Gardens, Kolkata",
                "India", "bat", india.getName(), england.getName(),
                456, 8, 120.0, 187, 10, 58.2);
        completed.setResult("India won by 269 runs");
        completed.setWinnerTeam("India");
        matchRepository.save(completed);

        // Upcoming
        Match up1 = new Match();
        up1.setTitle("AUS vs PAK - 3rd ODI");
        up1.setTeam1(australia); up1.setTeam2(pakistan);
        up1.setFormat(Match.MatchFormat.ODI);
        up1.setStatus(Match.MatchStatus.UPCOMING);
        up1.setVenue("MCG, Melbourne");
        up1.setMatchDate(LocalDateTime.now().plusDays(2));
        up1.setCurrentInnings(1);
        up1.setBattingTeam(australia.getName());
        up1.setBowlingTeam(pakistan.getName());
        matchRepository.save(up1);

        Match up2 = new Match();
        up2.setTitle("NZ vs IND - 1st Test");
        up2.setTeam1(newZealand); up2.setTeam2(india);
        up2.setFormat(Match.MatchFormat.TEST);
        up2.setStatus(Match.MatchStatus.UPCOMING);
        up2.setVenue("Basin Reserve, Wellington");
        up2.setMatchDate(LocalDateTime.now().plusDays(5));
        up2.setCurrentInnings(1);
        up2.setBattingTeam(newZealand.getName());
        up2.setBowlingTeam(india.getName());
        matchRepository.save(up2);

        log.info("Seeded 3 live, 1 completed, 2 upcoming matches");
    }

    private Team find(List<Team> teams, String shortName) {
        return teams.stream()
                .filter(t -> t.getShortName().equals(shortName))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Team not found: " + shortName));
    }

    private Match buildMatch(String title, Team t1, Team t2,
                              Match.MatchFormat format, Match.MatchStatus status,
                              String venue, String tossWinner, String tossDecision,
                              String batting, String bowling,
                              int inn1R, int inn1W, double inn1O,
                              int inn2R, int inn2W, double inn2O) {
        Match m = new Match();
        m.setTitle(title);
        m.setTeam1(t1); m.setTeam2(t2);
        m.setFormat(format); m.setStatus(status);
        m.setVenue(venue);
        m.setMatchDate(LocalDateTime.now().minusHours(2));
        m.setTossWinner(tossWinner); m.setTossDecision(tossDecision);
        m.setBattingTeam(batting); m.setBowlingTeam(bowling);
        m.setCurrentInnings(inn2R > 0 ? 2 : 1);
        m.setInnings1Runs(inn1R); m.setInnings1Wickets(inn1W); m.setInnings1Overs(inn1O);
        m.setInnings2Runs(inn2R); m.setInnings2Wickets(inn2W); m.setInnings2Overs(inn2O);
        return m;
    }
}
