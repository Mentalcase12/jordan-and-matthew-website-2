// --- Get references to all interactive elements ---
const splash = document.getElementById('splash');
const mainContent = document.getElementById('mainContent');
const enterBtn = document.getElementById('enterBtn');
const peekBtn = document.getElementById('peekBtn');
const muteMusic = document.getElementById('muteMusic');
const bgMusic = document.getElementById('bgMusic');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

const msgInput = document.getElementById('msg');
const postBtn = document.getElementById('postMsg');
const clearBtn = document.getElementById('clearMsg');
const board = document.getElementById('board');

const memoryInput = document.getElementById('memoryInput');
const addMemoryBtn = document.getElementById('addMemory');
const timelineList = document.getElementById('timelineList');

const meetDateInput = document.getElementById('meetDate');
const countdownDisplay = document.getElementById('countdown');

const bucketListContainer = document.getElementById('bucketListContainer');
const bucketListItemInput = document.getElementById('bucketListItemInput');
const addBucketListItemBtn = document.getElementById('addBucketListItemBtn');

const editLettersBtn = document.getElementById('editLetters'); // For enabling/disabling
const editBtn = document.getElementById('editLetters'); // Alias for consistency in edit logic
const editorArea = document.getElementById('editorArea');
const letterEdit = document.getElementById('letterEdit');
const letters = document.getElementById('letters');
const saveLetterBtn = document.getElementById('saveLetter'); // Explicitly get save/cancel
const cancelEditBtn = document.getElementById('cancelEdit');

const surpriseBtn = document.getElementById('surpriseBtn');
const surpriseOverlay = document.getElementById('surpriseOverlay');
const surpriseMessage = document.getElementById('surpriseMessage');
const closeSurpriseBtn = document.getElementById('closeSurpriseBtn');
const surpriseCard = document.querySelector('#surpriseOverlay .surprise-card');

const reasonsContainer = document.getElementById('reasonsContainer'); // Reasons Jar
const reasonInput = document.getElementById('reasonInput');         // Reasons Jar
const addReasonBtn = document.getElementById('addReasonBtn');       // Reasons Jar
const addReasonSection = document.getElementById('addReasonSection'); // Reasons Jar

const spotifyPlayer = document.getElementById('spotifyPlayer'); // Spotify (Optional - If using input method)
const spotifyLinkInput = document.getElementById('spotifyLinkInput'); // Spotify
const updateSpotifyBtn = document.getElementById('updateSpotifyBtn'); // Spotify
const spotifyUpdateSection = document.getElementById('spotifyUpdateSection'); // Spotify

// --- Firebase Refs (Check if 'database' and 'auth' exist from index.html) ---
const messagesRef = typeof database !== 'undefined' ? database.ref('messages') : null;
const memoriesRef = typeof database !== 'undefined' ? database.ref('memories') : null;
const meetupDateRef = typeof database !== 'undefined' ? database.ref('meetupDate') : null;
const bucketListRef = typeof database !== 'undefined' ? database.ref('bucketList') : null;
const reasonsRef = typeof database !== 'undefined' ? database.ref('reasons') : null; // Reasons Jar Ref
const spotifyEmbedUrlRef = typeof database !== 'undefined' ? database.ref('spotifyEmbedUrl') : null; // Spotify Ref
const firebaseAuth = typeof auth !== 'undefined' ? auth : null;

// --- State Variables ---
let musicOn = false;
let currentUser = null; // To store login state

