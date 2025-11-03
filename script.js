document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const mainContent = document.getElementById('main-content');
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal');
    const chatbotBtn = document.getElementById('chatbot-btn');
    const supportBtn = document.getElementById('support-btn');

    const suggestedActivities = {
        1: { // Anxious
            exercises: ["Try a 2-minute deep breathing exercise.", "Let's do a quick guided meditation for calm."],
            games: ["Play the 'Zen Garden' game to relax.", "Try a slow-paced puzzle game."],
            content: ["Read a short, calming story.", "Listen to some soothing nature sounds."]
        },
        2: { // Sad
            exercises: ["A gentle stretching exercise might help.", "Let's try a mindful listening activity."],
            games: ["How about a creative coloring game?", "Let's build something in the 'Block Builder' game."],
            content: ["Watch a funny, short animation.", "Listen to an uplifting song."]
        },
        3: { // Neutral
            exercises: ["A great time to try a new yoga pose!", "Let's do a quick focus exercise."],
            games: ["Challenge yourself with a memory game.", "Try to beat your high score in 'Task Runner'."],
            content: ["Learn a fun new fact of the day.", "Explore a new topic in the learning center."]
        },
        4: { // Happy
            exercises: ["Let's do a fun dance-along video!", "Channel that energy with a quick workout."],
            games: ["Try a fast-paced action game!", "Let's play a collaborative game with a friend."],
            content: ["Create your own story in the story builder.", "Share your happiness with a friend or family member."]
        },
        5: { // Excited
            exercises: ["A high-energy workout is perfect right now!", "Let's try some jumping jacks to celebrate!"],
            games: ["Set a new record in our fastest game!", "Compete in the daily challenge!"],
            content: ["Write down what you're excited about!", "Listen to some energetic, happy music."]
        }
    };

    // --- Progress and Badge Logic ---
    const BADGE_CRITERIA = {
        'Early Bird': { description: 'Completed 5 tasks before 9 AM.', check: (progress) => progress.tasksCompletedEarly >= 5 },
        'Task Master': { description: 'Completed 10 tasks successfully.', check: (progress) => progress.tasksCompletedTotal >= 10 },
        'Zen Seeker': { description: 'Completed 5 Deep Breathing exercises.', check: (progress) => progress.deepBreathingCount >= 5 },
        'Daily User': { description: 'Used the app 7 days in a row.', check: (progress) => progress.consecutiveDays >= 7 },
        'Game Changer': { description: 'Played 3 games.', check: (progress) => progress.gamesPlayed >= 3 }
    };

    function getOrCreateProgress() {
        const defaultProgress = {
            tasksCompletedTotal: 0,
            tasksCompletedEarly: 0, // For 'Early Bird' badge
            deepBreathingCount: 0,
            meditationCount: 0,
            gamesPlayed: 0,
            badges: [],
            lastLogin: null,
            consecutiveDays: 0,
            usageHistory: [] // [{ date: 'YYYY-MM-DD', tasks: 5, completed: 3 }]
        };
        let progress = JSON.parse(localStorage.getItem('neuroNestProgress')) || defaultProgress;
        
        // Update usage history and consecutive days
        const today = new Date().toISOString().split('T')[0];
        if (progress.lastLogin !== today) {
            if (progress.lastLogin) {
                const lastLoginDate = new Date(progress.lastLogin);
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toISOString().split('T')[0];

                if (progress.lastLogin === yesterdayString) {
                    progress.consecutiveDays += 1;
                } else {
                    progress.consecutiveDays = 1;
                }
            } else {
                progress.consecutiveDays = 1;
            }
            progress.lastLogin = today;
        }

        // Ensure usageHistory has today's entry
        if (!progress.usageHistory.find(entry => entry.date === today)) {
            progress.usageHistory.push({ date: today, tasks: 0, completed: 0 });
        }

        saveProgress(progress);
        return progress;
    }

    function saveProgress(progress) {
        localStorage.setItem('neuroNestProgress', JSON.stringify(progress));
    }

    function checkAndAwardBadges(progress) {
        let awarded = false;
        for (const badgeName in BADGE_CRITERIA) {
            if (!progress.badges.includes(badgeName) && BADGE_CRITERIA[badgeName].check(progress)) {
                progress.badges.push(badgeName);
                awarded = true;
                console.log(`Badge awarded: ${badgeName}`);
                // Optionally show a notification/modal for the badge
            }
        }
        if (awarded) {
            saveProgress(progress);
        }
    }

    // Initialize progress on load
    getOrCreateProgress();


    const tabContent = {
        
        home: `
            <div class="tab-content" id="home">
    <div class="mood-tracker">
        <h2>How are you feeling today?</h2>
        <div class="mood-options">
            <div class="mood-option" data-mood="1">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crying-face">
                    <circle cx="12" cy="12" r="10"></circle>
                    
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                    
                    <path d="M9 10c0-1 1-2 3-2s3 1 3 2"></path>
                    
                    <path d="M8 14l1.5 5 1.5-5z" fill="currentColor" stroke="none" opacity="0.8"/>
                    
                    <path d="M16 14l-1.5 5-1.5-5z" fill="currentColor" stroke="none" opacity="0.8"/>
                </svg>
            </div>
                        
            <div class="mood-option" data-mood="2">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-frown">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                    <line x1="9" x2="9.01" y1="9" y2="9"></line>
                    <line x1="15" x2="15.01" y1="9" y2="9"></line>
                </svg>
            </div>
            
            <div class="mood-option" data-mood="3">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-meh"><circle cx="12" cy="12" r="10"></circle><line x1="8" x2="16" y1="15" y2="15"></line><line x1="9" x2="9.01" y1="9" y2="9"></line><line x1="15" x2="15.01" y1="9" y2="9"></line></svg>
                </div>
            
            <div class="mood-option" data-mood="4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smile"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" x2="9.01" y1="9" y2="9"></line><line x1="15" x2="15.01" y1="9" y2="9"></line></svg>
                </div>
            
            <div class="mood-option" data-mood="5">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-laugh"><circle cx="12" cy="12" r="10"></circle><path d="M12 18a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z"></path><line x1="9" x2="9.01" y1="9" y2="9"></line><line x1="15" x2="15.01" y1="9" y2="9"></line></svg>
                </div>
        </div>
        <div id="suggested-activities"></div>
    </div>
</div>
        `,
        tasks: `
            <div class="tab-content" id="tasks">
                <h2>Your Daily Adventures!</h2>
                <div class="task-input-area">
                    <input type="text" id="new-task-text" placeholder="What's your next adventure?" required>
                    <input type="time" id="new-task-time" required>
                    <button id="add-task-btn">Add Task</button>
                </div>
                <div class="task-list-container">
                    <h3>Today's Missions:</h3>
                    <ul id="task-list">
                        <!-- Tasks will be rendered here -->
                    </ul>
                </div>
            </div>
        `,
        games: `
            <div class="tab-content" id="games">
                <h2>Game Zone!</h2>
                <div class="game-menu">
                    <button class="game-btn active" data-game="calming">Calming Color Mixer</button>
                    <button class="game-btn" data-game="soothing">Soothing Doodle Pad</button>
                    <button class="game-btn" data-game="neuron">Happy Neuron (Quick Match)</button>
                </div>
                <div id="game-area">
                    <!-- Game content will be loaded here -->
                </div>
            </div>
        `,
        exercises: `
            <div class="tab-content" id="exercises">
                <h2>Mindful Moments</h2>
                <p>Let's take a deep breath and relax. These exercises will help you feel calm and focused.</p>
                <div class="exercise-activity" id="deep-breathing">
                    <h3>Deep Breathing</h3>
                    <p>A simple exercise to calm your mind and body.</p>
                    <button id="start-breathing-btn">Start Breathing</button>
                </div>
                <div class="exercise-activity" id="meditation">
                    <h3>Guided Meditation</h3>
                    <p>Relax and follow the guided meditation.</p>
                    <div class="meditation-controls">
                        <label for="meditation-duration">Duration (minutes):</label>
                        <input type="number" id="meditation-duration" value="5" min="1" max="60">
                        <button id="start-meditation-btn">Start Meditation</button>
                    </div>
                </div>
            </div>
        `,
        dashboard: `
            <div class="tab-content" id="dashboard">
                <h2>Your Progress Palace!</h2>
                <div class="dashboard-grid">
                    <div class="mascot-area">
                        <div id="mascot-image">
                            <!-- Cute little mascot SVG placeholder (Rabbit) -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rabbit">
                                <path d="M10 18a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1z"></path>
                                <path d="M12 2a4 4 0 0 0-4 4v2h8V6a4 4 0 0 0-4-4z"></path>
                                <path d="M18 10a6 6 0 0 0-12 0v4a6 6 0 0 0 12 0z"></path>
                                <path d="M15 14h-6"></path>
                                <path d="M12 18v4"></path>
                            </svg>
                        </div>
                        <p id="mascot-message">Welcome back! Let's check your progress.</p>
                    </div>
                    
                    <div class="progress-summary">
                        <h3>Overall Stats</h3>
                        <div id="progress-stats">
                            <!-- Stats will be rendered here -->
                        </div>
                    </div>

                    <div class="progress-chart-area">
                        <h3>Usage History (Last 7 Days)</h3>
                        <canvas id="usage-chart"></canvas>
                    </div>

                    <div class="badge-area">
                        <h3>Badges Won (<span id="badge-count">0</span>)</h3>
                        <div id="badges-container">
                            <!-- Badges will be rendered here -->
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    function switchTab(tab) {
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-tab="${tab}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        mainContent.innerHTML = tabContent[tab];
        const newContent = mainContent.querySelector('.tab-content');
        if (newContent) {
            setTimeout(() => {
                newContent.classList.add('active');
            }, 10);
        }
        if (tab === 'home') {
            addMoodTrackerListeners();
        } else if (tab === 'tasks') {
            initializeTaskTracker();
        } else if (tab === 'exercises') {
            initializeExerciseTab();
        } else if (tab === 'games') {
            initializeGamesTab();
        } else if (tab === 'dashboard') {
            initializeDashboard();
        }
    }

    // --- Dashboard Logic ---
    function initializeDashboard() {
        const progress = getOrCreateProgress();
        renderProgressStats(progress);
        renderBadges(progress);
        renderUsageChart(progress);
        updateMascotMessage(progress);
    }

    function updateMascotMessage(progress) {
        const mascotMessageEl = document.getElementById('mascot-message');
        if (!mascotMessageEl) return;

        let message = "Welcome back! Let's check your progress.";
        if (progress.consecutiveDays > 1) {
            message = `You've used NeuroNest for ${progress.consecutiveDays} days in a row! Keep it up!`;
        } else if (progress.badges.length > 0) {
            message = `Wow, you've earned ${progress.badges.length} badges! You're a star!`;
        } else if (progress.tasksCompletedTotal > 0) {
            message = `You've completed ${progress.tasksCompletedTotal} tasks so far. Amazing work!`;
        }
        mascotMessageEl.textContent = message;
    }

    function renderProgressStats(progress) {
        const statsContainer = document.getElementById('progress-stats');
        if (!statsContainer) return;

        const stats = [
            { label: 'Tasks Completed', value: progress.tasksCompletedTotal },
            { label: 'Consecutive Days', value: progress.consecutiveDays },
            { label: 'Deep Breathing', value: progress.deepBreathingCount },
            { label: 'Meditations', value: progress.meditationCount },
        ];

        statsContainer.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    }

    function renderBadges(progress) {
        const badgesContainer = document.getElementById('badges-container');
        const badgeCountEl = document.getElementById('badge-count');
        if (!badgesContainer || !badgeCountEl) return;

        badgeCountEl.textContent = progress.badges.length;

        const allBadges = Object.keys(BADGE_CRITERIA);
        
        badgesContainer.innerHTML = allBadges.map(badgeName => {
            const isWon = progress.badges.includes(badgeName);
            const description = BADGE_CRITERIA[badgeName].description;
            const icon = isWon ? '⭐' : '🔒'; // Simple icons

            return `
                <div class="badge-item ${isWon ? 'won' : ''}" title="${description}">
                    <span class="badge-icon">${icon}</span>
                    <span class="badge-name">${badgeName}</span>
                </div>
            `;
        }).join('');
    }

    function renderUsageChart(progress) {
        const ctx = document.getElementById('usage-chart');
        if (!ctx) return;

        // Prepare data for the last 7 days
        const history = progress.usageHistory.slice(-7);
        const labels = history.map(entry => {
            const date = new Date(entry.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        const data = history.map(entry => entry.tasks);
        const completedData = history.map(entry => entry.completed);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tasks Created',
                    data: data,
                    backgroundColor: 'rgba(137, 207, 240, 0.8)', // Primary color
                    borderColor: 'rgba(137, 207, 240, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Tasks'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
    }

    // --- Exercise Tab Logic ---
    function initializeExerciseTab() {
        const startBreathingBtn = document.getElementById('start-breathing-btn');
        const startMeditationBtn = document.getElementById('start-meditation-btn');

        if (startBreathingBtn) {
            startBreathingBtn.addEventListener('click', startDeepBreathing);
        }
        if (startMeditationBtn) {
            startMeditationBtn.addEventListener('click', startMeditation);
        }
    }

    // --- Games Tab Logic ---
    const gameContent = {
        calming: `
            <div class="game-container calming-mixer-game">
                <h3>Calming Color Mixer</h3>
                <p>Mix the sliders to create a perfect, calming color. Focus on the smooth transitions.</p>
                <div class="color-mixer-controls">
                    <label>Red: <input type="range" id="red-slider" min="0" max="255" value="137"></label>
                    <label>Green: <input type="range" id="green-slider" min="0" max="255" value="207"></label>
                    <label>Blue: <input type="range" id="blue-slider" min="0" max="255" value="240"></label>
                </div>
                <div id="color-display" class="color-display" style="background-color: rgb(137, 207, 240);"></div>
            </div>
        `,
        soothing: `
            <div class="game-container soothing-doodle-game">
                <h3>Soothing Doodle Pad</h3>
                <p>Draw simple, repetitive shapes or lines to soothe your mind. Press 'Clear' to start fresh.</p>
                <div class="doodle-controls">
                    <label for="doodle-color">Color:</label>
                    <input type="color" id="doodle-color" value="#89CFF0">
                    <label for="doodle-size">Size:</label>
                    <input type="range" id="doodle-size" min="1" max="20" value="5">
                    <button id="clear-doodle-btn">Clear</button>
                </div>
                <canvas id="doodle-canvas"></canvas>
            </div>
        `,
        neuron: `
            <div class="game-container quick-match-game">
                <h3>Happy Neuron: Quick Match</h3>
                <p>Test your attention and memory! Match the symbol shown in the center.</p>
                <div class="quick-match-area">
                    <div id="target-symbol" class="target-symbol">?</div>
                    <div id="match-options" class="match-options">
                        <!-- Options will be generated here -->
                    </div>
                    <div id="match-feedback" class="match-feedback"></div>
                    <button id="start-match-btn">Start Game</button>
                </div>
                <div class="match-stats">
                    <p>Score: <span id="match-score">0</span></p>
                    <p>Time Left: <span id="match-timer">30</span>s</p>
                </div>
            </div>
        `
    };

    function initializeGamesTab() {
        const gameArea = document.getElementById('game-area');
        const gameBtns = document.querySelectorAll('.game-btn');

        function loadGame(gameName) {
            gameArea.innerHTML = gameContent[gameName];
            gameBtns.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.game-btn[data-game="${gameName}"]`).classList.add('active');

            if (gameName === 'calming') {
                initializeColorMixer();
            } else if (gameName === 'soothing') {
                initializeDoodlePad();
            } else if (gameName === 'neuron') {
                initializeQuickMatch();
            }
        }

        gameBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                loadGame(e.target.dataset.game);
            });
        });

        // Load the default game (Calming Color Mixer)
        loadGame('calming');
    }

    // --- Game Logic Implementations ---
    function initializeQuickMatch() {
        const SYMBOLS = ['⭐', '🌈', '💡', '🚀', '🐢', '🌳', '💧', '🍎'];
        const GAME_DURATION = 30; // seconds

        let score = 0;
        let timeLeft = GAME_DURATION;
        let gameInterval;
        let currentTargetSymbol;

        const startBtn = document.getElementById('start-match-btn');
        const targetEl = document.getElementById('target-symbol');
        const optionsEl = document.getElementById('match-options');
        const feedbackEl = document.getElementById('match-feedback');
        const scoreEl = document.getElementById('match-score');
        const timerEl = document.getElementById('match-timer');

        function resetGame() {
            score = 0;
            timeLeft = GAME_DURATION;
            scoreEl.textContent = score;
            timerEl.textContent = timeLeft;
            feedbackEl.textContent = '';
            targetEl.textContent = '?';
            optionsEl.innerHTML = '';
            startBtn.style.display = 'block';
            optionsEl.removeEventListener('click', handleOptionClick);
        }

        function startGame() {
            startBtn.style.display = 'none';
            feedbackEl.textContent = '';
            score = 0;
            timeLeft = GAME_DURATION;
            scoreEl.textContent = score;
            timerEl.textContent = timeLeft;
            
            optionsEl.addEventListener('click', handleOptionClick);
            
            generateNewRound();
            
            clearInterval(gameInterval);
            gameInterval = setInterval(updateTimer, 1000);
        }

        function updateTimer() {
            timeLeft--;
            timerEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }

        function endGame() {
            clearInterval(gameInterval);
            feedbackEl.textContent = `Game Over! Final Score: ${score}`;
            targetEl.textContent = '🎉';
            startBtn.textContent = 'Play Again';
            startBtn.style.display = 'block';
            optionsEl.innerHTML = '';
            optionsEl.removeEventListener('click', handleOptionClick);
        }

        function generateNewRound() {
            // 1. Select 4 unique symbols for options
            const shuffledSymbols = [...SYMBOLS].sort(() => 0.5 - Math.random());
            const options = shuffledSymbols.slice(0, 4);

            // 2. Select one of the options as the target
            currentTargetSymbol = options[Math.floor(Math.random() * options.length)];

            // 3. Display target
            targetEl.textContent = currentTargetSymbol;

            // 4. Render options
            optionsEl.innerHTML = options.map(symbol =>
                `<button class="match-option-btn" data-symbol="${symbol}">${symbol}</button>`
            ).join('');
        }

        function handleOptionClick(e) {
            if (e.target.classList.contains('match-option-btn')) {
                const selectedSymbol = e.target.dataset.symbol;
                
                if (selectedSymbol === currentTargetSymbol) {
                    score++;
                    feedbackEl.textContent = 'Correct!';
                    scoreEl.textContent = score;
                    generateNewRound();
                } else {
                    feedbackEl.textContent = 'Oops! Try again.';
                    // Optional: penalize time or score
                }
            }
        }

        startBtn.addEventListener('click', startGame);
        resetGame(); // Initialize display
    }

    function initializeColorMixer() {
        const redSlider = document.getElementById('red-slider');
        const greenSlider = document.getElementById('green-slider');
        const blueSlider = document.getElementById('blue-slider');
        const colorDisplay = document.getElementById('color-display');

        function updateColor() {
            const r = redSlider.value;
            const g = greenSlider.value;
            const b = blueSlider.value;
            const color = `rgb(${r}, ${g}, ${b})`;
            colorDisplay.style.backgroundColor = color;
        }

        if (redSlider && greenSlider && blueSlider && colorDisplay) {
            redSlider.addEventListener('input', updateColor);
            greenSlider.addEventListener('input', updateColor);
            blueSlider.addEventListener('input', updateColor);
            
            // Initial color set based on default values in HTML template
            updateColor();
        }
    }

    function initializeDoodlePad() {
        const canvas = document.getElementById('doodle-canvas');
        const clearBtn = document.getElementById('clear-doodle-btn');
        const colorInput = document.getElementById('doodle-color');
        const sizeInput = document.getElementById('doodle-size');

        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // Set canvas size dynamically (e.g., 90% of container width, max 500px)
        const container = canvas.parentElement;
        const size = Math.min(container.clientWidth * 0.9, 500);
        canvas.width = size;
        canvas.height = size * 0.75; // Aspect ratio 4:3

        function draw(e) {
            if (!isDrawing) return;
            
            // Handle both mouse and touch events
            let clientX, clientY;
            if (e.touches) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            const rect = canvas.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = colorInput.value;
            ctx.lineWidth = sizeInput.value;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            [lastX, lastY] = [x, y];
        }

        function startDrawing(e) {
            isDrawing = true;
            
            let clientX, clientY;
            if (e.touches) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            const rect = canvas.getBoundingClientRect();
            [lastX, lastY] = [clientX - rect.left, clientY - rect.top];
            e.preventDefault(); // Prevent scrolling on touch devices
        }

        function stopDrawing() {
            isDrawing = false;
        }

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Mouse events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Touch events (for mobile/tablet)
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchcancel', stopDrawing);

        // Clear button
        clearBtn.addEventListener('click', clearCanvas);
    }

    function startDeepBreathing() {
        // NOTE: Audio files 'chime.mp3' and 'soft_tune.mp3' must be present in the root directory for audio to work.
        const chime = new Audio('chime.mp3');
        const softTune = new Audio('soft_tune.mp3');
        softTune.loop = true;
        
        const content = `
            <div class="activity-modal-content">
                <h3>Deep Breathing Exercise</h3>
                <div id="breathing-instructions" class="breathing-instruction">Get Ready...</div>
                <div id="breathing-visual" class="breathing-visual"></div>
                <div id="breathing-timer" class="activity-timer"></div>
                <button id="stop-breathing-btn" class="stop-activity-btn">Stop</button>
            </div>
        `;
        openModal(content);
        
        const instructionsEl = document.getElementById('breathing-instructions');
        const timerEl = document.getElementById('breathing-timer');
        const visualEl = document.getElementById('breathing-visual');
        const stopBtn = document.getElementById('stop-breathing-btn');
        
        let cycle = 0; // Tracks the current phase index
        let phaseTime = 0; // Tracks time within the current phase
        
        // Phases: [Instruction, Duration (seconds), Visual Class]
        const phases = [
            ['Breathe In...', 4, 'inhale'],
            ['Hold...', 2, 'hold'],
            ['Breathe Out...', 6, 'exhale'],
            ['Hold...', 2, 'hold']
        ];

        // Start background music
        softTune.play().catch(e => console.log("Soft tune playback failed:", e));

        function updateBreathing() {
            const [instruction, duration, visualClass] = phases[cycle % phases.length];
            
            if (phaseTime === 0) {
                // Start of a new phase
                instructionsEl.textContent = instruction;
                visualEl.className = `breathing-visual ${visualClass}`;
                phaseTime = duration;
                chime.play().catch(e => console.log("Chime playback failed:", e));
            }

            timerEl.textContent = `${phaseTime} seconds remaining`;
            
            phaseTime--;

            if (phaseTime < 0) {
                cycle++;
                phaseTime = 0; // Reset phaseTime to trigger new phase start on next tick
            }
        }

        const interval = setInterval(updateBreathing, 1000);
        updateBreathing(); // Initial call

        stopBtn.addEventListener('click', () => {
            clearInterval(interval);
            softTune.pause();
            softTune.currentTime = 0;
            
            // Track deep breathing completion (assuming stopping means completion for now)
            const progress = getOrCreateProgress();
            progress.deepBreathingCount += 1;
            checkAndAwardBadges(progress);
            saveProgress(progress);

            closeModal();
        });
    }

    function startMeditation() {
        const durationInput = document.getElementById('meditation-duration');
        const durationMinutes = parseInt(durationInput.value, 10);

        if (isNaN(durationMinutes) || durationMinutes <= 0) {
            alert('Please enter a valid meditation duration (1-60 minutes).');
            return;
        }

        const totalSeconds = durationMinutes * 60;

        const content = `
            <div class="activity-modal-content">
                <h3>Guided Meditation</h3>
                <p>Focus on your breath. Let your thoughts drift by.</p>
                <div id="meditation-timer-display">${durationMinutes}:00</div>
                <button id="stop-meditation-btn" class="stop-activity-btn">Stop</button>
            </div>
        `;
        openModal(content);

        const timerDisplay = document.getElementById('meditation-timer-display');
        const stopBtn = document.getElementById('stop-meditation-btn');
        let secondsRemaining = totalSeconds;
        let interval;

        function formatTime(totalSeconds) {
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }

        function updateMeditationTimer() {
            if (secondsRemaining <= 0) {
                clearInterval(interval);
                timerDisplay.textContent = "Meditation Complete!";
                
                // Track meditation completion
                const progress = getOrCreateProgress();
                progress.meditationCount += 1;
                checkAndAwardBadges(progress);
                saveProgress(progress);

                return;
            }

            secondsRemaining--;
            timerDisplay.textContent = formatTime(secondsRemaining);
        }

        interval = setInterval(updateMeditationTimer, 1000);

        stopBtn.addEventListener('click', () => {
            clearInterval(interval);
            closeModal();
        });
    }

    // --- Task Tracker Logic ---
    function initializeTaskTracker() {
        const addTaskBtn = document.getElementById('add-task-btn');
        addTaskBtn.addEventListener('click', addTask);
        renderTasks();
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('neuroNestTasks')) || [];
    }

    function saveTasks(tasks) {
        localStorage.setItem('neuroNestTasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        const taskList = document.getElementById('task-list');
        if (!taskList) return;

        const tasks = getTasks().sort((a, b) => (a.time > b.time) ? 1 : -1);
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<li class="empty-state">No missions scheduled! Add a new adventure above.</li>';
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input type="checkbox" id="task-${index}" ${task.completed ? 'checked' : ''} data-index="${index}">
                <label for="task-${index}">
                    <span class="task-time">${task.time}</span>
                    <span class="task-text">${task.text}</span>
                </label>
                <button class="delete-task-btn" data-index="${index}">🗑️</button>
            `;
            taskList.appendChild(li);
        });

        // Add event listeners for check/delete
        taskList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTaskCompletion);
        });
        taskList.querySelectorAll('.delete-task-btn').forEach(button => {
            button.addEventListener('click', deleteTask);
        });
    }

    function addTask() {
        const textInput = document.getElementById('new-task-text');
        const timeInput = document.getElementById('new-task-time');
        const text = textInput.value.trim();
        const time = timeInput.value;

        if (text === '' || time === '') {
            alert('Please enter both a task and a time.');
            return;
        }

        const tasks = getTasks();
        const newTask = { text, time, completed: false };
        tasks.push(newTask);
        saveTasks(tasks);

        scheduleNotification(newTask);

        textInput.value = '';
        timeInput.value = '';
        renderTasks();
    }

    function toggleTaskCompletion(e) {
        const index = e.target.dataset.index;
        const tasks = getTasks();
        const task = tasks[index];
        
        const isCompleted = e.target.checked;
        const wasCompleted = task.completed;
        
        task.completed = isCompleted;
        
        // Update progress tracking
        const progress = getOrCreateProgress();
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = progress.usageHistory.find(entry => entry.date === today);

        if (isCompleted && !wasCompleted) {
            // Task marked as completed
            progress.tasksCompletedTotal += 1;
            if (todayEntry) todayEntry.completed += 1;
            
            // Check for Early Bird (before 9 AM)
            const [hour] = task.time.split(':').map(Number);
            if (hour < 9) {
                progress.tasksCompletedEarly += 1;
            }
        } else if (!isCompleted && wasCompleted) {
            // Task marked as uncompleted
            progress.tasksCompletedTotal -= 1;
            if (todayEntry) todayEntry.completed -= 1;

            const [hour] = task.time.split(':').map(Number);
            if (hour < 9) {
                progress.tasksCompletedEarly -= 1;
            }
        }
        
        checkAndAwardBadges(progress);
        saveProgress(progress); // Save progress updates
        saveTasks(tasks);
        renderTasks();
    }

    function deleteTask(e) {
        const index = e.target.dataset.index;
        let tasks = getTasks();
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
    }

    function scheduleNotification(task) {
        if (!("Notification" in window)) {
            console.log("Browser does not support desktop notification.");
            return;
        }

        Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
                console.log("Notification permission denied.");
                return;
            }

            const [hour, minute] = task.time.split(':').map(Number);
            const now = new Date();
            const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
            
            // Set reminder 10 minutes before the task time
            reminderTime.setMinutes(reminderTime.getMinutes() - 10);

            const delay = reminderTime.getTime() - now.getTime();

            if (delay > 0) {
                setTimeout(() => {
                    new Notification('NeuroNest Reminder!', {
                        body: `Your mission "${task.text}" starts in 10 minutes!`,
                        icon: 'https://img.icons8.com/pastel-glyph/64/task--v1.png' // Placeholder icon
                    });
                }, delay);
            }
        });
    }

    // --- Mood Tracker Logic ---
    function addMoodTrackerListeners() {
        const moodOptions = document.querySelectorAll('.mood-option');
        const suggestedActivitiesContainer = document.getElementById('suggested-activities');
        moodOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Clear previous selections
                moodOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to the clicked icon
                option.classList.add('selected');

                const mood = option.getAttribute('data-mood');
                const activities = suggestedActivities[mood];
                
                // Get one random activity from each category
                const exercise = activities.exercises[Math.floor(Math.random() * activities.exercises.length)];
                const game = activities.games[Math.floor(Math.random() * activities.games.length)];
                const content = activities.content[Math.floor(Math.random() * activities.content.length)];

                // Generate HTML for the suggestions
                suggestedActivitiesContainer.innerHTML = `
                    <h4>Here are a few ideas for you:</h4>
                    <div class="recommendation-cards">
                        <div class="rec-card"><strong>Exercise:</strong> ${exercise}</div>
                        <div class="rec-card"><strong>Game:</strong> ${game}</div>
                        <div class="rec-card"><strong>Activity:</strong> ${content}</div>
                    </div>
                `;
            });
        });
    }

    function openModal(content) {
        modalBody.innerHTML = content;
        modalContainer.classList.remove('hidden');
    }

    function closeModal() {
        modalContainer.classList.add('hidden');
    }

    chatbotBtn.addEventListener('click', () => {
        openModal('<h3>Emotional AI Chatbot</h3><p>Hello! How can I help you today?</p>');
    });

    supportBtn.addEventListener('click', () => {
        openModal('<h3>NGO Support</h3><p>Here you can find resources and contact information for support organizations.</p>');
    });

    closeModalBtn.addEventListener('click', closeModal);
    switchTab('home');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    const contrastToggle = document.getElementById('contrast-toggle');
    contrastToggle.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });

    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});