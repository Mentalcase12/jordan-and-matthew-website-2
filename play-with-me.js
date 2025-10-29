// Quiz Questions Database
const quizQuestions = [
    {
        question: "What game did we first play together?",
        options: ["Roblox", "The Forest", "Sons of the Forest", "Minecraft"],
        correct: 0
    },
    {
        question: "What's my favorite thing about you?",
        options: ["Your smile", "Your laugh", "Your voice", "All of the above"],
        correct: 3
    },
    {
        question: "What do I always say before we go to sleep?",
        options: ["Good night", "Sweet dreams", "I love you", "Sleep well"],
        correct: 2
    },
    {
        question: "Which Roblox game do we play the most?",
        options: ["Grow a Garden", "Violence District", "Adopt Me", "Blox Fruits"],
        correct: 0
    },
    {
        question: "What makes me laugh the most?",
        options: ["Your jokes", "Your cute expressions", "Your funny noises", "When you get scared in games"],
        correct: 1
    },
    {
        question: "What's our favorite time to call?",
        options: ["Early morning", "Late at night", "Afternoon", "Evening"],
        correct: 1
    },
    {
        question: "What do I call you the most?",
        options: ["Baby", "Sweetie", "Honey", "Love"],
        correct: 0
    },
    {
        question: "What's my favorite emoji to send you?",
        options: ["♥", "🦋", "😊", "💝"],
        correct: 0
    },
    {
        question: "What game were we playing when we first said 'I love you'?",
        options: ["The Forest", "Roblox", "Sons of the Forest", "Minecraft"],
        correct: 1
    },
    {
        question: "What makes me feel the safest?",
        options: ["Your voice", "Your messages", "Falling asleep on call", "All of the above"],
        correct: 3
    }
];

// Memory Game Images (replace with your actual image paths)
const memoryImages = [
    'jordan photos for web/jordy 1.jpg',
    'jordan photos for web/jordy 2.jpg',
    'jordan photos for web/jordy 3.jpg',
    'jordan photos for web/jordy 4.jpg',
    'jordan photos for web/jordy 5.jpg',
    'jordan photos for web/jordy 6.jpg'
];

// Who Said It Quotes
const quotes = [
    { text: "i love you so much my baby mwah mwah", author: "Matthew" },
    { text: "you're such a cutie", author: "Jordan" },
    { text: "I seriously look forward to our calls all day", author: "Matthew" },
    { text: "you make everything feel okay", author: "Jordan" },
    { text: "i'm gonna hug you so tight", author: "Matthew" },
    { text: "you're my favorite person", author: "Jordan" },
    { text: "i feel so safe with you", author: "Jordan" },
    { text: "you mean everything to me", author: "Matthew" },
    { text: "can we play roblox?", author: "Jordan" },
    { text: "let's build a base together", author: "Matthew" },
    { text: "you're my peace", author: "Jordan" },
    { text: "i miss your voice", author: "Matthew" },
    { text: "one more game please", author: "Jordan" },
    { text: "sweet dreams my love", author: "Matthew" },
    { text: "you make me so happy", author: "Jordan" }
];

// Love Language Questions
const loveLanguageQuestions = [
    {
        question: "What makes you feel most loved?",
        options: [
            { text: "When we spend quality time together on call", type: "quality_time" },
            { text: "When I send you sweet messages", type: "words" },
            { text: "When I give you virtual gifts", type: "gifts" },
            { text: "When I'm there for you when you need support", type: "acts" }
        ]
    },
    {
        question: "What means the most to you?",
        options: [
            { text: "Having long, deep conversations", type: "quality_time" },
            { text: "Receiving thoughtful compliments", type: "words" },
            { text: "Getting surprise gifts in games", type: "gifts" },
            { text: "When I help you with game challenges", type: "acts" }
        ]
    },
    {
        question: "Which makes your day better?",
        options: [
            { text: "Playing games together for hours", type: "quality_time" },
            { text: "Reading my loving messages", type: "words" },
            { text: "Receiving a special gift in Roblox", type: "gifts" },
            { text: "When I stay up late to help you", type: "acts" }
        ]
    },
    {
        question: "What's your ideal way to spend time together?",
        options: [
            { text: "Just talking and sharing stories", type: "quality_time" },
            { text: "Expressing our feelings to each other", type: "words" },
            { text: "Exchanging virtual presents", type: "gifts" },
            { text: "Working on game projects together", type: "acts" }
        ]
    },
    {
        question: "What makes you feel most appreciated?",
        options: [
            { text: "When I give you my undivided attention", type: "quality_time" },
            { text: "When I tell you how special you are", type: "words" },
            { text: "When I save up to buy you something nice", type: "gifts" },
            { text: "When I go out of my way to help you", type: "acts" }
        ]
    },
    {
        question: "What's your favorite part of our relationship?",
        options: [
            { text: "Our daily calls and game sessions", type: "quality_time" },
            { text: "The sweet things we say to each other", type: "words" },
            { text: "Surprising each other with gifts", type: "gifts" },
            { text: "Supporting each other through everything", type: "acts" }
        ]
    },
    {
        question: "What makes you feel closest to me?",
        options: [
            { text: "When we stay up late together", type: "quality_time" },
            { text: "When I share my feelings about you", type: "words" },
            { text: "When I remember to get you things you like", type: "gifts" },
            { text: "When I make time for you no matter what", type: "acts" }
        ]
    },
    {
        question: "How do you prefer to receive love?",
        options: [
            { text: "Through dedicated time together", type: "quality_time" },
            { text: "Through heartfelt words", type: "words" },
            { text: "Through thoughtful presents", type: "gifts" },
            { text: "Through helpful actions", type: "acts" }
        ]
    }
];