// --- Helper Functions ---
function escapeHtml(s) {
    if (typeof s !== 'string') return '';
    return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

// --- Function to Enable/Disable Editing ---
function setEditingEnabled(isEnabled) {
    const elementsToToggle = [
        msgInput, postBtn,
        memoryInput, addMemoryBtn,
        meetDateInput,
        bucketListItemInput, addBucketListItemBtn,
        editLettersBtn, // The button to *start* editing
        letterEdit, saveLetterBtn, cancelEditBtn, // Controls *inside* the editor
        reasonInput, addReasonBtn, // Reasons Jar input/button
        spotifyLinkInput, updateSpotifyBtn // Spotify input/button
    ];

    elementsToToggle.forEach(el => {
        if (el) {
            el.disabled = !isEnabled;
            // Prevent visual changes if element is hidden (like editor)
            if (el.offsetParent !== null || el === editLettersBtn) { // Check if visible or is the main edit btn
                el.style.opacity = isEnabled ? '1' : '0.5';
                el.style.cursor = isEnabled ? '' : 'not-allowed';
            }
        }
    });

    // Hide/show relevant input sections based on login state
    if (spotifyUpdateSection) spotifyUpdateSection.style.display = isEnabled ? 'block' : 'none';
    if (addReasonSection) addReasonSection.style.display = isEnabled ? 'flex' : 'none';

    // Handle bucket list checkboxes (dynamically created)
    if (bucketListContainer) {
        const checkboxes = bucketListContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.disabled = !isEnabled;
            cb.style.cursor = isEnabled ? 'pointer' : 'not-allowed';
        });
    }
}


// --- Initial Setup & Basic UI (Splash, Music, Typewriter, Hearts) ---
if (enterBtn) {
    enterBtn.addEventListener('click', () => {
        if (splash) splash.style.display = 'none';
        if (mainContent) mainContent.setAttribute('aria-hidden', 'false');
    });
}
if (peekBtn) {
    peekBtn.addEventListener('click', () => {
        alert('Sneak peek: \n\n"You make my days better just by being you." 💖');
    });
}
if (muteMusic && bgMusic) {
    muteMusic.addEventListener('click', () => {
        musicOn = !musicOn;
        if (musicOn) {
            bgMusic.src = 'https://www.mboxdrive.com/Until%20I%20Found%20You%20-%20Stephen%20Sanchez%20Lyrics.mp3'; // DIRECT LINK TO AUDIO FILE
            bgMusic.play().catch((error) => { console.warn("Audio play failed:", error); });
            muteMusic.textContent = 'Mute music';
        } else {
            bgMusic.pause();
            bgMusic.src = '';
            muteMusic.textContent = 'Play music';
        }
    });
}
(function() { // Typewriter
    const el = document.getElementById('type-hero');
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    function step() {
        if (i <= text.length) {
            el.textContent = text.slice(0, i);
            i++;
            setTimeout(step, 18 + Math.random() * 30);
        }
    }
    step();
})();
(function() { // Hearts Canvas
    const canvas = document.getElementById('hearts');
    if (!canvas) { console.error("Hearts canvas not found"); return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) { console.error("Could not get 2D context for hearts canvas"); return; }
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let animationFrameId = null; // Keep track of animation frame

    class Heart {
        constructor() { this.reset(); }
        reset() { this.x = Math.random()*W; this.y = H+Math.random()*200; this.vy = -(0.5+Math.random()*1.2); this.vx = (Math.random()-0.5)*0.6; this.size = 8+Math.random()*16; this.alpha = 0.5+Math.random()*0.5; this.spin = Math.random()*0.06-0.03; this.angle = Math.random()*Math.PI*2; this.color = Math.random()>0.5 ? 'rgba(255,77,109,'+this.alpha+')' : 'rgba(255,182,213,'+this.alpha+')'; }
        update() { this.y += this.vy; this.x += this.vx; this.angle += this.spin; if(this.y < -50) this.reset(); }
        draw() { ctx.save(); ctx.translate(this.x,this.y); ctx.rotate(this.angle); ctx.beginPath(); const s=this.size/20; ctx.moveTo(0,-10*s); ctx.bezierCurveTo(12*s,-28*s,40*s,-10*s,0,40*s); ctx.bezierCurveTo(-40*s,-10*s,-12*s,-28*s,0,-10*s); ctx.fillStyle=this.color; ctx.fill(); ctx.restore(); }
    }
    const hearts = new Array(55).fill().map(() => new Heart());

    function anim() {
        ctx.clearRect(0,0,W,H);
        hearts.forEach(h => { h.update(); h.draw(); });
        animationFrameId = requestAnimationFrame(anim);
    }

    window.addEventListener('resize', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        // Re-initialize hearts or just restart animation
        anim();
    });
    anim(); // Start animation initially
})();


