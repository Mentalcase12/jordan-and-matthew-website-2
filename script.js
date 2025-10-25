// --- Get references to all interactive elements ---
const splash = document.getElementById('splash');
const mainContent = document.getElementById('mainContent');
const enterBtn = document.getElementById('enterBtn');
const peekBtn = document.getElementById('peekBtn');
const muteMusic = document.getElementById('muteMusic');
const bgMusic = document.getElementById('bgMusic');
const loginBtn = document.getElementById('loginBtn'); // New
const logoutBtn = document.getElementById('logoutBtn'); // New

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

const editLettersBtn = document.getElementById('editLetters'); // Assuming you might want to protect this too

// --- Firebase Refs (Check if 'database' and 'auth' exist from index.html) ---
const messagesRef = typeof database !== 'undefined' ? database.ref('messages') : null;
const memoriesRef = typeof database !== 'undefined' ? database.ref('memories') : null;
const meetupDateRef = typeof database !== 'undefined' ? database.ref('meetupDate') : null;
const bucketListRef = typeof database !== 'undefined' ? database.ref('bucketList') : null;
const firebaseAuth = typeof auth !== 'undefined' ? auth : null; // Use the auth object from index.html

// --- State Variables ---
let musicOn = false;
let currentUser = null; // To store login state

// --- Helper Functions ---
function escapeHtml(s) {
    if (typeof s !== 'string') return '';
    return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

// --- NEW: Function to Enable/Disable Editing ---
function setEditingEnabled(isEnabled) {
    const elementsToToggle = [
        msgInput, postBtn, // Message board
        memoryInput, addMemoryBtn, // Memories
        meetDateInput, // Countdown date picker
        bucketListItemInput, addBucketListItemBtn, // Bucket list
        editLettersBtn // Edit letter button (optional)
        // Add any other elements you want to protect
    ];

    elementsToToggle.forEach(el => {
        if (el) { // Check if the element exists on the page
            el.disabled = !isEnabled;
            el.style.opacity = isEnabled ? '1' : '0.5'; // Visual cue
            el.style.cursor = isEnabled ? '' : 'not-allowed';
        }
    });

    // Also disable checkboxes in the bucket list if not logged in
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
            bgMusic.src = 'YOUR-MUSIC-FILE.mp3'; // Add your music file URL here
            bgMusic.play().catch(() => {});
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
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
    class Heart { /* ... (Heart class code remains the same) ... */ 
        constructor() { this.reset(); }
        reset() { this.x = Math.random()*W; this.y = H+Math.random()*200; this.vy = -(0.5+Math.random()*1.2); this.vx = (Math.random()-0.5)*0.6; this.size = 8+Math.random()*16; this.alpha = 0.5+Math.random()*0.5; this.spin = Math.random()*0.06-0.03; this.angle = Math.random()*Math.PI*2; this.color = Math.random()>0.5 ? 'rgba(255,77,109,'+this.alpha+')' : 'rgba(255,182,213,'+this.alpha+')'; }
        update() { this.y += this.vy; this.x += this.vx; this.angle += this.spin; if(this.y < -50) this.reset(); }
        draw() { ctx.save(); ctx.translate(this.x,this.y); ctx.rotate(this.angle); ctx.beginPath(); const s=this.size/20; ctx.moveTo(0,-10*s); ctx.bezierCurveTo(12*s,-28*s,40*s,-10*s,0,40*s); ctx.bezierCurveTo(-40*s,-10*s,-12*s,-28*s,0,-10*s); ctx.fillStyle=this.color; ctx.fill(); ctx.restore(); }
    }
    const hearts = new Array(55).fill().map(() => new Heart());
    function anim() { ctx.clearRect(0,0,W,H); for(const h of hearts){ h.update(); h.draw(); } requestAnimationFrame(anim); }
    anim();
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
    // Login Button Click
    loginBtn.addEventListener('click', () => {
        const email = prompt("Enter your admin email:");
        const password = prompt("Enter your admin password:");
        if (email && password) {
            firebaseAuth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in 
                    console.log("Login successful:", userCredential.user.email);
                    // The onAuthStateChanged listener below will handle UI updates
                })
                .catch((error) => {
                    console.error("Login failed:", error.message);
                    alert("Login failed: " + error.message);
                });
        }
    });

    // Logout Button Click
    logoutBtn.addEventListener('click', () => {
        firebaseAuth.signOut().then(() => {
            console.log("Logout successful");
            // The onAuthStateChanged listener below will handle UI updates
        }).catch((error) => {
            console.error("Logout failed:", error.message);
            alert("Logout failed: " + error.message);
        });
    });

    // Listener for Auth State Changes (Login/Logout)
    firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            console.log("User is logged in:", user.email);
            loginBtn.style.display = 'none'; // Hide login button
            logoutBtn.style.display = 'inline-block'; // Show logout button
            setEditingEnabled(true); // ★★★ ENABLE editing ★★★
        } else {
            // User is signed out
            currentUser = null;
            console.log("User is logged out");
            loginBtn.style.display = 'inline-block'; // Show login button
            logoutBtn.style.display = 'none'; // Hide logout button
            setEditingEnabled(false); // ★★★ DISABLE editing ★★★
        }
    });
} else {
    // If Firebase Auth isn't set up, disable editing by default for safety
    console.warn("Firebase Auth not configured. Editing will be disabled.");
    setEditingEnabled(false);
}
// 
// --- ⬆️ END OF AUTHENTICATION LOGIC ⬆️ ---
//