// Quiz Game Logic
let currentQuestion = 0;
let score = 0;

function startQuiz() {
    if (!checkAuthentication()) return;
    currentQuestion = 0;
    score = 0;
    showQuestion();
    document.getElementById('quizStart').classList.remove('active');
    document.getElementById('quizQuestion').classList.add('active');
}

function showQuestion() {
    const question = quizQuestions[currentQuestion];
    document.getElementById('questionText').textContent = question.question;
    const optionsContainer = document.getElementById('answerOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(answer) {
    if (answer === quizQuestions[currentQuestion].correct) {
        score++;
    }
    
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('quizQuestion').classList.remove('active');
    document.getElementById('quizResult').classList.add('active');
    
    const percentage = (score / quizQuestions.length) * 100;
    document.getElementById('scoreText').textContent = `You got ${score} out of ${quizQuestions.length} correct! (${percentage}%)`;
    
    let message;
    if (percentage === 100) {
        message = "Perfect score! You know me so well! ♥";
    } else if (percentage >= 80) {
        message = "Amazing! You really pay attention to our relationship! 💕";
    } else if (percentage >= 60) {
        message = "Not bad! But maybe we should talk more? 😊";
    } else {
        message = "Looks like we have more to learn about each other! Let's spend more time together! 💝";
    }
    document.getElementById('loveMessage').textContent = message;
    
    // Update high score
    const currentHigh = parseInt(document.getElementById('quizHighScore').textContent);
    if (score > currentHigh) {
        document.getElementById('quizHighScore').textContent = score;
        // Update total games and save scores
        const totalGames = parseInt(document.getElementById('totalGames').textContent) + 1;
        document.getElementById('totalGames').textContent = totalGames;
        saveScores();
    }
}

function resetQuiz() {
    document.getElementById('quizResult').classList.remove('active');
    document.getElementById('quizStart').classList.add('active');
}

// Memory Game Logic
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStartTime = null;

function createMemoryGame() {
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    
    // Reset game state
    gameStartTime = null;
    
    // Create pairs of cards
    const cardPairs = [...memoryImages, ...memoryImages];
    shuffleArray(cardPairs);
    
    cardPairs.forEach((img, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.image = img;
        card.innerHTML = `
            <div class="front">♥</div>
            <div class="back" style="background-image: url('${img}')"></div>
        `;
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (!checkAuthentication()) return;
    if (flippedCards.length === 2) return;
    if (card.classList.contains('flipped')) return;
    
    // Start timer on first card flip
    if (!gameStartTime) {
        gameStartTime = Date.now();
    }
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moveCount').textContent = moves;
        
        if (flippedCards[0].dataset.image === flippedCards[1].dataset.image) {
            matchedPairs++;
            document.getElementById('pairCount').textContent = matchedPairs;
            flippedCards = [];
            
            if (matchedPairs === memoryImages.length) {
                const gameTime = Math.floor((Date.now() - gameStartTime) / 1000);
                const currentBest = document.getElementById('memoryBestTime').textContent;
                if (currentBest === '-' || gameTime < parseInt(currentBest)) {
                    document.getElementById('memoryBestTime').textContent = gameTime;
                }
                const totalGames = parseInt(document.getElementById('totalGames').textContent) + 1;
                document.getElementById('totalGames').textContent = totalGames;
                saveScores();
                setTimeout(() => alert(`You won in ${gameTime} seconds! 🎉`), 500);
            }
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => card.classList.remove('flipped'));
                flippedCards = [];
            }, 1000);
        }
    }
}

function restartMemory() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    document.getElementById('moveCount').textContent = '0';
    document.getElementById('pairCount').textContent = '0';
    createMemoryGame();
}

// Who Said It Game Logic
let currentQuote = null;
let whoSaidItScore = 0;

function showNewQuote() {
    currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quoteDisplay').textContent = currentQuote.text;
}

function guessQuote(guess) {
    if (!checkAuthentication()) return;
    if (guess === currentQuote.author) {
        whoSaidItScore++;
        document.getElementById('quoteScore').textContent = `Score: ${whoSaidItScore}`;
        saveScores();
    }
    showNewQuote();
}

// Love Language Test Logic
let currentLoveQuestion = 0;
const loveLanguageScores = {
    words: 0,
    acts: 0,
    gifts: 0,
    quality_time: 0,
    touch: 0
};