// --- Love Meter ---
const loveRange = document.getElementById('loveRange');
const loveVal = document.getElementById('loveVal');
if (loveRange && loveVal) {
    loveRange.addEventListener('input', () => {
        loveVal.textContent = loveRange.value + '% ♥';
    });
}

//
// --- ⬇️ AUTHENTICATION LOGIC ⬇️ ---
//
if (firebaseAuth && loginBtn && logoutBtn) {
    loginBtn.addEventListener('click', () => {
        const email = prompt("Enter your admin email:");
        const password = prompt("Enter your admin password:");
        if (email && password) {
            firebaseAuth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    console.log("Login successful:", userCredential.user.email);
                })
                .catch((error) => {
                    console.error("Login failed:", error.code, error.message);
                    alert("Login failed: " + error.message);
                });
        }
    });

    logoutBtn.addEventListener('click', () => {
        firebaseAuth.signOut().then(() => {
            console.log("Logout successful");
        }).catch((error) => {
            console.error("Logout failed:", error.code, error.message);
            alert("Logout failed: " + error.message);
        });
    });

    firebaseAuth.onAuthStateChanged((user) => {
        const isLoggedIn = !!user; // Convert user object to boolean
        currentUser = user; // Update currentUser state

        console.log("Auth state changed. User:", user ? user.email : 'Logged out');
        loginBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
        logoutBtn.style.display = isLoggedIn ? 'inline-block' : 'none';
        setEditingEnabled(isLoggedIn);

        // If logged out and editor was open, hide it
        if (!isLoggedIn && editorArea && editorArea.style.display === 'block') {
            editorArea.style.display = 'none';
            if (editBtn) editBtn.style.display = 'inline-block';
        }
    });
} else {
    console.warn("Firebase Auth or login/logout buttons not found. Editing disabled.");
    document.addEventListener('DOMContentLoaded', () => setEditingEnabled(false));
}
//
// --- ⬆️ END OF AUTHENTICATION LOGIC ⬆️ ---
//


//
// --- ⬇️ MESSAGE BOARD (FIREBASE VERSION) ⬇️ ---
//
if (board && msgInput && postBtn && clearBtn && messagesRef) {
    function drawMessage(messageObject) {
        const el = document.createElement('div');
        el.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
        el.style.padding = '8px 10px';
        el.style.borderRadius = '10px';
        el.style.marginBottom = '8px';
        const name = messageObject.name ? escapeHtml(messageObject.name) : 'Someone';
        const text = messageObject.text ? escapeHtml(messageObject.text) : '';
        el.innerHTML = `<strong>From ${name}:</strong><div style="margin-top:6px">${text}</div>`;
        board.appendChild(el);
        board.scrollTop = board.scrollHeight;
    }

    postBtn.addEventListener('click', () => {
        const val = msgInput.value.trim();
        if (!val) return alert('Please write a message first!');
        const name = currentUser ? (currentUser.email.split('@')[0] || 'Admin') : 'Guest';

        const newMessage = { name: name, text: val, timestamp: firebase.database.ServerValue.TIMESTAMP };
        messagesRef.push(newMessage).catch(error => {
             console.error("Error sending message:", error);
             alert(`Could not send message. ${error.code === 'PERMISSION_DENIED' ? 'Are you logged in?' : 'Please try again.'}`);
        });
        msgInput.value = '';
    });

    clearBtn.addEventListener('click', () => { msgInput.value = ''; });

    messagesRef.orderByChild('timestamp').on('value', (snapshot) => {
        board.innerHTML = '';
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => { drawMessage(childSnapshot.val()); });
        }
    });
} else {
    console.warn("Message board elements or Firebase ref missing.");
}
//
// --- ⬆️ END OF MESSAGE BOARD SECTION ⬆️ ---
//


