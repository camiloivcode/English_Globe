// Sistema de Juegos
const GameSystem = {
	memoryState: {
		cards: [],
		flipped: [],
		matched: [],
		moves: 0,
		lock: false
	},
	flagGameState: {
		currentCountry: null,
		score: 0,
		round: 0,
		totalRounds: 5,
		usedCountries: [],
		timer: null
	},

	// --- MEMORY GAME ---
	startMemoryGame() {
		// Preparar cartas: 8 países y 8 capitales
		const countries = window.englishSpeakingCountries;
		const cards = [];
		countries.forEach(c => {
			cards.push({ type: 'country', value: c.name, pair: c.capital, id: c.name });
			cards.push({ type: 'capital', value: c.capital, pair: c.name, id: c.name });
		});

		this.memoryState.cards = this.shuffle(cards);
		this.memoryState.flipped = [];
		this.memoryState.matched = [];
		this.memoryState.moves = 0;
		this.memoryState.lock = false;
		this.renderMemoryGame();
		this.openGameModal();
	},

	shuffle(arr) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	},

	renderMemoryGame() {
		const modal = document.getElementById('game-modal');
		// Usar display flex en cards y justify-content center como solicitó el usuario
		modal.innerHTML = `
            <div class="game-content">
                <div class="game-header">
                    <h2>🃏 Memory Challenge</h2>
                    <div class="game-score-info">Moves: <span id="memory-moves">${this.memoryState.moves}</span></div>
                    <button class="close-btn" onclick="GameSystem.closeGameModal()">×</button>
                </div>
                
                <div class="memory-board">
                    ${this.memoryState.cards.map((card, idx) => {
			const flipped = this.memoryState.flipped.includes(idx) || this.memoryState.matched.includes(idx);
			return `<div class="memory-card${flipped ? ' flipped' : ''}" data-idx="${idx}" onclick="GameSystem.flipMemoryCard(${idx})">
                            <div class="card-inner">
                                <div class="card-front"></div>
                                <div class="card-back">${card.value}</div>
                            </div>
                        </div>`;
		}).join('')}
                </div>
            </div>
		`;
		modal.style.display = 'flex';
	},

	flipMemoryCard(idx) {
		if (this.memoryState.lock || this.memoryState.flipped.includes(idx) || this.memoryState.matched.includes(idx)) return;
		this.memoryState.flipped.push(idx);
		this.renderMemoryGame();

		if (this.memoryState.flipped.length === 2) {
			this.memoryState.lock = true;
			setTimeout(() => {
				this.checkMemoryMatch();
			}, 800);
		}
	},

	checkMemoryMatch() {
		const [i1, i2] = this.memoryState.flipped;
		const c1 = this.memoryState.cards[i1];
		const c2 = this.memoryState.cards[i2];
		this.memoryState.moves++;

		if (c1.id === c2.id) {
			// Match
			this.memoryState.matched.push(i1, i2);
			this.memoryState.flipped = [];
			this.memoryState.lock = false;
			this.playSound('success');
			this.renderMemoryGame();

			// Add small score for each match
			if (window.ScoreSystem) window.ScoreSystem.addScore(10);

			if (this.memoryState.matched.length === this.memoryState.cards.length) {
				setTimeout(() => this.memoryGameOver(), 600);
			}
		} else {
			// No match
			this.playSound('error');
			setTimeout(() => {
				this.memoryState.flipped = [];
				this.memoryState.lock = false;
				this.renderMemoryGame();
			}, 700);
		}
		document.getElementById('memory-moves').textContent = this.memoryState.moves;
	},

	memoryGameOver() {
		// Bonus calculation
		const bonus = Math.max(0, 100 - this.memoryState.moves * 2);
		if (window.ScoreSystem) window.ScoreSystem.addScore(bonus);

		const modal = document.getElementById('game-modal');
		modal.innerHTML = `
            <div class="game-content">
                <div class="game-over-screen">
                    <h2 class="game-over-title">Mission Accomplished!</h2>
                    <p>Total Moves: ${this.memoryState.moves}</p>
                    <div class="final-score">+${bonus} Bonus Points</div>
                    
                    <div class="game-over-actions">
                        <button class="action-btn btn-primary" onclick="GameSystem.startMemoryGame()">Play Again</button>
                        <button class="action-btn btn-secondary" onclick="GameSystem.closeGameModal()">Close</button>
                    </div>
                </div>
            </div>
		`;
	},

	// --- GUESS THE FLAG GAME ---
	startGuessTheFlag() {
		this.flagGameState.score = 0;
		this.flagGameState.round = 0;
		this.flagGameState.usedCountries = [];
		this.nextFlagRound();
		this.openGameModal();
	},

	nextFlagRound() {
		if (this.flagGameState.round >= this.flagGameState.totalRounds) {
			this.flagGameOver();
			return;
		}

		const countries = window.englishSpeakingCountries;
		let available = countries.filter(c => !this.flagGameState.usedCountries.includes(c.name));

		if (available.length === 0) {
			// Reset if run out of countries (unlikely with 5 rounds and 8 countries but safe)
			this.flagGameState.usedCountries = [];
			available = countries;
		}

		const country = available[Math.floor(Math.random() * available.length)];
		this.flagGameState.currentCountry = country;
		this.flagGameState.usedCountries.push(country.name);
		this.flagGameState.round++;

		this.renderFlagGame();
	},

	renderFlagGame() {
		const modal = document.getElementById('game-modal');
		const country = this.flagGameState.currentCountry;

		modal.innerHTML = `
            <div class="game-content">
                <div class="game-header">
                    <h2>🚩 Guess the Flag</h2>
                    <div class="game-score-info">Round: ${this.flagGameState.round}/${this.flagGameState.totalRounds}</div>
                    <button class="close-btn" onclick="GameSystem.closeGameModal()">×</button>
                </div>

                <div class="flag-game-container">
                    <div class="flag-display">${country.flag}</div>
                    
                    <div class="input-area">
                        <input type="text" id="flag-input" class="flag-input" placeholder="Type country name..." autocomplete="off">
                        <div id="flag-feedback" class="feedback-msg"></div>
                    </div>

                    <button class="skip-btn" onclick="GameSystem.checkFlagAnswer(true)">Skip / Give Up</button>
                </div>
            </div>
        `;
		modal.style.display = 'flex';

		// Auto focus input
		setTimeout(() => document.getElementById('flag-input')?.focus(), 100);

		// Listen for Enter key
		document.getElementById('flag-input').addEventListener('keypress', (e) => {
			if (e.key === 'Enter') this.checkFlagAnswer();
		});
	},

	checkFlagAnswer(giveUp = false) {
		const inputMap = document.getElementById('flag-input');
		const feedback = document.getElementById('flag-feedback');
		const userAnswer = inputMap.value.trim().toLowerCase();
		const correctName = this.flagGameState.currentCountry.name;
		// Simple logic for loosely matching (e.g. checking if user string is contained or exact match)
		// For strictness, let's allow exact match case insensitive
		const isCorrect = userAnswer === correctName.toLowerCase();

		if (giveUp) {
			feedback.innerHTML = `<span class="feedback-wrong">The answer was: ${correctName}</span>`;
			this.playSound('error');
			setTimeout(() => this.nextFlagRound(), 2000);
			return;
		}

		if (isCorrect) {
			inputMap.classList.add('correct');
			feedback.innerHTML = `<span class="feedback-correct">Correct! Well done!</span>`;
			this.playSound('success');

			// Points
			const points = 50; // Fixed points for correct answer
			this.flagGameState.score += points;
			if (window.ScoreSystem) window.ScoreSystem.addScore(points);

			setTimeout(() => this.nextFlagRound(), 1500);
		} else {
			inputMap.classList.add('wrong');
			feedback.innerHTML = `<span class="feedback-wrong">Try again!</span>`;
			this.playSound('error');

			setTimeout(() => {
				inputMap.classList.remove('wrong');
				feedback.innerHTML = '';
			}, 1000);
		}
	},

	flagGameOver() {
		const modal = document.getElementById('game-modal');
		modal.innerHTML = `
            <div class="game-content">
                <div class="game-over-screen">
                    <h2 class="game-over-title">Game Finished!</h2>
                    <p>You completed ${this.flagGameState.totalRounds} rounds.</p>
                    <div class="final-score">Score: ${this.flagGameState.score}</div>
                    
                    <div class="game-over-actions">
                        <button class="action-btn btn-primary" onclick="GameSystem.startGuessTheFlag()">Play Again</button>
                        <button class="action-btn btn-secondary" onclick="GameSystem.closeGameModal()">Close</button>
                    </div>
                </div>
            </div>
		`;
	},

	// --- UTILS ---
	openGameModal() {
		document.getElementById('game-modal').style.display = 'flex';
	},
	closeGameModal() {
		document.getElementById('game-modal').style.display = 'none';
	},

	// Simple synth sounds so we don't need external assets
	playSound(type) {
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		if (!AudioContext) return;

		const ctx = new AudioContext();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.connect(gain);
		gain.connect(ctx.destination);

		if (type === 'success') {
			osc.type = 'sine';
			osc.frequency.setValueAtTime(500, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
			gain.gain.setValueAtTime(0.3, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
			osc.start();
			osc.stop(ctx.currentTime + 0.5);
		} else if (type === 'error') {
			osc.type = 'sawtooth';
			osc.frequency.setValueAtTime(200, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
			gain.gain.setValueAtTime(0.3, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
			osc.start();
			osc.stop(ctx.currentTime + 0.4);
		}
	}
};