function showLoveQuestion() {
    const question = loveLanguageQuestions[currentLoveQuestion];
    const container = document.getElementById('questionContainer');
    container.innerHTML = `
        <h3>${question.question}</h3>
        ${question.options.map(option => `
            <div class="language-option" onclick="answerLoveQuestion('${option.type}')">
                ${option.text}
            </div>
        `).join('')}
    `;
}

function answerLoveQuestion(type) {
    if (!checkAuthentication()) return;
    loveLanguageScores[type]++;
    currentLoveQuestion++;
    
    if (currentLoveQuestion < loveLanguageQuestions.length) {
        showLoveQuestion();
    } else {
        showLoveResults();
    }
}

function showLoveResults() {
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';
    
    const results = Object.entries(loveLanguageScores)
        .sort(([,a], [,b]) => b - a)
        .map(([type, score]) => `${formatLoveLanguage(type)}: ${score}`);
        
    document.getElementById('languageResults').innerHTML = results.join('<br>');
}

function formatLoveLanguage(type) {
    return type.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function restartLoveTest() {
    currentLoveQuestion = 0;
    Object.keys(loveLanguageScores).forEach(key => loveLanguageScores[key] = 0);
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('resultContainer').style.display = 'none';
    showLoveQuestion();
}

// Utility Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Authentication Variables
const EXPECTED_NAMES = {
    player1: 'matthew',
    player2: 'jordan'
};

let isAuthenticated = false;

// Check if players are logged in
function checkAuthentication() {
    if (!isAuthenticated) {
        document.getElementById('loginMessage').textContent = 'Please log in first! ❤️';
        document.getElementById('loginSection').scrollIntoView({ behavior: 'smooth' });
        return false;
    }
    return true;
}

// Login function
function loginPlayers() {
    const player1 = document.getElementById('player1Name').value.trim().toLowerCase();
    const player2 = document.getElementById('player2Name').value.trim().toLowerCase();
    
    if (!player1 || !player2) {
        document.getElementById('loginMessage').textContent = 'Please enter both names! 💕';
        return;
    }
    
    if ((player1 === EXPECTED_NAMES.player1 && player2 === EXPECTED_NAMES.player2) ||
        (player1 === EXPECTED_NAMES.player2 && player2 === EXPECTED_NAMES.player1)) {
        isAuthenticated = true;
        document.getElementById('loginSection').style.display = 'none';
        document.querySelector('.games-container').style.display = 'grid';
        document.getElementById('scoreBoard').style.display = 'block';
        document.getElementById('playerNames').style.display = 'none';
        saveScores();
        loadScores();
    } else {
        document.getElementById('loginMessage').textContent = 'Oops! Those names don\'t match. This is our special place! 💝';
    }
}

// Save scores and names to localStorage
function saveScores() {
    const scores = {
        quizHighScore: document.getElementById('quizHighScore').textContent,
        whoSaidItScore: whoSaidItScore,
        memoryBestTime: document.getElementById('memoryBestTime').textContent,
        totalGames: document.getElementById('totalGames').textContent,
        player1Name: document.getElementById('player1Name').value,
        player2Name: document.getElementById('player2Name').value,
        quizScoreHolder: document.getElementById('quizHighScore').textContent === '0' ? '' : 
            document.getElementById('player1Name').value || 'Player 1',
        isAuthenticated: isAuthenticated
    };
    localStorage.setItem('gameScores', JSON.stringify(scores));
}

function saveNames() {
    saveScores();
    alert('Names saved! 💝');
}

// Load scores from localStorage
function loadScores() {
    const scores = JSON.parse(localStorage.getItem('gameScores')) || {
        quizHighScore: '0',
        whoSaidItScore: 0,
        memoryBestTime: '-',
        totalGames: '0',
        player1Name: '',
        player2Name: '',
        quizScoreHolder: '',
        isAuthenticated: false
    };
    
    isAuthenticated = scores.isAuthenticated || false;
    
    if (isAuthenticated) {
        document.getElementById('loginSection').style.display = 'none';
        document.querySelector('.games-container').style.display = 'grid';
        document.getElementById('scoreBoard').style.display = 'block';
        document.getElementById('playerNames').style.display = 'none';
    } else {
        document.getElementById('loginSection').style.display = 'block';
        document.querySelector('.games-container').style.display = 'none';
        document.getElementById('scoreBoard').style.display = 'none';
        document.getElementById('playerNames').style.display = 'none';
    }
    
    document.getElementById('quizHighScore').textContent = scores.quizHighScore;
    whoSaidItScore = scores.whoSaidItScore;
    document.getElementById('quoteScore').textContent = `Score: ${scores.whoSaidItScore}`;
    document.getElementById('memoryBestTime').textContent = scores.memoryBestTime;
    document.getElementById('totalGames').textContent = scores.totalGames;
    
    // Load saved names
    document.getElementById('player1Name').value = scores.player1Name || '';
    document.getElementById('player2Name').value = scores.player2Name || '';
    document.getElementById('quizScoreHolder').textContent = scores.quizScoreHolder ? 
        ` (held by ${scores.quizScoreHolder})` : '';
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadScores();
    createMemoryGame();
    showNewQuote();
    showLoveQuestion();
});