//
// --- ⬇️ ADD MEMORIES (FIREBASE VERSION) ⬇️ ---
//
if (memoryInput && addMemoryBtn && timelineList && memoriesRef) {
    function drawMemory(memoryObject) {
        const node = document.createElement('div');
        node.className = 'memory';
        const name = memoryObject.name ? escapeHtml(memoryObject.name) : 'Someone';
        const text = memoryObject.text ? escapeHtml(memoryObject.text) : '';
        node.innerHTML = `<div class="dot"></div><div class="body"><strong>${name}'s Memory</strong><div style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:6px">${text}</div></div>`;
        timelineList.appendChild(node);
    }

    addMemoryBtn.addEventListener('click', () => {
        const val = memoryInput.value.trim();
        if (!val) return;
        const name = currentUser ? (currentUser.email.split('@')[0] || 'Admin') : 'Guest';

        const newMemory = { name: name, text: val, timestamp: firebase.database.ServerValue.TIMESTAMP };
        memoriesRef.push(newMemory).catch(error => {
             console.error("Error adding memory:", error);
             alert(`Could not add memory. ${error.code === 'PERMISSION_DENIED' ? 'Are you logged in?' : 'Please try again.'}`);
        });
        memoryInput.value = '';
    });

    memoriesRef.orderByChild('timestamp').on('value', (snapshot) => {
        timelineList.innerHTML = '';
        if (snapshot.exists()) {
             snapshot.forEach(childSnapshot => { drawMemory(childSnapshot.val()); });
        }
    });
} else {
    console.warn("Memory elements or Firebase ref missing.");
}
//
// --- ⬆️ END OF MEMORIES SECTION ⬆️ ---
//

//
// --- ⬇️ COUNTDOWN (FIREBASE VERSION) ⬇️ ---
//
if (meetDateInput && countdownDisplay && meetupDateRef) {
    function updateCountdown(dateString) {
        if (!dateString) { countdownDisplay.innerText = 'No date set.'; if (meetDateInput) meetDateInput.value = ''; return; }
        if (meetDateInput) meetDateInput.value = dateString; // Sync input with DB value
        const then = new Date(dateString);
        if (isNaN(then.getTime())) { countdownDisplay.innerText = 'Invalid date set.'; return; }

        // Get midnight UTC *after* the target date
        const targetDateUTC = new Date(Date.UTC(then.getUTCFullYear(), then.getUTCMonth(), then.getUTCDate()));
        const targetMidnightUTC = targetDateUTC.getTime() + (24 * 60 * 60 * 1000); // Add one day in ms

        const now = new Date();
        // Get midnight UTC *after* today
        const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const todayMidnightUTC = todayUTC.getTime() + (24 * 60 * 60 * 1000);

        const diff = targetMidnightUTC - todayMidnightUTC; // Diff between midnights

        if (diff < 0) { // Target date's midnight has passed today's midnight
            countdownDisplay.innerText = 'The day is here or has passed!';
        } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // Calculate full days between midnights
            countdownDisplay.innerText = days + (days === 1 ? ' day to go!' : ' days to go — hold on tight!');
        }
    }


    meetDateInput.addEventListener('change', () => {
        const newDate = meetDateInput.value;
        if (newDate) {
            meetupDateRef.set(newDate).catch(error => {
                 console.error("Error setting date:", error);
                 alert(`Could not set date. ${error.code === 'PERMISSION_DENIED' ? 'Are you logged in?' : 'Please try again.'}`);
            });
        } else {
            meetupDateRef.remove().catch(error => {
                 console.error("Error removing date:", error);
                 alert(`Could not clear date. ${error.code === 'PERMISSION_DENIED' ? 'Are you logged in?' : 'Please try again.'}`);
            });
            // updateCountdown(null); // Listener below will handle this
        }
    });

    meetupDateRef.on('value', (snapshot) => {
        const savedDate = snapshot.val();
        updateCountdown(savedDate);
    });
} else {
     console.warn("Countdown elements or Firebase ref missing.");
}
//
// --- ⬆️ END OF COUNTDOWN SECTION ⬆️ ---
//

