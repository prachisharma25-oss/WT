/**
 * Cricket Score Management System - Frontend JS
 * Connects via WebSocket (STOMP/SockJS) for real-time updates
 */

const API = '/api';
let stompClient = null;
let allMatches = [];
let allPlayers = [];
let allTeams = [];
let liveScores = {};
let selectedLiveMatchId = null;

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    connectWebSocket();
    loadLiveMatches();
    loadAllMatches();
    loadTeams();
    loadPlayers();
    loadAdminData();
    // Refresh live matches every 8 seconds as a fallback
    setInterval(loadLiveMatches, 8000);
});

// ============================================================
// WebSocket
// ============================================================
function connectWebSocket() {
    try {
        const sock = new SockJS('/ws');
        stompClient = Stomp.over(sock);
        stompClient.debug = null; // silence debug logs

        stompClient.connect({}, () => {
            setWsStatus(true);
            // Subscribe to all live score updates
            stompClient.subscribe('/topic/scores/live', (msg) => {
                const score = JSON.parse(msg.body);
                liveScores[score.matchId] = score;
                updateLiveCard(score);
                if (selectedLiveMatchId === score.matchId) {
                    updateLiveDetail(score);
                }
            });
        }, () => {
            setWsStatus(false);
            setTimeout(connectWebSocket, 5000);
        });

        sock.onclose = () => {
            setWsStatus(false);
            setTimeout(connectWebSocket, 5000);
        };
    } catch (e) {
        setWsStatus(false);
    }
}

function setWsStatus(connected) {
    const dot = document.querySelector('.status-dot');
    const txt = document.getElementById('wsStatusText');
    if (connected) {
        dot.className = 'status-dot connected';
        txt.textContent = 'Connected';
    } else {
        dot.className = 'status-dot disconnected';
        txt.textContent = 'Reconnecting...';
    }
}

// ============================================================
// Navigation
// ============================================================
function showSection(name) {
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const section = document.getElementById('section-' + name);
    if (section) {
        section.classList.remove('hidden');
        section.classList.add('active');
    }
    const btns = document.querySelectorAll('.nav-btn');
    btns.forEach(b => { if (b.textContent.toLowerCase().includes(name.toLowerCase())) b.classList.add('active'); });
}

// ============================================================
// Live Matches
// ============================================================
async function loadLiveMatches() {
    try {
        const res = await fetch(`${API}/matches/live`);
        const json = await res.json();
        const matches = json.data || [];
        allMatches = [...allMatches.filter(m => m.status !== 'LIVE'), ...matches];
        renderLiveMatchCards(matches);
    } catch (e) {
        console.error('Failed to load live matches:', e);
    }
}

function renderLiveMatchCards(matches) {
    const grid = document.getElementById('liveMatchesGrid');
    if (!matches.length) {
        grid.innerHTML = '<div class="loading-card">No live matches at the moment.</div>';
        return;
    }
    grid.innerHTML = matches.map(m => buildMatchCard(m, true)).join('');
}

function updateLiveCard(score) {
    const card = document.querySelector(`[data-match-id="${score.matchId}"]`);
    if (!card) return;
    const scoreEl = card.querySelector('.team-score');
    if (scoreEl) {
        scoreEl.textContent = `${score.runs}/${score.wickets}`;
    }
    const oversEl = card.querySelector('.team-overs');
    if (oversEl) {
        oversEl.textContent = `(${score.overs} ov)`;
    }
}