// 
// --- ⬇️ MESSAGE BOARD (FIREBASE VERSION) ⬇️ ---
// (No changes needed here, relies on `messagesRef` and `currentUser`)
if (board && msgInput && postBtn && clearBtn && messagesRef) {
    function drawMessage(messageObject) { /* ... same as before ... */ 
        const el = document.createElement('div');
        el.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
        el.style.padding = '8px 10px';
        el.style.borderRadius = '10px';
        el.style.marginBottom = '8px';
        el.innerHTML = `<strong>From ${escapeHtml(messageObject.name)}:</strong><div style="margin-top:6px">${escapeHtml(messageObject.text)}</div>`;
        board.appendChild(el); 
        board.scrollTop = board.scrollHeight;
    }

    postBtn.addEventListener('click', () => {
        // No need to check currentUser here, Firebase Rules handle it
        const val = msgInput.value.trim();
        if (!val) return alert('Please write a message first!');
        const name = currentUser ? (currentUser.email.split('@')[0] || 'Admin') : 'Guest'; // Use email part as name, or 'Guest' if somehow posted while logged out

        const newMessage = {
            name: name, // Use logged-in user's name
            text: val,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        messagesRef.push(newMessage).catch(error => { // Add error catching
             console.error("Error sending message:", error);
             alert("Could not send message. Are you logged in?");
        });
        msgInput.value = '';
    });

    clearBtn.addEventListener('click', () => { msgInput.value = ''; });

    messagesRef.on('value', (snapshot) => {
        board.innerHTML = ''; 
        const messages = snapshot.val();
        if (messages) {
            Object.keys(messages).sort((a,b) => messages[a].timestamp - messages[b].timestamp) // Sort by timestamp
             .forEach(key => { drawMessage(messages[key]); });
        }
    });
}
// 
// --- ⬆️ END OF MESSAGE BOARD SECTION ⬆️ ---
//


// 
// --- ⬇️ ADD MEMORIES (FIREBASE VERSION) ⬇️ ---
// (No changes needed here, relies on `memoriesRef` and `currentUser`)
if (memoryInput && addMemoryBtn && timelineList && memoriesRef) {
    function drawMemory(memoryObject) { /* ... same as before ... */ 
        const node = document.createElement('div');
        node.className = 'memory';
        node.innerHTML = `<div class="dot"></div><div class="body"><strong>${escapeHtml(memoryObject.name)}'s Memory</strong><div style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:6px">${escapeHtml(memoryObject.text)}</div></div>`;
        timelineList.appendChild(node);
    }

    addMemoryBtn.addEventListener('click', () => {
        // No need to check currentUser here, Firebase Rules handle it
        const val = memoryInput.value.trim();
        if (!val) return;
        const name = currentUser ? (currentUser.email.split('@')[0] || 'Admin') : 'Guest';

        const newMemory = {
            name: name, 
            text: val,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        memoriesRef.push(newMemory).catch(error => { // Add error catching
             console.error("Error adding memory:", error);
             alert("Could not add memory. Are you logged in?");
        });
        memoryInput.value = '';
    });

    memoriesRef.on('value', (snapshot) => {
        timelineList.innerHTML = ''; 
        const memories = snapshot.val();
        if (memories) {
             Object.keys(memories).sort((a,b) => memories[a].timestamp - memories[b].timestamp) // Sort by timestamp
              .forEach(key => { drawMemory(memories[key]); });
        }
    });
}
// 
// --- ⬆️ END OF MEMORIES SECTION ⬆️ ---
//

// 
// --- ⬇️ COUNTDOWN (FIREBASE VERSION) ⬇️ ---
// (No changes needed here, relies on `meetupDateRef` and `currentUser`)
if (meetDateInput && countdownDisplay && meetupDateRef) {
    function updateCountdown(dateString) { /* ... same as before ... */
        if (!dateString) { countdownDisplay.innerText = 'No date set.'; if (meetDateInput) meetDateInput.value = ''; return; }
        if (meetDateInput) meetDateInput.value = dateString;
        const then = new Date(dateString); const thenUTC = Date.UTC(then.getUTCFullYear(), then.getUTCMonth(), then.getUTCDate()); const nowUTC = Date.now(); const diff = thenUTC - nowUTC;
        if (diff <= 0) { countdownDisplay.innerText = 'The day is here or has passed!'; } else { const days = Math.ceil(diff / (1000 * 60 * 60 * 24)); countdownDisplay.innerText = days + (days === 1 ? ' day to go!' : ' days to go — hold on tight!'); }
    }

    meetDateInput.addEventListener('change', () => {
        // No need to check currentUser here, Firebase Rules handle it
        const newDate = meetDateInput.value;
        if (newDate) {
            meetupDateRef.set(newDate).catch(error => { // Add error catching
                 console.error("Error setting date:", error);
                 alert("Could not set date. Are you logged in?");
            });
        } else {
            meetupDateRef.remove().catch(error => { // Add error catching
                 console.error("Error removing date:", error);
                 alert("Could not clear date. Are you logged in?");
            }); 
            updateCountdown(null);
        }
    });

    meetupDateRef.on('value', (snapshot) => {
        const savedDate = snapshot.val();
        updateCountdown(savedDate);
    });
}
// 
// --- ⬆️ END OF COUNTDOWN SECTION ⬆️ ---
// 

// 
// --- ⬇️ BUCKET LIST (FIREBASE VERSION) ⬇️ ---
// (Minor changes to use `currentUser` and disable checkbox if logged out)
if (bucketListContainer && bucketListItemInput && addBucketListItemBtn && bucketListRef) {
    function drawBucketListItem(key, itemData) {
        const li = document.createElement('div'); 
        li.style.display = 'flex'; li.style.alignItems = 'center'; li.style.marginBottom = '8px'; li.style.padding = '5px'; li.style.borderRadius = '5px'; li.style.background = 'rgba(255, 255, 255, 0.03)';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox'; checkbox.checked = itemData.completed || false; 
        checkbox.style.marginRight = '10px'; checkbox.style.cursor = 'pointer'; checkbox.style.accentColor = 'var(--accent)'; checkbox.style.transform = 'scale(1.2)';
        checkbox.disabled = !currentUser; // ★★★ Disable checkbox if not logged in ★★★
        checkbox.style.cursor = currentUser ? 'pointer' : 'not-allowed';

        const textSpan = document.createElement('span');
        textSpan.textContent = escapeHtml(itemData.text); textSpan.style.flex = '1'; 
        textSpan.style.textDecoration = itemData.completed ? 'line-through' : 'none'; 
        textSpan.style.opacity = itemData.completed ? '0.6' : '1'; 

        checkbox.addEventListener('change', () => {
            // No need to check currentUser here, Firebase Rules handle it
            const updates = {};
            updates[`/${key}/completed`] = checkbox.checked; 
            bucketListRef.update(updates).catch(error => { // Add error catching
                 console.error("Error updating item:", error);
                 alert("Could not update item. Are you logged in?");
                 checkbox.checked = !checkbox.checked; // Revert checkbox on error
            }); 
        });

        li.appendChild(checkbox); li.appendChild(textSpan);
        bucketListContainer.appendChild(li);
    }

    addBucketListItemBtn.addEventListener('click', () => {
        // No need to check currentUser here, Firebase Rules handle it
        const text = bucketListItemInput.value.trim();
        if (!text) return; 
        const name = currentUser ? (currentUser.email.split('@')[0] || 'Admin') : 'Guest'; // Added name

        const newItem = {
            name: name, // Store who added it (optional)
            text: text,
            completed: false, 
            timestamp: firebase.database.ServerValue.TIMESTAMP 
        };

        bucketListRef.push(newItem).catch(error => { // Add error catching
             console.error("Error adding item:", error);
             alert("Could not add item. Are you logged in?");
        }); 
        bucketListItemInput.value = ''; 
    });

    bucketListRef.on('value', (snapshot) => {
        bucketListContainer.innerHTML = ''; 
        const items = snapshot.val();
        if (items) {
             Object.keys(items).sort((a,b) => items[a].timestamp - items[b].timestamp) // Sort by timestamp
              .forEach(key => { drawBucketListItem(key, items[key]); });
        }
        // After drawing, ensure checkboxes reflect current login state
         setEditingEnabled(!!currentUser); 
    });
}
// 
// --- ⬆️ END OF BUCKET LIST SECTION ⬆️ ---
// 

// --- Gallery Preview ---
function changeMainPhoto(url) {
    const mainPhoto = document.getElementById('mainPhoto');
    if(mainPhoto) mainPhoto.src = url;
}
window.changeMainPhoto = changeMainPhoto;

// --- Edit Letters ---
// (Note: This is still client-side text editing, not saved to Firebase)
const editBtn = document.getElementById('editLetters');
const editorArea = document.getElementById('editorArea');
const letterEdit = document.getElementById('letterEdit');
const letters = document.getElementById('letters');

if (editBtn && editorArea && letterEdit && letters) {
    editBtn.addEventListener('click', () => {
        letterEdit.value = letters.innerText.trim();
        editorArea.style.display = 'block';
        editBtn.style.display = 'none';
    });
}
if (document.getElementById('cancelEdit') && editorArea && editBtn) {
    document.getElementById('cancelEdit').addEventListener('click', () => {
        editorArea.style.display = 'none';
        editBtn.style.display = 'inline-block';
    });
}
if (document.getElementById('saveLetter') && editorArea && editBtn && letters && letterEdit) {
    document.getElementById('saveLetter').addEventListener('click', () => {
        letters.innerText = letterEdit.value;
        editorArea.style.display = 'none';
        editBtn.style.display = 'inline-block';
    });
}

// --- Download Letter ---
if (document.getElementById('downloadLetter') && letters) {
    document.getElementById('downloadLetter').addEventListener('click', () => {
        const text = letters.innerText;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'letter-for-jordan.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
}

// --- Print Letter ---
if (document.getElementById('printLetterBtn') && letters) {
    document.getElementById('printLetterBtn').addEventListener('click', () => {
        const w = window.open();
        w.document.write('<style>pre{white-space:pre-wrap; font-family: sans-serif;}</style><pre>' + escapeHtml(letters.innerText) + '</pre>');
        w.document.close();
        w.print();
        setTimeout(() => w.close(), 500);
    });
}

// --- Surprise Compliments ---
if (document.getElementById('surpriseBtn')) {
    const compliments = [ /* ... compliments array ... */ 
        "Your laugh is my favourite song.", "You make even boring days special.", "I still get a little thrill when you smile at me.", "You're my favourite hello and hardest goodbye.", "I love all our plans for the future."
    ];
    document.getElementById('surpriseBtn').addEventListener('click', () => {
        alert(compliments[Math.floor(Math.random() * compliments.length)] + ' 💕');
    });
}

// --- Scavenger Hunt & Accessibility Keys ---
const secret = ['h', 'e', 'a', 'r', 't'];
let idx = 0;
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const activeEl = document.activeElement;
    const isTyping = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA';

    // Secret Code (only if not focused on major inputs)
    if (!isTyping || ![msgInput, memoryInput, letterEdit, bucketListItemInput].includes(activeEl)) {
       if (key === secret[idx]) { idx++; if (idx === secret.length) { idx = 0; alert('You found the secret! ♥\n\nA little note for you: "I love you more every day."'); } } else { idx = (key === secret[0]) ? 1 : 0; } 
    } else { idx = (key === secret[0]) ? 1 : 0; } // Reset if typing wrong key
    
    // Accessibility (only if not typing at all)
    if (!isTyping) { 
        if (key === 'm') { e.preventDefault(); if (msgInput) msgInput.focus(); }
        if (key === 'p') { e.preventDefault(); if (peekBtn) peekBtn.click(); }
    }
});

// --- Export Zip ---
if (document.getElementById('exportZip') && letters) {
    document.getElementById('exportZip').addEventListener('click', () => {
        const content = 'Letter:\n\n' + letters.innerText;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'matthew-jordan-package.txt';
        a.click();
        URL.revokeObjectURL(url);
        alert('Exported a simple package. (This is a dev note: To include photos, this would need more code.)');
    });
}

// Final check: Initially disable editing until auth state is known
document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase Auth is potentially loaded before disabling
    if (!firebaseAuth) { 
        setEditingEnabled(false); 
    }
    // If auth is loaded, the onAuthStateChanged listener will handle enabling/disabling.
});