//
// --- ⬇️ BUCKET LIST (FIREBASE VERSION) ⬇️ ---
//
if (bucketListContainer && bucketListItemInput && addBucketListItemBtn && bucketListRef) {
    function drawBucketListItem(key, itemData) {
        const li = document.createElement('div');
        li.style.display = 'flex'; li.style.alignItems = 'center'; li.style.marginBottom = '8px'; li.style.padding = '5px'; li.style.borderRadius = '5px'; li.style.background = 'rgba(255, 255, 255, 0.03)';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox'; checkbox.checked = itemData.completed || false;
        checkbox.style.marginRight = '10px'; checkbox.style.cursor = 'pointer'; checkbox.style.accentColor = 'var(--accent)'; checkbox.style.transform = 'scale(1.2)';
        checkbox.disabled = !currentUser; // Disable based on current login state at draw time
        checkbox.style.cursor = currentUser ? 'pointer' : 'not-allowed';

        const textSpan = document.createElement('span');
        textSpan.textContent = escapeHtml(itemData.text); textSpan.style.flex = '1';
        textSpan.style.textDecoration = itemData.completed ? 'line-through' : 'none';
        textSpan.style.opacity = itemData.completed ? '0.6' : '1';

        checkbox.addEventListener('change', () => {
            if (!currentUser) return; // Prevent action if somehow clicked while disabled
            const updates = {};
            updates[`/${key}/completed`] = checkbox.checked;
            bucketListRef.update(updates).catch(error => {
                 console.error("Error updating item:", error);
                 alert(`Could not update item. ${error.code === 'PERMISSION_DENIED' ? 'Are you logged in?' : 'Please try again.'}`);
                 checkbox.checked = !checkbox.checked; // Revert visually on error
            });
        });

        li.appendChild(checkbox); li.appendChild(textSpan);
        bucketListContainer.appendChild(li);
    }

    addBucketListItemBtn.addEventListener('click', () => {
        const text = bucketListItemInput.value.trim();
        if (!text) return;
        const name = currentUser ? (currentUser.email.split('@')[0] || 'Admin') : 'Guest';

        const newItem = { name: name, text: text, completed: false, timestamp: firebase.database.ServerValue.TIMESTAMP };
        bucketListRef.push(newItem).catch(error => {
             console.error("Error adding item:", error);
             alert(`Could not add item. ${error.code === 'PERMISSION_DENIED' ? 'Are you logged in?' : 'Please try again.'}`);
        });
        bucketListItemInput.value = '';
    });

    bucketListRef.orderByChild('timestamp').on('value', (snapshot) => {
        bucketListContainer.innerHTML = '';
        if (snapshot.exists()) {
             snapshot.forEach(childSnapshot => {
                 drawBucketListItem(childSnapshot.key, childSnapshot.val());
             });
        }
        // Ensure checkboxes reflect current login state after redraw
        setEditingEnabled(!!currentUser);
    });
} else {
     console.warn("Bucket list elements or Firebase ref missing.");
}
//
// --- ⬆️ END OF BUCKET LIST SECTION ⬆️ ---
//

//
// --- ⬇️ REASONS JAR (FIREBASE VERSION) ⬇️ ---
//
if (reasonsContainer && reasonInput && addReasonBtn && reasonsRef && addReasonSection) {
    function drawReasonNote(reasonData) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'reason-note';
        noteDiv.textContent = escapeHtml(reasonData.text);
        reasonsContainer.appendChild(noteDiv);
        reasonsContainer.scrollTop = reasonsContainer.scrollHeight;
    }

    addReasonBtn.addEventListener('click', () => {
        const text = reasonInput.value.trim();
        if (!text) return;
        const name = currentUser ? (currentUser.email.split('@')[0] || 'Admin') : 'Guest';

        const newReason = { name: name, text: text, timestamp: firebase.database.ServerValue.TIMESTAMP };
        reasonsRef.push(newReason).catch(error => {
            console.error("Error adding reason:", error);
            alert(`Could not add reason. ${error.code === 'PERMISSION_DENIED' ? 'Are you logged in?' : 'Please try again.'}`);
        });
        reasonInput.value = '';
    });

    reasonsRef.orderByChild('timestamp').on('value', (snapshot) => {
        reasonsContainer.innerHTML = '';
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                drawReasonNote(childSnapshot.val());
            });
        }
        // Ensure editing state is correct after redraw
        setEditingEnabled(!!currentUser); // Call this to hide/show input section if needed
    });

} else {
     console.warn("Reasons Jar elements or Firebase ref missing. Feature disabled.");
     if (addReasonSection) addReasonSection.style.display = 'none'; // Hide if elements missing
}
//
// --- ⬆️ END OF REASONS JAR SECTION ⬆️ ---
//

