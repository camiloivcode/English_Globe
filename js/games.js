// Sistema de Juegos
const GameSystem = {
	memoryState: {
		cards: [],
		flipped: [],
		matched: [],
		moves: 0,
		lock: false
	},

	startMemoryGame() {
		// Preparar cartas: 8 países y 8 capitales
		const countries = window.englishSpeakingCountries;
		const cards = [];
		countries.forEach(c => {
			cards.push({ type: 'country', value: c.name, pair: c.capital });
			cards.push({ type: 'capital', value: c.capital, pair: c.name });
		});
		// Mezclar cartas
		this.memoryState.cards = this.shuffle(cards);
		this.memoryState.flipped = [];
		this.memoryState.matched = [];
		this.memoryState.moves = 0;
		this.memoryState.lock = false;
		this.renderMemoryGame();
		this.openGameModal();
	},

	shuffle(arr) {
		// Fisher-Yates
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	},

	renderMemoryGame() {
		const modal = document.getElementById('game-modal');
		modal.innerHTML = `
			<div class="memory-header">
				<h2>🃏 Memory Game: Match Country & Capital</h2>
				<button class="close-btn" onclick="GameSystem.closeGameModal()">×</button>
				<div class="memory-moves">Moves: <span id="memory-moves">${this.memoryState.moves}</span></div>
			</div>
			<div class="memory-board">
				${this.memoryState.cards.map((card, idx) => {
					const flipped = this.memoryState.flipped.includes(idx) || this.memoryState.matched.includes(idx);
					return `<div class="memory-card${flipped ? ' flipped' : ''}" data-idx="${idx}" onclick="GameSystem.flipMemoryCard(${idx})">
						<div class="card-inner">
							<div class="card-front"></div>
							<div class="card-back">${flipped ? card.value : ''}</div>
						</div>
					</div>`;
				}).join('')}
			</div>
			<div class="memory-footer">
				<button onclick="GameSystem.closeGameModal()">Exit</button>
			</div>
		`;
		modal.style.display = 'block';
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
		if ((c1.type !== c2.type) && (c1.value === c2.pair)) {
			// Match
			this.memoryState.matched.push(i1, i2);
			this.memoryState.flipped = [];
			this.memoryState.lock = false;
			this.renderMemoryGame();
			if (this.memoryState.matched.length === this.memoryState.cards.length) {
				setTimeout(() => this.memoryGameOver(), 600);
			}
		} else {
			// No match
			setTimeout(() => {
				this.memoryState.flipped = [];
				this.memoryState.lock = false;
				this.renderMemoryGame();
			}, 700);
		}
		document.getElementById('memory-moves').textContent = this.memoryState.moves;
	},

	memoryGameOver() {
		// Puntos: 100 - (movimientos × 2)
		const points = Math.max(10, 100 - this.memoryState.moves * 2);
		const modal = document.getElementById('game-modal');
		modal.innerHTML = `
			<div class="memory-header">
				<h2>¡Ganaste!</h2>
				<p>Movimientos: ${this.memoryState.moves}</p>
				<p>Puntos: ${points}</p>
			</div>
			<div class="memory-footer">
				<button onclick="GameSystem.closeGameModal()">Cerrar</button>
			</div>
		`;
		if (window.ScoreSystem && typeof window.ScoreSystem.addScore === 'function') {
			window.ScoreSystem.addScore(points);
		}
	},

	openGameModal() {
		document.getElementById('game-modal').style.display = 'block';
	},
	closeGameModal() {
		document.getElementById('game-modal').style.display = 'none';
	}
};
