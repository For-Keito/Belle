// Particle Background Animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 40;
    const particles = ['🌷', '✨', '🌹', '💕', '📚', '👑'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.fontSize = Math.random() * 15 + 12 + 'px';
        particle.style.animation = `float ${Math.random() * 3 + 2}s infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    window.scrollTo(0, 0);
}

function startJourney() {
    showScreen('game1Screen');
}

function nextScreen() {
    const currentScreen = document.querySelector('.screen.active').id;
    
    if (currentScreen === 'game1Screen') {
        showScreen('game2Screen');
        initMemoryGame();
    } else if (currentScreen === 'game2Screen') {
        showScreen('game3Screen');
    } else if (currentScreen === 'game3Screen') {
        showScreen('messageScreen');
    }
}

function goBack() {
    showScreen('welcomeScreen');
}

// Game 1: Quiz
function checkAnswer1(index) {
    const choices = document.querySelectorAll('.choice');
    
    choices.forEach(choice => {
        choice.classList.remove('correct', 'incorrect');
        choice.disabled = true;
    });

    if (index === 0) {
        choices[0].classList.add('correct');
        setTimeout(() => {
            showScreen('game2Screen');
            initMemoryGame();
        }, 1500);
    } else {
        choices[index].classList.add('incorrect');
        choices[0].classList.add('correct');
        setTimeout(() => {
            showScreen('game2Screen');
            initMemoryGame();
        }, 2000);
    }
}

// Game 2: Memory Game
const memoryCards = ['🌷', '📚', '💕', '👑', '🌷', '📚', '💕', '👑'];
let flipped = [];
let matched = [];

function initMemoryGame() {
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    flipped = [];
    matched = [];

    const shuffled = [...memoryCards].sort(() => Math.random() - 0.5);

    shuffled.forEach((emoji, index) => {
        const card = document.createElement('button');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.textContent = '?';
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (flipped.includes(card) || matched.includes(card.dataset.index)) return;

    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    flipped.push(card);

    if (flipped.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flipped;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matched.push(card1.dataset.index, card2.dataset.index);
        flipped = [];

        if (matched.length === memoryCards.length) {
            setTimeout(() => {
                alert('🎉 Perfect! You\'ve unlocked the next chapter!');
                nextScreen();
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '?';
            card2.textContent = '?';
            flipped = [];
        }, 1000);
    }
}

function resetMemory() {
    initMemoryGame();
}

// Game 3: Drag and Drop
const draggables = document.querySelectorAll('.draggable');
const targetBox = document.getElementById('targetBox');

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.textContent);
    });
});

targetBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    targetBox.style.backgroundColor = 'rgba(212, 175, 55, 0.4)';
});

targetBox.addEventListener('dragleave', () => {
    targetBox.style.backgroundColor = 'rgba(255, 250, 205, 0.5)';
});

targetBox.addEventListener('drop', (e) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    
    // Create a tag for dropped item
    const tag = document.createElement('span');
    tag.style.backgroundColor = '#90EE90';
    tag.style.padding = '8px 12px';
    tag.style.borderRadius = '5px';
    tag.style.color = '#333';
    tag.style.fontWeight = '600';
    tag.style.border = '2px solid #228B22';
    tag.textContent = text;
    
    targetBox.appendChild(tag);
    
    // Mark as placed
    draggables.forEach(d => {
        if (d.textContent === text) {
            d.classList.add('placed');
            d.style.pointerEvents = 'none';
        }
    });

    // Check if all items are placed
    if (targetBox.children.length >= 3) {
        setTimeout(() => {
            alert('💕 Beautiful! The moment of truth awaits...');
            nextScreen();
        }, 500);
    }

    targetBox.style.backgroundColor = 'rgba(255, 250, 205, 0.5)';
});

// Share Message
function shareMessage() {
    const text = "She created this beautiful Belle-inspired confession website for me... 🌷✨";
    if (navigator.share) {
        navigator.share({
            title: 'Tale As Old As Time',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Share failed:', err));
    } else {
        alert('Share this URL to your loved ones! 💕\n' + window.location.href);
    }
}

// Initialize particles on load
window.addEventListener('load', () => {
    createParticles();
});

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';