// --- Gallery Preview ---
function changeMainPhoto(url) {
    const mainPhoto = document.getElementById('mainPhoto');
    if (mainPhoto && typeof url === 'string') mainPhoto.src = url;
}
window.changeMainPhoto = changeMainPhoto; // Make accessible globally if needed by HTML

// --- Edit Letters ---
if (editBtn && editorArea && letterEdit && letters && cancelEditBtn && saveLetterBtn) {
    editBtn.addEventListener('click', () => {
        letterEdit.value = letters.innerText.trim();
        editorArea.style.display = 'block';
        editBtn.style.display = 'none';
        // Ensure editor elements are enabled if user is logged in
        setEditingEnabled(!!currentUser);
    });

    cancelEditBtn.addEventListener('click', () => {
        editorArea.style.display = 'none';
        editBtn.style.display = 'inline-block';
    });

    saveLetterBtn.addEventListener('click', () => {
        letters.innerText = letterEdit.value;
        editorArea.style.display = 'none';
        editBtn.style.display = 'inline-block';
    });
} else {
     console.warn("Letter editing elements missing.");
}

// --- Download Letter ---
const downloadLetterBtn = document.getElementById('downloadLetter');
if (downloadLetterBtn && letters) {
    downloadLetterBtn.addEventListener('click', () => {
        const text = letters.innerText;
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' }); // Added charset
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'letter-for-jordan.txt';
        document.body.appendChild(a); // Required for Firefox
        a.click();
        document.body.removeChild(a); // Clean up
        URL.revokeObjectURL(url);
    });
}