function buildMatchCard(m, isLive = false) {
    const statusClass = m.status.toLowerCase();
    const inn1 = m.innings1Runs > 0 ? `${m.innings1Runs}/${m.innings1Wickets}` : '-';
    const inn2 = m.innings2Runs > 0 ? `${m.innings2Runs}/${m.innings2Wickets}` : '';
    const dateStr = m.matchDate ? new Date(m.matchDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

    const batting = m.battingTeam;
    const t1Score = m.team1Name === batting ? (inn1 !== '-' ? inn1 : '0/0') : (inn2 || '-');
    const t2Score = m.team2Name === batting ? (inn1 !== '-' ? inn1 : '0/0') : (inn2 || '-');

    return `
    <div class="match-card ${statusClass}" data-match-id="${m.id}" onclick="openMatchDetail(${m.id}, '${m.status}')">
        <div class="card-header">
            <div class="card-title">${m.title}</div>
            <div class="card-format">${m.format}</div>
        </div>
        <div class="card-venue">📍 ${m.venue}</div>
        <div class="teams-score">
            <div class="team-block">
                <div class="team-short">${m.team1Short}</div>
                <div class="team-score" id="score-t1-${m.id}">${t1Score}</div>
                <div class="team-overs">${m.team1Name === batting && m.currentInnings === 1 ? `(${m.innings1Overs} ov)` : ''}</div>
            </div>
            <div class="vs-divider">vs</div>
            <div class="team-block">
                <div class="team-short">${m.team2Short}</div>
                <div class="team-score" id="score-t2-${m.id}">${t2Score}</div>
                <div class="team-overs">${m.team2Name === batting && m.currentInnings === 1 ? `(${m.innings1Overs} ov)` : ''}</div>
            </div>
        </div>
        <div class="card-footer">
            <div class="status-badge ${statusClass}">${m.status}</div>
            <div class="card-result">${m.result || dateStr}</div>
        </div>
    </div>`;
}

function openMatchDetail(matchId, status) {
    if (status === 'LIVE') {
        selectedLiveMatchId = matchId;
        document.getElementById('liveMatchDetail').classList.remove('hidden');
        // Subscribe specifically to this match
        if (stompClient && stompClient.connected) {
            stompClient.subscribe(`/topic/scores/${matchId}`, (msg) => {
                const score = JSON.parse(msg.body);
                updateLiveDetail(score);
            });
        }
        // Show current data if available
        if (liveScores[matchId]) {
            updateLiveDetail(liveScores[matchId]);
        } else {
            fetch(`${API}/live/${matchId}`).then(r => r.json()).then(j => {
                if (j.data) updateLiveDetail(j.data);
            });
        }
        // Load match title
        fetch(`${API}/matches/${matchId}`).then(r => r.json()).then(j => {
            if (j.data) {
                document.getElementById('detailMatchTitle').textContent = j.data.title;
            }
        });
    }
}

function hideLiveDetail() {
    selectedLiveMatchId = null;
    document.getElementById('liveMatchDetail').classList.add('hidden');
}

function updateLiveDetail(score) {
    document.getElementById('battingTeamDisplay').textContent = score.battingTeam + ' Batting';
    document.getElementById('mainScoreDisplay').textContent = `${score.runs}/${score.wickets}`;
    document.getElementById('oversDisplay').textContent = `(${score.overs} ov)`;
    document.getElementById('crrDisplay').textContent = `CRR: ${score.currentRunRate || '0.00'}`;

    if (score.detailMatchTitle) {
        document.getElementById('detailMatchTitle').textContent = score.matchTitle;
    }

    // Previous innings
    const prevBar = document.getElementById('prevInningsBar');
    if (score.firstInningsScore && score.currentInnings === 2) {
        prevBar.classList.remove('hidden');
        document.getElementById('prevInningsDisplay').textContent =
            `1st Innings: ${score.firstInningsScore}`;
    } else {
        prevBar.classList.add('hidden');
    }

    // Target info
    const targetInfo = document.getElementById('targetInfo');
    if (score.currentInnings === 2 && score.targetRuns > 0) {
        targetInfo.classList.remove('hidden');
        document.getElementById('targetDisplay').textContent =
            `Target: ${score.targetRuns} | Need: ${score.runsRequired} off ${score.ballsRemaining} balls`;
        document.getElementById('rrrDisplay').textContent =
            `RRR: ${score.requiredRunRate || '0.00'}`;
    } else {
        targetInfo.classList.add('hidden');
    }

    // Batting rows
    const battingRows = document.getElementById('battingRows');
    const sr1 = score.strikerBalls > 0 ? ((score.strikerRuns / score.strikerBalls) * 100).toFixed(1) : '0.0';
    const sr2 = score.nonStrikerBalls > 0 ? ((score.nonStrikerRuns / score.nonStrikerBalls) * 100).toFixed(1) : '0.0';
    battingRows.innerHTML = `
        <tr class="striker">
            <td>${score.striker || '-'}</td>
            <td>${score.strikerRuns || 0}</td>
            <td>${score.strikerBalls || 0}</td>
            <td>${sr1}</td>
        </tr>
        <tr>
            <td>${score.nonStriker || '-'}</td>
            <td>${score.nonStrikerRuns || 0}</td>
            <td>${score.nonStrikerBalls || 0}</td>
            <td>${sr2}</td>
        </tr>`;

    // Bowling row
    const bowlerRow = document.getElementById('bowlerRow');
    const er = score.bowlerOvers > 0 ? (score.bowlerRuns / score.bowlerOvers).toFixed(2) : '0.00';
    bowlerRow.innerHTML = `
        <tr>
            <td>${score.currentBowler || '-'}</td>
            <td>${score.bowlerOvers || 0}</td>
            <td>${score.bowlerRuns || 0}</td>
            <td>${score.bowlerWickets || 0}</td>
            <td>${er}</td>
        </tr>`;

    // Recent balls
    const ballsContainer = document.getElementById('recentBalls');
    if (score.recentBalls) {
        const balls = score.recentBalls.trim().split(' ').filter(b => b);
        ballsContainer.innerHTML = balls.map(b => {
            let cls = '';
            if (b === '4') cls = 'four';
            else if (b === '6') cls = 'six';
            else if (b === 'W') cls = 'wicket';
            else if (b.startsWith('Wd') || b.startsWith('Nb')) cls = 'wide';
            else if (b === '0') cls = 'dot';
            return `<div class="ball ${cls}">${b}</div>`;
        }).join('');
    } else {
        ballsContainer.innerHTML = '';
    }

    // Last wicket
    const lwBar = document.getElementById('lastWicketBar');
    if (score.lastWicket) {
        lwBar.classList.remove('hidden');
        document.getElementById('lastWicketText').textContent = score.lastWicket;
    } else {
        lwBar.classList.add('hidden');
    }
}

// ============================================================
// All Matches
// ============================================================
async function loadAllMatches() {
    try {
        const res = await fetch(`${API}/matches`);
        const json = await res.json();
        allMatches = json.data || [];
        renderAllMatches(allMatches);
    } catch (e) {
        console.error('Failed to load matches:', e);
    }
}

function renderAllMatches(matches) {
    const grid = document.getElementById('allMatchesGrid');
    if (!matches.length) {
        grid.innerHTML = '<div class="loading-card">No matches found.</div>';
        return;
    }
    grid.innerHTML = matches.map(m => buildMatchCard(m)).join('');
}

function filterMatches(status) {
    document.querySelectorAll('#section-matches .filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const filtered = status === 'ALL' ? allMatches : allMatches.filter(m => m.status === status);
    renderAllMatches(filtered);
}

// ============================================================
// Teams
// ============================================================
async function loadTeams() {
    try {
        const res = await fetch(`${API}/teams`);
        const json = await res.json();
        allTeams = json.data || [];
        renderTeams(allTeams);
        populateTeamSelects();
    } catch (e) {
        console.error('Failed to load teams:', e);
    }
}

const teamFlags = {
    'IND': '🇮🇳', 'AUS': '🇦🇺', 'ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'PAK': '🇵🇰', 'SA': '🇿🇦', 'NZ': '🇳🇿',
    'SL': '🇱🇰', 'WI': '🌴', 'BAN': '🇧🇩', 'AFG': '🇦🇫'
};

function renderTeams(teams) {
    const grid = document.getElementById('teamsGrid');
    grid.innerHTML = teams.map(t => `
        <div class="team-card" onclick="showTeamDetail(${t.id})">
            <div class="team-flag">${teamFlags[t.shortName] || '🏏'}</div>
            <div class="team-name">${t.name}</div>
            <div class="team-country">${t.country}</div>
            <div class="team-stats">
                <div class="team-stat">
                    <div class="team-stat-num">${t.shortName}</div>
                    <div class="team-stat-label">Code</div>
                </div>
            </div>
        </div>`).join('');
}

async function showTeamDetail(teamId) {
    const team = allTeams.find(t => t.id === teamId);
    if (!team) return;

    document.getElementById('teamsGrid').classList.add('hidden');
    const detail = document.getElementById('teamDetail');
    detail.classList.remove('hidden');
    document.getElementById('teamDetailName').textContent =
        `${teamFlags[team.shortName] || '🏏'} ${team.name} — Squad`;

    try {
        const res = await fetch(`${API}/teams/${teamId}/players`);
        const json = await res.json();
        const players = json.data || [];
        document.getElementById('teamPlayersList').innerHTML = players.map(p => `
            <div class="player-card">
                <div class="player-card-name">
                    ${p.captain ? '©' : ''} ${p.wicketKeeper ? '🧤' : ''} ${p.name}
                    <span class="player-role-badge">${formatRole(p.role)}</span>
                </div>
                <div class="player-card-stats">
                    <span>Matches: ${p.careerMatches}</span>
                    <span>Runs: ${p.careerRuns}</span>
                    <span>Wkts: ${p.careerWickets}</span>
                    <span>Avg: ${p.careerAverage}</span>
                </div>
            </div>`).join('');
    } catch (e) {
        document.getElementById('teamPlayersList').innerHTML = '<p>Failed to load players.</p>';
    }
}

function hideTeamDetail() {
    document.getElementById('teamsGrid').classList.remove('hidden');
    document.getElementById('teamDetail').classList.add('hidden');
}

// ============================================================
// Players
// ============================================================
async function loadPlayers() {
    try {
        const res = await fetch(`${API}/players`);
        const json = await res.json();
        allPlayers = json.data || [];
        renderPlayers(allPlayers);
    } catch (e) {
        console.error('Failed to load players:', e);
    }
}

function renderPlayers(players) {
    const body = document.getElementById('playersBody');
    if (!players.length) {
        body.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:32px">No players found</td></tr>';
        return;
    }
    body.innerHTML = players.map(p => `
        <tr>
            <td>${p.captain ? '© ' : ''}${p.wicketKeeper ? '🧤 ' : ''}${p.name}</td>
            <td><span class="role-tag ${p.role.toLowerCase().replace('_', '-')}">${formatRole(p.role)}</span></td>
            <td>${p.team ? p.team.name || getTeamName(p) : '-'}</td>
            <td>${p.careerMatches}</td>
            <td>${p.careerRuns.toLocaleString()}</td>
            <td>${p.careerWickets}</td>
            <td>${p.careerAverage}</td>
        </tr>`).join('');
}

function filterPlayers(role) {
    document.querySelectorAll('#section-players .filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const filtered = role === 'ALL' ? allPlayers : allPlayers.filter(p => p.role === role);
    renderPlayers(filtered);
}

function getTeamName(player) {
    // team may be serialized differently due to JsonIgnore
    return '-';
}

// ============================================================
// Admin
// ============================================================
async function loadAdminData() {
    await loadTeams();
    populateTeamSelects();
    await populateAdminMatchSelect();
}

function populateTeamSelects() {
    ['team1Select', 'team2Select'].forEach(id => {
        const sel = document.getElementById(id);
        if (sel) {
            sel.innerHTML = allTeams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        }
    });
}

async function populateAdminMatchSelect() {
    try {
        const res = await fetch(`${API}/matches`);
        const json = await res.json();
        const matches = json.data || [];
        const sel = document.getElementById('adminMatchSelect');
        sel.innerHTML = matches.map(m =>
            `<option value="${m.id}">[${m.status}] ${m.title}</option>`).join('');
    } catch (e) { }
}

function loadMatchControls() { /* nothing extra needed */ }

async function createMatch(event) {
    event.preventDefault();
    const body = {
        title: document.getElementById('matchTitle').value,
        team1Id: parseInt(document.getElementById('team1Select').value),
        team2Id: parseInt(document.getElementById('team2Select').value),
        format: document.getElementById('matchFormat').value,
        venue: document.getElementById('matchVenue').value,
        tossDecision: document.getElementById('tossDecision').value
    };

    try {
        const res = await fetch(`${API}/matches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.success) {
            showAdminMsg('Match created: ' + json.data.title, 'success');
            await loadAllMatches();
            await populateAdminMatchSelect();
            document.getElementById('createMatchForm').reset();
        } else {
            showAdminMsg(json.message, 'error');
        }
    } catch (e) {
        showAdminMsg('Failed to create match: ' + e.message, 'error');
    }
}

async function startSelectedMatch() {
    const id = document.getElementById('adminMatchSelect').value;
    if (!id) return;
    try {
        const res = await fetch(`${API}/matches/${id}/start`, { method: 'POST' });
        const json = await res.json();
        if (json.success) {
            showAdminMsg('Match started! Score simulation is now running.', 'success');
            await loadLiveMatches();
            await loadAllMatches();
        } else {
            showAdminMsg(json.message, 'error');
        }
    } catch (e) {
        showAdminMsg('Error: ' + e.message, 'error');
    }
}

async function completeSelectedMatch() {
    const id = document.getElementById('adminMatchSelect').value;
    if (!id) return;
    const result = prompt('Enter match result (e.g. India won by 20 runs):');
    if (!result) return;
    const winner = prompt('Enter winner team name:') || '';
    try {
        const res = await fetch(`${API}/matches/${id}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result, winner })
        });
        const json = await res.json();
        if (json.success) {
            showAdminMsg('Match completed!', 'success');
            await loadAllMatches();
            await loadLiveMatches();
        } else {
            showAdminMsg(json.message, 'error');
        }
    } catch (e) {
        showAdminMsg('Error: ' + e.message, 'error');
    }
}

function showAdminMsg(msg, type) {
    const el = document.getElementById('adminMessage');
    el.textContent = msg;
    el.className = 'admin-msg ' + type;
    setTimeout(() => { el.className = 'admin-msg'; }, 5000);
}

// ============================================================
// Helpers
// ============================================================
function formatRole(role) {
    const map = {
        'BATSMAN': 'Batsman',
        'BOWLER': 'Bowler',
        'ALL_ROUNDER': 'All-Rounder',
        'WICKET_KEEPER': 'WK-Batsman'
    };
    return map[role] || role;
}
