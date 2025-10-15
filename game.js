class FlagMatcher {
    constructor() {
        this.countries = [];
        this.activeFlags = [];
        this.currentAnswers = [];
        this.correctCountry = null;
        this.lastSpawnTime = 0;
        this.animationId = null;
        this.currentFlagId = null;
        this.isPlaying = false;

        this.intro = document.getElementById('intro');
        this.gameArea = document.getElementById('gameCanvas');
        this.gameContainer = document.getElementById('gameContainer');

        this.init();
    }

    async init() {
        // Show intro screen first
        this.showIntro();

        // Preload country data in background
        this.countries = await this.loadCountryData();

        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('restartButton').addEventListener('click', () => this.restartGame());
    }

    showIntro() {
        this.intro.classList.remove('hidden');
        this.gameContainer.classList.add('hidden');
    }

    hideIntro() {
        this.intro.classList.add('hidden');
        this.gameContainer.classList.remove('hidden');
    }

    async loadCountryData() {
        try {
            const response = await fetch('/data/countries.json');
            if (!response.ok) {
                throw new Error(`Failed to load country data: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading country data:', error);
            return [];
        }
    }

    startGame() {
        if (this.countries.length === 0) {
            alert('Error: Could not load country data. Please refresh the page.');
            return;
        }

        this.hideIntro();
        this.isPlaying = true;

        this.score = 0;
        this.lives = 3;
        this.baseSpeed = 1;
        this.spawnRate = 2000;
        this.spawnRateMax = 3000;
        this.isGameOver = false;
        this.activeFlags = [];
        this.currentFlagId = null;
        this.correctCountry = null;
        this.gameArea.innerHTML = '';

        this.updateUI();
        document.getElementById('gameOver').classList.add('hidden');
        document.getElementById('answers').innerHTML = '';

        // Start spawning immediately
        this.lastSpawnTime = Date.now() - this.spawnRate; // Force immediate spawn
        this.gameLoop();
    }

    gameLoop() {
        if (this.isGameOver || !this.isPlaying) return;

        const currentTime = Date.now();

        // Spawn new flags only if we don't have too many active
        if (currentTime - this.lastSpawnTime > this.spawnRate && this.activeFlags.length < 5) {
            this.spawnFlag();
            this.lastSpawnTime = currentTime;
        }

        this.updateFlags();

        // Update which flag we should be answering (the one closest to bottom)
        this.updateCurrentFlag();

        // Gradual difficulty increase
        this.baseSpeed = 1 + (this.score * 0.005);
        this.spawnRate = Math.max(1200, this.spawnRateMax - (this.score * 15));

        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    spawnFlag() {
        const randomCountry = this.countries[Math.floor(Math.random() * this.countries.length)];
        const flagId = Date.now() + Math.random();

        const flagElement = document.createElement('div');
        flagElement.className = 'falling-flag';
        flagElement.innerHTML = `<img src="https://raw.githubusercontent.com/lipis/flag-icons/refs/heads/main/flags/1x1/${randomCountry.code}.svg" alt="${randomCountry.name}">`;

        const leftPos = Math.random() * (this.gameArea.offsetWidth - 80);
        flagElement.style.left = leftPos + 'px';
        flagElement.style.top = '-60px';

        this.gameArea.appendChild(flagElement);
        this.activeFlags.push({
            element: flagElement,
            country: randomCountry,
            speed: this.baseSpeed,
            position: -60,
            id: flagId
        });
    }

    updateCurrentFlag() {
        // Find the flag that's closest to the bottom (highest position value)
        if (this.activeFlags.length > 0) {
            let closestToBottom = this.activeFlags[0];

            for (let i = 1; i < this.activeFlags.length; i++) {
                if (this.activeFlags[i].position > closestToBottom.position) {
                    closestToBottom = this.activeFlags[i];
                }
            }

            // Only update answers if we have a new current flag
            if (!this.currentFlagId || this.currentFlagId !== closestToBottom.id) {
                this.currentFlagId = closestToBottom.id;
                this.generateAnswers(closestToBottom.country, closestToBottom.id);
            }
        } else {
            // No flags left, clear answers
            this.currentFlagId = null;
            this.correctCountry = null;
            document.getElementById('answers').innerHTML = '';
        }
    }

    generateAnswers(correctCountry, flagId) {
        // Only update answers if this is still the current flag we want to show
        if (flagId !== this.currentFlagId) return;

        this.correctCountry = correctCountry;

        const wrongAnswers = [];
        const usedCodes = new Set([correctCountry.code]);

        while (wrongAnswers.length < 3) {
            const randomCountry = this.countries[Math.floor(Math.random() * this.countries.length)];
            if (!usedCodes.has(randomCountry.code)) {
                wrongAnswers.push(randomCountry);
                usedCodes.add(randomCountry.code);
            }
        }

        this.currentAnswers = [correctCountry, ...wrongAnswers]
            .sort(() => Math.random() - 0.5);

        this.displayAnswers();
    }

    displayAnswers() {
        const answersContainer = document.getElementById('answers');
        answersContainer.innerHTML = '';

        this.currentAnswers.forEach(country => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = country.name;
            button.addEventListener('click', () => this.checkAnswer(country));
            answersContainer.appendChild(button);
        });
    }

    checkAnswer(selectedCountry) {
        if (this.isGameOver || !this.correctCountry) return;

        const isCorrect = selectedCountry.code === this.correctCountry.code;

        if (isCorrect) {
            this.score += 10;
            this.removeActiveFlag(this.correctCountry.code);
            this.highlightAnswer(true, selectedCountry);
        } else {
            this.lives--;
            this.highlightAnswer(false, selectedCountry);
        }

        this.updateUI();

        if (this.lives <= 0) {
            this.endGame();
        }
    }

    highlightAnswer(isCorrect, selectedCountry) {
        const buttons = document.querySelectorAll('.answer-btn');

        if (isCorrect) {
            // Only highlight the clicked correct answer in green
            buttons.forEach(button => {
                if (button.textContent === selectedCountry.name) {
                    button.classList.add('correct');
                }
            });
        } else {
            // Only highlight the wrong answer in red
            buttons.forEach(button => {
                if (button.textContent === selectedCountry.name) {
                    button.classList.add('wrong');
                }
            });
        }

        // Clear highlights after a short time
        setTimeout(() => {
            buttons.forEach(button => {
                button.classList.remove('correct', 'wrong');
            });
        }, 800);
    }

    removeActiveFlag(countryCode) {
        const flagIndex = this.activeFlags.findIndex(flag => flag.country.code === countryCode);
        if (flagIndex > -1) {
            this.gameArea.removeChild(this.activeFlags[flagIndex].element);
            this.activeFlags.splice(flagIndex, 1);

            // After removing a flag, we need to update which flag is current
            this.updateCurrentFlag();
        }
    }

    updateFlags() {
        const gameHeight = this.gameArea.offsetHeight;

        for (let i = this.activeFlags.length - 1; i >= 0; i--) {
            const flag = this.activeFlags[i];

            flag.position += flag.speed;
            flag.element.style.top = flag.position + 'px';

            if (flag.position > gameHeight) {
                this.lives--;
                this.updateUI();
                this.gameArea.removeChild(flag.element);
                this.activeFlags.splice(i, 1);

                if (this.lives <= 0) {
                    this.endGame();
                    return;
                }
            }
        }
    }

    updateUI() {
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('livesValue').textContent = this.lives;
    }

    endGame() {
        this.isGameOver = true;
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.remove('hidden');

        this.activeFlags.forEach(flag => {
            if (flag.element.parentNode) {
                this.gameArea.removeChild(flag.element);
            }
        });
        this.activeFlags = [];
        this.correctCountry = null;
        this.currentFlagId = null;
    }

    restartGame() {
        this.startGame();
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new FlagMatcher();
});