// --- Print Letter ---
const printLetterBtn = document.getElementById('printLetterBtn');
if (printLetterBtn && letters) {
    printLetterBtn.addEventListener('click', () => {
        const letterText = letters.innerText;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Letter for Jordan</title>
                <style>
                    body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
                    pre { white-space: pre-wrap; word-wrap: break-word; }
                </style>
            </head>
            <body>
                <pre>${escapeHtml(letterText)}</pre>
                <script>
                    window.onload = function() {
                        window.print();
                        // Delay closing slightly to allow print dialog
                        setTimeout(function() { window.close(); }, 500);
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    });
}

//
// --- ⬇️ SURPRISE COMPLIMENTS (OVERLAY VERSION) ⬇️ ---
//
if (surpriseBtn && surpriseOverlay && surpriseMessage && closeSurpriseBtn && surpriseCard) {
    const compliments = [ /* Long list from previous step */
        "Your laugh is my favourite song.", "You make even boring days special.", "I still get a little thrill when you smile at me.", "You're my favourite hello and hardest goodbye.", "I love all our plans for the future.", "I find new reasons to love you every single day.", "You're the calm I need in a chaotic world.", "Just the thought of you makes me smile.", "You feel like home.", "I love the little world we've built together.", "Waking up next to you is the best part of my day.", "I love just doing nothing with you.", "You make me a better person.", "The way you look at me still gives me butterflies.", "I love the sound of your voice when you first wake up.", "You're my person, through and through.", "I could talk to you for hours and never get bored.", "Your hand in mine is my favorite feeling.", "You are my greatest adventure.", "Everything makes more sense when I'm with you.", "I love watching you get excited about things.", "You're the best decision I ever made.", "I choose you. Every day, I'll keep choosing you.", "You're my sunshine on a cloudy day.", "I didn't know what 'complete' felt like until I met you.", "I cherish every memory we've made.", "You're the answer to prayers I didn't even know how to say.", "Falling asleep with you is the perfect end to every day.", "I love how you see the world.", "You're my anchor.", "Being with you is just... easy.", "I look at you and I'm home.", "You're my favorite notification.", "I love knowing this is just the beginning for us.", "My heart feels so full because of you.", "You're my safe place.", "I love you more than I have words for."
    ];

    function showSurprise() {
        const randomIndex = Math.floor(Math.random() * compliments.length);
        const randomCompliment = compliments[randomIndex];
        console.log("Selected compliment:", randomCompliment, "at index", randomIndex);

        if (typeof randomCompliment === 'string') {
            surpriseMessage.textContent = randomCompliment + ' 💕';
        } else {
            console.error("Failed to get a random compliment. Array issue?");
            surpriseMessage.textContent = "You're amazing! 💕";
        }
        surpriseOverlay.classList.remove('hidden');
        setTimeout(() => {
            surpriseCard.classList.add('surprise-reveal');
        }, 50); // Short delay for animation trigger
    }

    function hideSurprise() {
        surpriseOverlay.classList.add('hidden');
        // Remove reveal class AFTER fade out transition (approx 400ms from CSS)
        setTimeout(() => {
             surpriseCard.classList.remove('surprise-reveal');
        }, 400);
    }

    surpriseBtn.addEventListener('click', () => {
        surpriseBtn.classList.add('clicked-animation');
        showSurprise();
        setTimeout(() => {
            surpriseBtn.classList.remove('clicked-animation');
        }, 500); // Duration of button animation
    });

    closeSurpriseBtn.addEventListener('click', hideSurprise);
    surpriseOverlay.addEventListener('click', (event) => {
        if (event.target === surpriseOverlay) { // Click on background only
            hideSurprise();
        }
    });

} else {
    console.error("Surprise feature initialization failed. Check HTML IDs:", {
        surpriseBtnFound: !!surpriseBtn, surpriseOverlayFound: !!surpriseOverlay, surpriseMessageFound: !!surpriseMessage, closeSurpriseBtnFound: !!closeSurpriseBtn, surpriseCardFound: !!surpriseCard
    });
}
//
// --- ⬆️ END OF SURPRISE COMPLIMENTS SECTION ⬆️ ---
//

// --- Scavenger Hunt & Accessibility Keys ---
const secret = ['h', 'e', 'a', 'r', 't'];
let idx = 0;
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const activeEl = document.activeElement;
    const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
    const isEditingLetter = activeEl === letterEdit;

    // Secret Code (only if not focused on major inputs)
    if (!isTyping || (![msgInput, memoryInput, bucketListItemInput, reasonInput].includes(activeEl) && !isEditingLetter )) {
       if (key === secret[idx]) { idx++; if (idx === secret.length) { idx = 0; alert('You found the secret! ♥\n\nA little note for you: "I love you more every day."'); } } else { idx = (key === secret[0]) ? 1 : 0; }
    } else if (isTyping) {
        // Reset secret index if typing and key doesn't match start
        idx = (key === secret[0]) ? 1 : 0;
    }

    // Accessibility (only if not typing at all)
    if (!isTyping) {
        if (key === 'm') { e.preventDefault(); if (msgInput) msgInput.focus(); }
        if (key === 'p') { e.preventDefault(); if (peekBtn) peekBtn.click(); }
    }
});

// --- Export Zip ---
const exportZipBtn = document.getElementById('exportZip');
if (exportZipBtn && letters) {
    exportZipBtn.addEventListener('click', () => {
        const content = 'Letter:\n\n' + letters.innerText;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'matthew-jordan-package.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Exported letter as text. (Adding images requires a library like JSZip.)');
    });
}

// Final check: Ensure editing is disabled initially if auth hasn't loaded yet
document.addEventListener('DOMContentLoaded', () => {
    if (typeof firebaseAuth === 'undefined' || !firebaseAuth) {
         console.log("Firebase Auth not ready on DOMContentLoaded, disabling editing initially.");
         setEditingEnabled(false);
    } else {
         // If auth IS ready, check current state immediately
         const user = firebaseAuth.currentUser;
         console.log("DOMContentLoaded: Initial user check:", user ? user.email : 'None');
         setEditingEnabled(!!user); // Enable/disable based on immediate check
         // The onAuthStateChanged listener will still run and update if state changes later
    }
});
