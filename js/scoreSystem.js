const ScoreSystem = {
    currentScore: 0,
    leaderboardKey: 'english_globe_leaderboard_v1',

    init() {
        this.currentScore = 0;
        this.updateScoreDisplay();
        this.loadLeaderboard();
    },

    addScore(points) {
        this.currentScore += points;
        this.updateScoreDisplay();
        this.animateScore();
    },

    resetScore() {
        this.currentScore = 0;
        this.updateScoreDisplay();
    },

    updateScoreDisplay() {
        const el = document.getElementById('current-score');
        if (el) el.textContent = this.currentScore;
    },

    animateScore() {
        const el = document.getElementById('score-display');
        if (el) {
            el.classList.remove('score-pop');
            void el.offsetWidth; // Trigger reflow
            el.classList.add('score-pop');
        }
    },

    /* --- Leaderboard Logic --- */

    showLeaderboard() {
        const modal = document.getElementById('leaderboard-modal');
        if (!modal) return;

        this.renderLeaderboardTable();
        modal.style.display = 'flex';

        // Animacion de entrada
        const content = modal.querySelector('.modal-content');
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';

        gsap.to(content, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    },

    closeLeaderboard() {
        const modal = document.getElementById('leaderboard-modal');
        if (modal) modal.style.display = 'none';
    },

    getLeaderboard() {
        const data = localStorage.getItem(this.leaderboardKey);
        return data ? JSON.parse(data) : [];
    },

    saveLeaderboard(data) {
        localStorage.setItem(this.leaderboardKey, JSON.stringify(data));
    },

    saveCurrentScore() {
        const nameInput = document.getElementById('player-name-input');
        const name = nameInput.value.trim() || 'Anonymous';

        if (this.currentScore === 0) {
            alert("Play a game first to earn points!");
            return;
        }

        const newEntry = {
            name: name,
            score: this.currentScore,
            date: new Date().toLocaleDateString()
        };

        let leaderboard = this.getLeaderboard();
        leaderboard.push(newEntry);

        // Sort by score desc
        leaderboard.sort((a, b) => b.score - a.score);

        // Keep top 10
        leaderboard = leaderboard.slice(0, 10);

        this.saveLeaderboard(leaderboard);
        this.renderLeaderboardTable();

        // Disable save button to prevent duplicates for same session or show success
        const btn = document.querySelector('.save-btn');
        const originalText = btn.textContent;
        btn.textContent = "Saved!";
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
    },

    renderLeaderboardTable() {
        const list = document.getElementById('leaderboard-list');
        if (!list) return;

        const leaderboard = this.getLeaderboard();
        list.innerHTML = leaderboard.map((entry, index) => {
            let rankClass = '';
            let rankIcon = index + 1;

            if (index === 0) { rankClass = 'rank-1'; rankIcon = '🥇'; }
            if (index === 1) { rankClass = 'rank-2'; rankIcon = '🥈'; }
            if (index === 2) { rankClass = 'rank-3'; rankIcon = '🥉'; }

            return `
                <tr>
                    <td class="${rankClass}">${rankIcon}</td>
                    <td class="${rankClass}">${entry.name}</td>
                    <td class="${rankClass}">${entry.score}</td>
                    <td>${entry.date}</td>
                </tr>
            `;
        }).join('');

        if (leaderboard.length === 0) {
            list.innerHTML = '<tr><td colspan="4" style="text-align:center; opacity:0.7;">No records yet. Be the first!</td></tr>';
        }
    },

    loadLeaderboard() {
        // Just ensures data is loadable on init, maybe log it
        console.log("Leaderboard loaded", this.getLeaderboard());
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    ScoreSystem.init();
});
