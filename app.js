/**
 * AuraHabit - Core Application Logic
 * State management, Authentication, Habits CRUD, Streaks, Achievements, and UI Rendering.
 */

// ==========================================================================
// 1. Initial State & Data Models
// ==========================================================================

const DEFAULT_STATE = {
    users: {},            // Users database { email: { name, email, password, avatarColor, signupDate } }
    currentUser: null,    // Logged in user email
    habits: [],           // List of habits [{ id, userEmail, name, description, category, frequency, timeOfDay, createdDate, completedDates: { 'YYYY-MM-DD': true } }]
    settings: {
        theme: 'dark',
        notifications: true
    },
    unlockedAchievements: {} // Unlocked badges { userEmail: { badgeId: unlockDate } }
};

let state = { ...DEFAULT_STATE };

// Define the 8 Achievements
const ACHIEVEMENTS_LIST = [
    {
        id: 'first_step',
        name: 'First Step',
        desc: 'Complete your first habit.',
        icon: `<svg viewBox="0 0 100 100" class="badge-svg">
            <defs>
                <linearGradient id="grad-first_step" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#34d399" />
                    <stop offset="100%" stop-color="#059669" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#grad-first_step)" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="6 4" opacity="0.6" />
            <path d="M40 50 L47 57 L62 42" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M45 72 L55 72" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
        </svg>`,
        check: (habits, logsCount, maxStreak) => logsCount >= 1
    },
    {
        id: 'threes_company',
        name: "Three's Company",
        desc: 'Achieve a 3-day streak on any habit.',
        icon: `<svg viewBox="0 0 100 100" class="badge-svg">
            <defs>
                <linearGradient id="grad-threes" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fbbf24" />
                    <stop offset="100%" stop-color="#d97706" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#grad-threes)" />
            <polygon points="50,22 75,65 25,65" fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
            <circle cx="50" cy="22" r="6" fill="#ffffff" />
            <circle cx="75" cy="65" r="6" fill="#ffffff" />
            <circle cx="25" cy="65" r="6" fill="#ffffff" />
            <path d="M45 48 A 5 5 0 0 1 55 48" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
        </svg>`,
        check: (habits, logsCount, maxStreak) => maxStreak >= 3
    },
    {
        id: 'week_of_fire',
        name: 'Week of Fire',
        desc: 'Achieve a 7-day streak on any habit.',
        icon: `<svg viewBox="0 0 100 100" class="badge-svg">
            <defs>
                <linearGradient id="grad-week" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#f97316" />
                    <stop offset="100%" stop-color="#ea580c" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#grad-week)" />
            <path d="M50 18 C30 38 35 68 50 82 C65 68 70 38 50 18 Z" fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
            <path d="M50 35 C42 45 44 65 50 72 C56 65 58 45 50 35 Z" fill="#ffffff" opacity="0.8" />
            <text x="50" y="88" font-family="'Outfit', sans-serif" font-weight="800" font-size="12" fill="#ffffff" text-anchor="middle">7 DAYS</text>
        </svg>`,
        check: (habits, logsCount, maxStreak) => maxStreak >= 7
    },
    {
        id: 'consistency_king',
        name: 'Consistency King',
        desc: 'Achieve a 30-day streak on any habit.',
        icon: `<svg viewBox="0 0 100 100" class="badge-svg">
            <defs>
                <linearGradient id="grad-king" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#8b5cf6" />
                    <stop offset="100%" stop-color="#6d28d9" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#grad-king)" />
            <path d="M30 68 L35 38 L48 50 L50 32 L52 32 L54 50 L67 38 L72 68 Z" fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
            <circle cx="35" cy="34" r="3" fill="#ffffff" />
            <circle cx="51" cy="28" r="3" fill="#ffffff" />
            <circle cx="67" cy="34" r="3" fill="#ffffff" />
            <line x1="30" y1="74" x2="72" y2="74" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
        </svg>`,
        check: (habits, logsCount, maxStreak) => maxStreak >= 30
    },
    {
        id: 'habit_guru',
        name: 'Habit Guru',
        desc: 'Have 5 or more active habits created.',
        icon: `<svg viewBox="0 0 100 100" class="badge-svg">
            <defs>
                <linearGradient id="grad-guru" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#06b6d4" />
                    <stop offset="100%" stop-color="#0891b2" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#grad-guru)" />
            <path d="M50 22 C62 38 78 45 78 58 C78 72 65 80 50 80 C35 80 22 72 22 58 C22 45 38 38 50 22 Z" fill="none" stroke="#ffffff" stroke-width="4" />
            <circle cx="50" cy="48" r="8" fill="#ffffff" />
            <circle cx="50" cy="65" r="12" fill="none" stroke="#ffffff" stroke-width="3" />
        </svg>`,
        check: (habits, logsCount, maxStreak) => habits.length >= 5
    },
    {
        id: 'perfect_day',
        name: 'Perfect Day',
        desc: 'Complete all habits scheduled for a single day.',
        icon: `<svg viewBox="0 0 100 100" class="badge-svg">
            <defs>
                <linearGradient id="grad-perfect" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ec4899" />
                    <stop offset="100%" stop-color="#be185d" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#grad-perfect)" />
            <polygon points="50,18 59,38 80,38 64,52 70,72 50,60 30,72 36,52 20,38 41,38" fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
            <circle cx="50" cy="48" r="4" fill="#ffffff" />
        </svg>`,
        check: (habits, logsCount, maxStreak, perfectDaysCount) => perfectDaysCount >= 1
    },
    {
        id: 'half_century',
        name: 'Half Century',
        desc: 'Reach 50 total completions across all habits.',
        icon: `<svg viewBox="0 0 100 100" class="badge-svg">
            <defs>
                <linearGradient id="grad-half" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6366f1" />
                    <stop offset="100%" stop-color="#4f46e5" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#grad-half)" />
            <circle cx="50" cy="50" r="28" fill="none" stroke="#ffffff" stroke-width="3" />
            <text x="50" y="58" font-family="'Outfit', sans-serif" font-weight="800" font-size="24" fill="#ffffff" text-anchor="middle">50</text>
        </svg>`,
        check: (habits, logsCount, maxStreak) => logsCount >= 50
    },
    {
        id: 'century_club',
        name: 'Century Club',
        desc: 'Reach 100 total completions across all habits.',
        icon: `<svg viewBox="0 0 100 100" class="badge-svg">
            <defs>
                <linearGradient id="grad-century" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#a855f7" />
                    <stop offset="100%" stop-color="#7e22ce" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#grad-century)" />
            <polygon points="50,22 62,38 78,40 68,54 70,72 50,65 30,72 32,54 22,40 38,38" fill="none" stroke="#ffffff" stroke-width="3" stroke-linejoin="round" />
            <text x="50" y="56" font-family="'Outfit', sans-serif" font-weight="800" font-size="18" fill="#ffffff" text-anchor="middle">100</text>
        </svg>`,
        check: (habits, logsCount, maxStreak) => logsCount >= 100
    }
];

// ==========================================================================
// 2. Storage Helpers
// ==========================================================================

function loadState() {
    const saved = localStorage.getItem('aurahabit_state');
    if (saved) {
        try {
            state = JSON.parse(saved);
            // Ensure fields exist
            state.users = state.users || {};
            state.habits = state.habits || [];
            state.settings = state.settings || { theme: 'dark', notifications: true };
            state.unlockedAchievements = state.unlockedAchievements || {};
        } catch (e) {
            console.error('Error loading state, resetting to default', e);
            state = { ...DEFAULT_STATE };
        }
    } else {
        state = { ...DEFAULT_STATE };
    }
}

function saveState() {
    localStorage.setItem('aurahabit_state', JSON.stringify(state));
}

// ==========================================================================
// 3. Routing Engine & UI Toggles
// ==========================================================================

let activeView = 'dashboard';
let viewHistory = [];
let selectedHabitId = null; // Used for Habit Details view
let activeCalendarDate = new Date(); // Track current month displayed in calendar details

function navigateTo(viewName, params = {}) {
    console.log('Navigating to:', viewName, params);
    
    // Auth guard
    if (!state.currentUser && !['login-view', 'signup-view', 'forgot-view'].includes(viewName)) {
        viewName = 'login-view';
    }

    // Handle view switches
    const authWrapper = document.getElementById('auth-container');
    const appWrapper = document.getElementById('dashboard-layout');

    // 1. Hide all elements first
    authWrapper.classList.add('hidden');
    appWrapper.classList.add('hidden');
    
    const views = document.querySelectorAll('.app-view');
    views.forEach(v => v.classList.add('hidden'));

    const authViews = ['login-view', 'signup-view', 'forgot-view'];
    
    if (authViews.includes(viewName)) {
        authWrapper.classList.remove('hidden');
        authViews.forEach(v => {
            const el = document.getElementById(v);
            if (v === viewName) el.classList.remove('hidden');
            else el.classList.add('hidden');
        });
    } else {
        appWrapper.classList.remove('hidden');
        
        let targetViewId = 'view-' + viewName;
        // Exception mapping if viewName matches page structure
        if (viewName === 'add-habit-page') {
            targetViewId = 'view-add-habit-page';
        }

        const targetEl = document.getElementById(targetViewId);
        if (targetEl) {
            targetEl.classList.remove('hidden');
        }

        // Update nav active states
        updateNavigationActiveState(viewName);
    }

    activeView = viewName;
    
    // Process parameter setups
    if (viewName === 'dashboard') {
        renderDashboard();
    } else if (viewName === 'add-habit-page') {
        setupHabitForm(params.editHabitId);
    } else if (viewName === 'analytics') {
        renderAnalytics();
    } else if (viewName === 'achievements') {
        renderAchievements();
    } else if (viewName === 'settings') {
        renderSettings();
    } else if (viewName === 'habit-details') {
        if (params.habitId) {
            selectedHabitId = params.habitId;
            activeCalendarDate = new Date(); // Reset calendar view to current month
            renderHabitDetails(params.habitId);
        }
    }

    // Smooth scroll page to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavigationActiveState(viewName) {
    // Desktop sidebar nav
    const sidebarItems = document.querySelectorAll('.sidebar-nav .nav-item');
    sidebarItems.forEach(item => {
        const target = item.getAttribute('data-target');
        if (target === viewName || (viewName === 'habit-details' && target === 'dashboard')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Mobile bottom nav
    const mobileItems = document.querySelectorAll('.mobile-nav .mobile-nav-item');
    mobileItems.forEach(item => {
        const target = item.getAttribute('data-target');
        if (target === viewName || (viewName === 'habit-details' && target === 'dashboard')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ==========================================================================
// 4. Utility Date Functions
// ==========================================================================

function getTodayString() {
    const today = new Date();
    return formatDateString(today);
}

function formatDateString(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function getDayOfWeek(dateString) {
    // Returns 0 for Sunday, 1 for Monday, etc.
    const date = new Date(dateString);
    return date.getDay();
}

function getFormattedFriendlyDate(date) {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ==========================================================================
// 5. Streaks & Metrics Calculations Engine
// ==========================================================================

/**
 * Calculates current streak and longest streak for a habit.
 * Correctly accounts for scheduled weekdays rather than just absolute consecutive days.
 */
function calculateHabitStreaks(habit) {
    const completed = habit.completedDates || {};
    const scheduledDays = habit.frequency || [0,1,2,3,4,5,6]; // default everyday
    const creationDateStr = habit.createdDate.split('T')[0];
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // We will check backward from today
    const today = new Date();
    const creationDate = new Date(creationDateStr);
    
    // For longest streak, we scan forward from creation date to today
    let checkDate = new Date(creationDate);
    const endScanDate = new Date(today);
    endScanDate.setDate(endScanDate.getDate() + 1); // include today in scan

    while (checkDate < endScanDate) {
        const dateStr = formatDateString(checkDate);
        const dayOfWeek = checkDate.getDay();
        
        if (scheduledDays.includes(dayOfWeek)) {
            // It's a scheduled day. Check if completed
            if (completed[dateStr]) {
                tempStreak++;
                if (tempStreak > longestStreak) {
                    longestStreak = tempStreak;
                }
            } else {
                // If it is today and hasn't been done yet, don't break the streak scan
                // but break it if it's in the past.
                if (dateStr !== getTodayString()) {
                    tempStreak = 0;
                }
            }
        }
        
        // Next day
        checkDate.setDate(checkDate.getDate() + 1);
    }
    
    // For current streak, check backward from today
    let backwardDate = new Date(today);
    let isStreakBroken = false;
    let firstCheck = true;
    
    while (backwardDate >= creationDate && !isStreakBroken) {
        const dateStr = formatDateString(backwardDate);
        const dayOfWeek = backwardDate.getDay();
        
        if (scheduledDays.includes(dayOfWeek)) {
            if (completed[dateStr]) {
                currentStreak++;
            } else {
                // If it's today and not completed yet, we keep the streak alive by checking yesterday
                // Otherwise, the streak is broken.
                if (firstCheck && dateStr === getTodayString()) {
                    // Do nothing, let scan continue to yesterday
                } else {
                    isStreakBroken = true;
                }
            }
        }
        firstCheck = false;
        backwardDate.setDate(backwardDate.getDate() - 1);
    }

    return { currentStreak, longestStreak };
}

/**
 * Calculate user global metrics:
 * - Total completions across all habits
 * - Max streak across all habits
 * - Total perfect days (all scheduled habits done on a single calendar day)
 */
function calculateGlobalMetrics() {
    const userHabits = state.habits.filter(h => h.userEmail === state.currentUser);
    
    let totalCompletions = 0;
    let maxStreak = 0;
    
    userHabits.forEach(habit => {
        totalCompletions += Object.keys(habit.completedDates || {}).length;
        const streaks = calculateHabitStreaks(habit);
        if (streaks.longestStreak > maxStreak) {
            maxStreak = streaks.longestStreak;
        }
    });

    // Calculate perfect days count
    // Scan last 60 days
    let perfectDaysCount = 0;
    const today = new Date();
    
    for (let i = 0; i < 60; i++) {
        const scanDate = new Date(today);
        scanDate.setDate(scanDate.getDate() - i);
        const dateStr = formatDateString(scanDate);
        const dayOfWeek = scanDate.getDay();
        
        // Find habits scheduled on this day
        const scheduledToday = userHabits.filter(h => h.frequency.includes(dayOfWeek));
        
        if (scheduledToday.length > 0) {
            // Check if all scheduled habits are completed on this dateStr
            const allCompleted = scheduledToday.every(h => h.completedDates && h.completedDates[dateStr]);
            if (allCompleted) {
                perfectDaysCount++;
            }
        }
    }

    return { totalCompletions, maxStreak, perfectDaysCount };
}

// ==========================================================================
// 6. Achievements / Badges Engine
// ==========================================================================

function checkAndAwardAchievements() {
    if (!state.currentUser) return;
    
    const userHabits = state.habits.filter(h => h.userEmail === state.currentUser);
    const metrics = calculateGlobalMetrics();
    
    if (!state.unlockedAchievements[state.currentUser]) {
        state.unlockedAchievements[state.currentUser] = {};
    }
    
    const currentUnlocks = state.unlockedAchievements[state.currentUser];
    let newlyUnlocked = [];

    ACHIEVEMENTS_LIST.forEach(badge => {
        // Skip if already unlocked
        if (currentUnlocks[badge.id]) return;

        // Run check
        const passed = badge.check(userHabits, metrics.totalCompletions, metrics.maxStreak, metrics.perfectDaysCount);
        if (passed) {
            const unlockDateStr = getFormattedFriendlyDate(new Date());
            currentUnlocks[badge.id] = unlockDateStr;
            newlyUnlocked.push(badge);
        }
    });

    if (newlyUnlocked.length > 0) {
        saveState();
        // Trigger celebration modal for the first unlocked badge
        showCelebration(newlyUnlocked[0]);
        // Show toasts for any subsequent ones
        for (let i = 1; i < newlyUnlocked.length; i++) {
            showToast(`Unlocked: ${newlyUnlocked[i].name}!`, 'success');
        }
    }
}

function showCelebration(badge) {
    const modal = document.getElementById('celebration-modal');
    const badgeSvgContainer = document.getElementById('celebration-badge-svg');
    const badgeName = document.getElementById('celebration-badge-name');
    const badgeDesc = document.getElementById('celebration-badge-desc');

    badgeSvgContainer.innerHTML = badge.icon;
    badgeName.textContent = badge.name;
    badgeDesc.textContent = badge.desc;

    // Trigger visual confetti particles
    triggerConfettiEffect();

    modal.classList.remove('hidden');
}

function triggerConfettiEffect() {
    const container = document.querySelector('.confetti-container');
    container.innerHTML = ''; // Clear previous
    const colors = ['#6366f1', '#a855f7', '#10b981', '#fbbf24', '#ec4899', '#06b6d4'];
    
    for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.classList.add('confetti-particle');
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 20 - 10 + '%';
        p.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // CSS anim values
        p.style.setProperty('--x', (Math.random() * 300 - 150) + 'px');
        p.style.setProperty('--y', (Math.random() * 250 + 150) + 'px');
        p.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
        
        p.style.animation = `confetti-fall ${Math.random() * 2 + 1.5}s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`;
        container.appendChild(p);
    }
}

// Add the confetti keyframe dynamically to CSS if not present
if (!document.getElementById('confetti-styles')) {
    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.textContent = `
        .confetti-particle {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 2px;
            opacity: 0.8;
            pointer-events: none;
        }
        @keyframes confetti-fall {
            0% {
                transform: translate3d(0, 0, 0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translate3d(var(--x), var(--y), 0) rotate(var(--r));
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ==========================================================================
// 7. Toast Notification System
// ==========================================================================

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    toast.innerHTML = `
        <i data-lucide="${icon}" class="toast-icon"></i>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    lucide.createIcons();
    
    // Automatically dismiss toast
    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3500);
}

// ==========================================================================
// 8. Auth Manager Logic
// ==========================================================================

function setupAuthForms() {
    // Login Submission
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;

        const user = state.users[email];
        if (user && user.password === password) {
            state.currentUser = email;
            saveState();
            showToast(`Welcome back, ${user.name}!`);
            updateProfileWidgets();
            navigateTo('dashboard');
            
            // Clean inputs
            document.getElementById('login-password').value = '';
        } else {
            showToast('Invalid email or password credentials.', 'error');
        }
    });

    // Signup Submission
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim().toLowerCase();
        const password = document.getElementById('signup-password').value;
        const populateMock = document.getElementById('signup-mockdata').checked;

        if (state.users[email]) {
            showToast('Email address already registered.', 'error');
            return;
        }

        // Create User
        const colors = ['violet', 'blue', 'emerald', 'amber', 'rose', 'slate'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        state.users[email] = {
            name,
            email,
            password,
            avatarColor: randomColor,
            signupDate: new Date().toISOString()
        };

        state.currentUser = email;
        
        // Populating Mock Data if checked
        if (populateMock) {
            generateMockHabitsForUser(email);
        }

        saveState();
        showToast('Account successfully created!');
        updateProfileWidgets();
        navigateTo('dashboard');

        // Check for Guru badge right away if mock habits added
        checkAndAwardAchievements();

        // Clear forms
        document.getElementById('signup-name').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-password').value = '';
    });

    // Forgot Password Submit
    document.getElementById('forgot-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value.trim().toLowerCase();
        
        if (state.users[email]) {
            const userPassword = state.users[email].password;
            // For testing convenience, we'll tell the user the password in a real alert/toast
            showToast(`Password Recovery: Your password is "${userPassword}"`, 'success');
            navigateTo('login-view');
        } else {
            showToast('Email address not registered in system.', 'error');
        }
    });

    // Navigation switches inside Auth Card
    document.getElementById('goto-signup-btn').addEventListener('click', (e) => { e.preventDefault(); navigateTo('signup-view'); });
    document.getElementById('goto-login-btn').addEventListener('click', (e) => { e.preventDefault(); navigateTo('login-view'); });
    document.getElementById('goto-forgot-btn').addEventListener('click', (e) => { e.preventDefault(); navigateTo('forgot-view'); });
    document.getElementById('goto-login-from-forgot').addEventListener('click', (e) => { e.preventDefault(); navigateTo('login-view'); });
}

function logout() {
    state.currentUser = null;
    saveState();
    showToast('Successfully signed out.');
    navigateTo('login-view');
}

function updateProfileWidgets() {
    const user = state.users[state.currentUser];
    if (!user) return;

    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    // Sidebar profile
    document.getElementById('sidebar-name').textContent = user.name;
    document.getElementById('sidebar-email').textContent = user.email;
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    sidebarAvatar.textContent = initials;
    sidebarAvatar.className = `profile-avatar bg-${user.avatarColor || 'violet'}`;

    // Header profile
    const headerAvatar = document.getElementById('header-avatar');
    headerAvatar.textContent = initials;
    headerAvatar.className = `profile-avatar header-avatar bg-${user.avatarColor || 'violet'}`;

    // Greeting Banner
    const today = new Date();
    const hours = today.getHours();
    let greeting = 'Good evening';
    if (hours < 12) greeting = 'Good morning';
    else if (hours < 18) greeting = 'Good afternoon';
    
    document.getElementById('header-greeting').textContent = `${greeting}, ${user.name.split(' ')[0]}`;
    document.getElementById('header-date').textContent = getFormattedFriendlyDate(today);
}

// ==========================================================================
// 9. Mock Habits Generation Data
// ==========================================================================

function generateMockHabitsForUser(email) {
    const today = new Date();
    
    // Generate dates going back 35 days
    const habitsData = [
        {
            name: "Morning Meditation",
            desc: "10 minutes of deep box breathing",
            category: "Mind",
            time: "Morning",
            freq: [0, 1, 2, 3, 4, 5, 6], // everyday
            completionRatio: 0.85, // 85% completion rate
            streakSeed: 12 // seed a current 12-day streak
        },
        {
            name: "Gym Workout",
            desc: "Strength training & cardio workout",
            category: "Health",
            time: "Afternoon",
            freq: [1, 3, 5], // Mon, Wed, Fri
            completionRatio: 0.9,
            streakSeed: 8
        },
        {
            name: "Read 15 Pages",
            desc: "Read personal growth or tech books",
            category: "Custom",
            time: "Evening",
            freq: [0, 1, 2, 3, 4, 5, 6], // everyday
            completionRatio: 0.7,
            streakSeed: 5
        },
        {
            name: "Track Daily Expenses",
            desc: "Log daily spending in budget app",
            category: "Finance",
            time: "Evening",
            freq: [0, 1, 2, 3, 4, 5, 6], // everyday
            completionRatio: 0.6,
            streakSeed: 2
        }
    ];

    habitsData.forEach((h, index) => {
        const createdDate = new Date();
        createdDate.setDate(today.getDate() - 35); // Created 35 days ago

        const habitId = 'habit_' + Date.now() + '_' + index;
        const completedDates = {};

        // Generate completion log
        for (let i = 35; i >= 0; i--) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateStr = formatDateString(checkDate);
            const dayOfWeek = checkDate.getDay();

            // Only complete if scheduled for this weekday
            if (h.freq.includes(dayOfWeek)) {
                // If it falls within the current streakSeed count, force complete
                if (i <= h.streakSeed) {
                    completedDates[dateStr] = true;
                } else {
                    // Otherwise complete based on random completion ratio
                    if (Math.random() < h.completionRatio) {
                        completedDates[dateStr] = true;
                    }
                }
            }
        }

        state.habits.push({
            id: habitId,
            userEmail: email,
            name: h.name,
            description: h.desc,
            category: h.category,
            frequency: h.freq,
            timeOfDay: h.time,
            createdDate: createdDate.toISOString(),
            completedDates: completedDates
        });
    });
}

// ==========================================================================
// 10. Dashboard Controller (View rendering & interactions)
// ==========================================================================

let dashboardFilter = 'all';

function setupDashboardHandlers() {
    // Habits quick filters
    const filterBtns = document.querySelectorAll('.habits-filter-controls .filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            dashboardFilter = this.getAttribute('data-filter');
            renderDashboardHabitList();
        });
    });

    // Empty state Add Habit button
    document.getElementById('dashboard-empty-add-btn').addEventListener('click', () => {
        navigateTo('add-habit-page');
    });
}

function renderDashboard() {
    updateProfileWidgets();
    renderDashboardStats();
    renderDashboardHabitList();
}

function renderDashboardStats() {
    const userHabits = state.habits.filter(h => h.userEmail === state.currentUser);
    const todayStr = getTodayString();
    const todayDayOfWeek = new Date().getDay();

    // Habits scheduled for today
    const scheduledToday = userHabits.filter(h => h.frequency.includes(todayDayOfWeek));
    const completedToday = scheduledToday.filter(h => h.completedDates && h.completedDates[todayStr]);
    
    // 1. Completion Progress Circular Ring
    const progressPct = scheduledToday.length > 0 ? Math.round((completedToday.length / scheduledToday.length) * 100) : 0;
    
    document.getElementById('dashboard-progress-pct').textContent = `${progressPct}%`;
    document.getElementById('dashboard-progress-ratio').textContent = `${completedToday.length} of ${scheduledToday.length} habits complete`;

    // SVG Ring stroke offset (radius 40, circumference 2 * pi * r = 251.2)
    const ring = document.getElementById('dashboard-progress-ring');
    const offset = 251.2 - (251.2 * progressPct) / 100;
    ring.style.strokeDashoffset = offset;

    // 2. Streaks Panel
    const globalMetrics = calculateGlobalMetrics();
    document.getElementById('dashboard-streak').textContent = globalMetrics.maxStreak;
    
    let subtext = 'Start checking off habits to ignite!';
    if (globalMetrics.maxStreak > 0) {
        if (globalMetrics.maxStreak >= 30) subtext = 'Incredible dedication! You are a king!';
        else if (globalMetrics.maxStreak >= 7) subtext = 'Excellent work! Keep it burning!';
        else subtext = 'Off to a great start. Keep consistency!';
    }
    document.getElementById('dashboard-streak-subtext').textContent = subtext;

    // 3. Weekly Completion Rate
    // Calculate completions in last 7 days vs scheduled in last 7 days
    let totalScheduledLast7Days = 0;
    let totalCompletionsLast7Days = 0;
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = formatDateString(date);
        const dayOfWeek = date.getDay();

        userHabits.forEach(h => {
            if (h.frequency.includes(dayOfWeek)) {
                totalScheduledLast7Days++;
                if (h.completedDates && h.completedDates[dateStr]) {
                    totalCompletionsLast7Days++;
                }
            }
        });
    }

    const weeklyRate = totalScheduledLast7Days > 0 ? Math.round((totalCompletionsLast7Days / totalScheduledLast7Days) * 100) : 0;
    document.getElementById('dashboard-weekly-rate').textContent = `${weeklyRate}%`;
    document.getElementById('dashboard-weekly-subtext').textContent = `${totalCompletionsLast7Days} logs in past 7 days`;
}

function renderDashboardHabitList() {
    const container = document.getElementById('habits-list-container');
    const emptyState = document.getElementById('dashboard-empty-state');
    
    const userHabits = state.habits.filter(h => h.userEmail === state.currentUser);
    const todayStr = getTodayString();
    const todayDayOfWeek = new Date().getDay();

    container.innerHTML = '';

    if (userHabits.length === 0) {
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
        document.getElementById('dashboard-active-count').textContent = '0';
        return;
    }

    emptyState.classList.add('hidden');
    container.classList.remove('hidden');

    // Filter by Time of Day if requested
    let filteredHabits = userHabits;
    if (dashboardFilter !== 'all') {
        filteredHabits = userHabits.filter(h => h.timeOfDay.toLowerCase() === dashboardFilter);
    }

    // Sort: Active habits first, then completed habits.
    // Also, highlight if they are scheduled for today or not.
    const scheduledHabits = [];
    const nonScheduledHabits = [];

    filteredHabits.forEach(h => {
        if (h.frequency.includes(todayDayOfWeek)) {
            scheduledHabits.push(h);
        } else {
            nonScheduledHabits.push(h);
        }
    });

    // Sort scheduled habits so completed sit at the bottom of the list
    scheduledHabits.sort((a, b) => {
        const aDone = a.completedDates && a.completedDates[todayStr];
        const bDone = b.completedDates && b.completedDates[todayStr];
        if (aDone && !bDone) return 1;
        if (!aDone && bDone) return -1;
        return 0;
    });

    const finalHabitsList = [...scheduledHabits, ...nonScheduledHabits];
    document.getElementById('dashboard-active-count').textContent = scheduledHabits.length;

    if (finalHabitsList.length === 0) {
        container.innerHTML = `
            <div class="no-filter-results" style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-muted);">
                <p>No habits scheduled for ${dashboardFilter} time.</p>
            </div>
        `;
        return;
    }

    finalHabitsList.forEach(habit => {
        const isScheduledToday = habit.frequency.includes(todayDayOfWeek);
        const isCompletedToday = habit.completedDates && habit.completedDates[todayStr];
        const streak = calculateHabitStreaks(habit).currentStreak;

        const card = document.createElement('div');
        card.className = `habit-card ${isCompletedToday ? 'completed' : ''} ${!isScheduledToday ? 'non-scheduled' : ''}`;
        
        // Dynamic colors per category
        const catColorClass = 'tag-' + habit.category.toLowerCase();
        let catIndicatorStyle = 'background-color: var(--primary);';
        if (habit.category === 'Health') catIndicatorStyle = 'background-color: var(--success);';
        else if (habit.category === 'Mind') catIndicatorStyle = 'background-color: #a855f7;';
        else if (habit.category === 'Work') catIndicatorStyle = 'background-color: #3b82f6;';
        else if (habit.category === 'Finance') catIndicatorStyle = 'background-color: #f97316;';
        else if (habit.category === 'Social') catIndicatorStyle = 'background-color: #06b6d4;';

        card.innerHTML = `
            <div class="habit-card-left" onclick="navigateTo('habit-details', { habitId: '${habit.id}' })">
                <div class="category-indicator" style="${catIndicatorStyle}"></div>
                <div class="habit-card-body">
                    <span class="habit-category-tag ${catColorClass}">${habit.category}</span>
                    <h4 class="habit-title">${habit.name}</h4>
                    <div class="habit-card-meta">
                        <span class="habit-meta-streak">
                            <i data-lucide="flame"></i> ${streak}d streak
                        </span>
                        <span class="habit-meta-time">
                            <i data-lucide="clock"></i> ${habit.timeOfDay}
                        </span>
                        ${!isScheduledToday ? '<span class="rest-badge" style="font-size:0.75rem; background: rgba(255,255,255,0.05); padding:1px 6px; border-radius:4px; color: var(--text-muted);">Rest Day</span>' : ''}
                    </div>
                </div>
            </div>
            <div class="complete-btn-container">
                ${isScheduledToday ? `
                    <button class="check-button" aria-label="Mark Complete" onclick="toggleHabitCompletion('${habit.id}', event)">
                        <i data-lucide="check"></i>
                    </button>
                ` : `
                    <button class="check-button" style="opacity: 0.2; cursor: not-allowed;" disabled>
                        <i data-lucide="lock" style="width:14px; height:14px;"></i>
                    </button>
                `}
            </div>
        `;

        container.appendChild(card);
    });

    lucide.createIcons();
}

function toggleHabitCompletion(habitId, event) {
    if (event) event.stopPropagation(); // prevent opening habit details click
    
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;

    const todayStr = getTodayString();
    if (!habit.completedDates) habit.completedDates = {};

    if (habit.completedDates[todayStr]) {
        delete habit.completedDates[todayStr];
        showToast('Habit marked incomplete.');
    } else {
        habit.completedDates[todayStr] = true;
        showToast('Habit marked complete! Keep it up.', 'success');
    }

    saveState();
    renderDashboard();
    checkAndAwardAchievements();
}

// ==========================================================================
// 11. Add/Edit Habit Form Logic
// ==========================================================================

function setupHabitForm(editHabitId = null) {
    const form = document.getElementById('add-habit-page-form');
    const title = document.getElementById('habit-form-page-title');
    const saveBtn = document.getElementById('save-habit-form-btn');
    const idInput = document.getElementById('habit-form-id');

    // Reset checkboxes
    const dayCheckboxes = document.querySelectorAll('input[name="habit-days"]');
    dayCheckboxes.forEach(cb => cb.checked = true);

    if (editHabitId) {
        const habit = state.habits.find(h => h.id === editHabitId);
        if (habit) {
            title.textContent = 'Edit Habit';
            saveBtn.textContent = 'Save Changes';
            idInput.value = habit.id;

            document.getElementById('habit-name-input').value = habit.name;
            document.getElementById('habit-desc-input').value = habit.description || '';
            document.getElementById('habit-category').value = habit.category;
            document.getElementById('habit-time').value = habit.timeOfDay;

            // Set specific weekdays
            dayCheckboxes.forEach(cb => {
                const val = parseInt(cb.value);
                cb.checked = habit.frequency.includes(val);
            });
        }
    } else {
        title.textContent = 'Create New Habit';
        saveBtn.textContent = 'Create Habit';
        idInput.value = '';

        document.getElementById('habit-name-input').value = '';
        document.getElementById('habit-desc-input').value = '';
        document.getElementById('habit-category').value = 'Custom';
        document.getElementById('habit-time').value = 'Anytime';
    }
}

function handleHabitFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('habit-form-id').value;
    const name = document.getElementById('habit-name-input').value.trim();
    const description = document.getElementById('habit-desc-input').value.trim();
    const category = document.getElementById('habit-category').value;
    const timeOfDay = document.getElementById('habit-time').value;

    // Get checked weekdays
    const checkedDays = [];
    document.querySelectorAll('input[name="habit-days"]:checked').forEach(cb => {
        checkedDays.push(parseInt(cb.value));
    });

    if (checkedDays.length === 0) {
        showToast('Please select at least one active weekday.', 'error');
        return;
    }

    if (id) {
        // Edit flow
        const habit = state.habits.find(h => h.id === id);
        if (habit) {
            habit.name = name;
            habit.description = description;
            habit.category = category;
            habit.timeOfDay = timeOfDay;
            habit.frequency = checkedDays;
            
            showToast('Habit successfully updated.');
        }
    } else {
        // Add flow
        const newHabit = {
            id: 'habit_' + Date.now(),
            userEmail: state.currentUser,
            name: name,
            description: description,
            category: category,
            timeOfDay: timeOfDay,
            frequency: checkedDays,
            createdDate: new Date().toISOString(),
            completedDates: {}
        };
        state.habits.push(newHabit);
        showToast('New habit successfully created!', 'success');
    }

    saveState();
    checkAndAwardAchievements();
    navigateTo('dashboard');
}

// ==========================================================================
// 12. Settings Controller (General details & Theme management)
// ==========================================================================

let selectedAvatarColor = 'violet';

function renderSettings() {
    const user = state.users[state.currentUser];
    if (!user) return;

    document.getElementById('settings-display-name').value = user.name;
    document.getElementById('settings-email').value = user.email;

    // Dark mode check
    const darkToggle = document.getElementById('settings-darkmode-toggle');
    darkToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';

    // Avatar color load
    selectedAvatarColor = user.avatarColor || 'violet';
    const colorBtns = document.querySelectorAll('.avatar-colors-row .avatar-color-btn');
    colorBtns.forEach(btn => {
        const color = btn.getAttribute('data-color');
        if (color === selectedAvatarColor) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function setupSettingsHandlers() {
    // Avatar color clicks
    const colorBtns = document.querySelectorAll('.avatar-colors-row .avatar-color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            colorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedAvatarColor = this.getAttribute('data-color');
        });
    });

    // Profile submit
    document.getElementById('profile-details-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const newName = document.getElementById('settings-display-name').value.trim();
        const user = state.users[state.currentUser];

        if (user) {
            user.name = newName;
            user.avatarColor = selectedAvatarColor;
            saveState();
            updateProfileWidgets();
            showToast('Profile details updated successfully.', 'success');
        }
    });

    // System preferences dark mode toggle
    document.getElementById('settings-darkmode-toggle').addEventListener('change', function() {
        setAppTheme(this.checked ? 'dark' : 'light');
    });

    // System preferences notifications
    document.getElementById('settings-notifications-toggle').addEventListener('change', function() {
        state.settings.notifications = this.checked;
        saveState();
        showToast(`Notifications ${this.checked ? 'enabled' : 'disabled'}.`);
    });

    // Change Password submit
    document.getElementById('change-password-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const oldPass = document.getElementById('settings-old-pass').value;
        const newPass = document.getElementById('settings-new-pass').value;
        const user = state.users[state.currentUser];

        if (user) {
            if (user.password !== oldPass) {
                showToast('Incorrect current password.', 'error');
                return;
            }

            user.password = newPass;
            saveState();
            showToast('Password changed successfully!', 'success');
            
            // Reset fields
            document.getElementById('settings-old-pass').value = '';
            document.getElementById('settings-new-pass').value = '';
        }
    });
}

function setAppTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    state.settings.theme = themeName;
    saveState();
    
    // Sync header icon states
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        // Just let variables change
    }
}

// ==========================================================================
// 13. Habit Details Calendar & Screen Controller
// ==========================================================================

function renderHabitDetails(habitId) {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) {
        navigateTo('dashboard');
        return;
    }

    const streaks = calculateHabitStreaks(habit);
    const totalCompletions = Object.keys(habit.completedDates || {}).length;

    // Header info
    document.getElementById('detail-category-badge').textContent = `⭐ ${habit.category}`;
    document.getElementById('detail-habit-name').textContent = habit.name;
    document.getElementById('detail-habit-desc').textContent = habit.description || 'No description provided.';
    
    const creationDate = new Date(habit.createdDate);
    document.getElementById('detail-created-date').textContent = creationDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    // Weekday frequency text format
    const weekdaysNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let freqText = 'Everyday';
    if (habit.frequency.length < 7) {
        freqText = habit.frequency.map(d => weekdaysNames[d].substring(0, 3)).join(', ');
    }
    document.getElementById('detail-schedule-info').textContent = `${freqText} (${habit.timeOfDay})`;

    // Stats values
    document.getElementById('detail-streak-current').textContent = streaks.currentStreak;
    document.getElementById('detail-streak-longest').textContent = streaks.longestStreak;
    document.getElementById('detail-total-completed').textContent = totalCompletions;

    // Rate percent
    // Calculate total scheduled days since creation
    let scheduledDaysCount = 0;
    let tempDate = new Date(creationDate);
    const today = new Date();
    
    while (tempDate <= today) {
        const dayOfWeek = tempDate.getDay();
        if (habit.frequency.includes(dayOfWeek)) {
            scheduledDaysCount++;
        }
        tempDate.setDate(tempDate.getDate() + 1);
    }
    
    const ratePct = scheduledDaysCount > 0 ? Math.round((totalCompletions / scheduledDaysCount) * 100) : 0;
    document.getElementById('detail-completion-rate').textContent = `${ratePct}%`;

    // Render monthly calendar
    renderCalendarGrid(habit);
}

function renderCalendarGrid(habit) {
    const calendarDaysGrid = document.getElementById('detail-calendar-days');
    const calendarMonthTitle = document.getElementById('calendar-month-year-title');
    
    calendarDaysGrid.innerHTML = '';
    
    const year = activeCalendarDate.getFullYear();
    const month = activeCalendarDate.getMonth();
    
    // Set Header label "Month YYYY"
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    calendarMonthTitle.textContent = `${monthNames[month]} ${year}`;

    // Get first day of month (e.g. 0 for Sun, 1 for Mon)
    const firstDayIndex = new Date(year, month, 1).getDay();
    
    // Get total days in month
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    // Empty cells for alignment before first day of month
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day-cell empty-cell';
        calendarDaysGrid.appendChild(emptyCell);
    }

    // Days cells
    const todayStr = getTodayString();
    const creationDateStr = habit.createdDate.split('T')[0];
    const creationDate = new Date(creationDateStr);

    for (let day = 1; day <= totalDays; day++) {
        const dayDate = new Date(year, month, day);
        const dayDateStr = formatDateString(dayDate);
        const dayOfWeek = dayDate.getDay();
        
        const cell = document.createElement('div');
        cell.className = 'calendar-day-cell';
        cell.textContent = day;

        // Check date logic
        const isBeforeCreation = dayDate < new Date(year, month, day, 23, 59, 59) && dayDate < creationDate;
        const isFuture = dayDate > new Date();

        if (dayDateStr === todayStr) {
            cell.classList.add('today-cell');
        }

        if (habit.completedDates && habit.completedDates[dayDateStr]) {
            cell.classList.add('completed-day');
        } else if (isBeforeCreation || isFuture) {
            // Disabled styling for dates before habit was created or in the future
            cell.classList.add('rest-day');
        } else if (!habit.frequency.includes(dayOfWeek)) {
            // Day was not scheduled in frequency
            cell.classList.add('rest-day');
        } else {
            // Day was scheduled but not completed
            // standard layout styles apply
        }

        // Add click handler to toggle calendar history on past days!
        // This is a premium touch: users can correct historical slipups.
        if (!isFuture && !isBeforeCreation && habit.frequency.includes(dayOfWeek)) {
            cell.style.cursor = 'pointer';
            cell.title = "Click to toggle history";
            cell.addEventListener('click', () => {
                if (!habit.completedDates) habit.completedDates = {};
                
                if (habit.completedDates[dayDateStr]) {
                    delete habit.completedDates[dayDateStr];
                    showToast(`Logged incomplete for ${dayDate.toLocaleDateString()}`);
                } else {
                    habit.completedDates[dayDateStr] = true;
                    showToast(`Logged completion for ${dayDate.toLocaleDateString()}`, 'success');
                }
                saveState();
                renderHabitDetails(habit.id);
                checkAndAwardAchievements();
            });
        }

        calendarDaysGrid.appendChild(cell);
    }
}

function setupCalendarNavHandlers() {
    // Previous Month Click
    document.getElementById('calendar-prev-month').addEventListener('click', () => {
        activeCalendarDate.setMonth(activeCalendarDate.getMonth() - 1);
        if (selectedHabitId) {
            const habit = state.habits.find(h => h.id === selectedHabitId);
            renderCalendarGrid(habit);
        }
    });

    // Next Month Click
    document.getElementById('calendar-next-month').addEventListener('click', () => {
        activeCalendarDate.setMonth(activeCalendarDate.getMonth() + 1);
        if (selectedHabitId) {
            const habit = state.habits.find(h => h.id === selectedHabitId);
            renderCalendarGrid(habit);
        }
    });

    // Edit Button Habit Click
    document.getElementById('detail-edit-btn').addEventListener('click', () => {
        if (selectedHabitId) navigateTo('add-habit-page', { editHabitId: selectedHabitId });
    });

    // Delete Button Habit Click
    document.getElementById('detail-delete-btn').addEventListener('click', () => {
        document.getElementById('delete-modal').classList.remove('hidden');
    });

    // Confirm Delete
    document.getElementById('confirm-delete-btn').addEventListener('click', () => {
        if (selectedHabitId) {
            state.habits = state.habits.filter(h => h.id !== selectedHabitId);
            saveState();
            showToast('Habit successfully deleted.');
            document.getElementById('delete-modal').classList.add('hidden');
            navigateTo('dashboard');
        }
    });

    // Cancel Delete Modal
    document.getElementById('cancel-delete-btn').addEventListener('click', () => {
        document.getElementById('delete-modal').classList.add('hidden');
    });
    
    document.getElementById('delete-modal-overlay').addEventListener('click', () => {
        document.getElementById('delete-modal').classList.add('hidden');
    });
}

// ==========================================================================
// 14. Analytics Chart.js Rendering Logic
// ==========================================================================

let weeklyProgressChart = null;
let categoryDistributionChart = null;

function renderAnalytics() {
    const userHabits = state.habits.filter(h => h.userEmail === state.currentUser);
    const metrics = calculateGlobalMetrics();
    
    // Overview metrics
    document.getElementById('stats-total-completions').textContent = metrics.totalCompletions;
    document.getElementById('stats-longest-streak').textContent = metrics.maxStreak;
    
    // Calculate current month's completion percentage
    let currentMonthScheduled = 0;
    let currentMonthCompletions = 0;
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    userHabits.forEach(habit => {
        const creationDate = new Date(habit.createdDate);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const checkDate = new Date(currentYear, currentMonth, day);
            const dateStr = formatDateString(checkDate);
            const dayOfWeek = checkDate.getDay();
            
            // Check if day is before today, after creation date, and scheduled
            if (checkDate <= today && checkDate >= creationDate && habit.frequency.includes(dayOfWeek)) {
                currentMonthScheduled++;
                if (habit.completedDates && habit.completedDates[dateStr]) {
                    currentMonthCompletions++;
                }
            }
        }
    });

    const monthlyPct = currentMonthScheduled > 0 ? Math.round((currentMonthCompletions / currentMonthScheduled) * 100) : 0;
    document.getElementById('stats-monthly-pct').textContent = `${monthlyPct}%`;

    // Badge Count unlocked
    const unlockedBadges = state.unlockedAchievements[state.currentUser] ? Object.keys(state.unlockedAchievements[state.currentUser]).length : 0;
    document.getElementById('stats-unlocked-badges').textContent = `${unlockedBadges} / 8`;

    // Render Tables & Chart figures
    renderAnalyticsTable(userHabits);
    renderWeeklyProgressChart(userHabits);
    renderCategoryDistributionChart(userHabits);
}

function renderAnalyticsTable(userHabits) {
    const tbody = document.getElementById('analytics-table-body');
    tbody.innerHTML = '';

    if (userHabits.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    No performance data available. Add habits to begin logging.
                </td>
            </tr>
        `;
        return;
    }

    userHabits.forEach(habit => {
        const streaks = calculateHabitStreaks(habit);
        const totalCompletions = Object.keys(habit.completedDates || {}).length;

        // Calculate rate
        let scheduledCount = 0;
        let tempDate = new Date(habit.createdDate);
        const today = new Date();
        while (tempDate <= today) {
            if (habit.frequency.includes(tempDate.getDay())) {
                scheduledCount++;
            }
            tempDate.setDate(tempDate.getDate() + 1);
        }
        const ratePct = scheduledCount > 0 ? Math.round((totalCompletions / scheduledCount) * 100) : 0;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="performance-table-habit-name">${habit.name}</td>
            <td><span class="badge" style="background: rgba(99, 102, 241, 0.1); color: var(--primary-light);">${habit.category}</span></td>
            <td><strong>${streaks.currentStreak}d</strong> (max ${streaks.longestStreak}d)</td>
            <td>${totalCompletions} days</td>
            <td>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div class="ach-progress-bar-outer" style="width: 60px; height: 6px;">
                        <div class="ach-progress-bar-inner" style="width: ${ratePct}%; background-color: var(--success);"></div>
                    </div>
                    <span>${ratePct}%</span>
                </div>
            </td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="navigateTo('habit-details', { habitId: '${habit.id}' })">View Details</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function renderWeeklyProgressChart(userHabits) {
    if (weeklyProgressChart) {
        weeklyProgressChart.destroy();
    }

    const labels = [];
    const completionCounts = [];
    
    // Get last 7 days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // Label format (e.g. "Mon")
        const label = date.toLocaleDateString('en-US', { weekday: 'short' });
        labels.push(label);

        const dateStr = formatDateString(date);
        
        // Count completions across all habits
        let completions = 0;
        userHabits.forEach(h => {
            if (h.completedDates && h.completedDates[dateStr]) {
                completions++;
            }
        });
        completionCounts.push(completions);
    }

    const ctx = document.getElementById('weeklyProgressChart').getContext('2d');
    
    // Gradient fill for lines
    const fillGradient = ctx.createLinearGradient(0, 0, 0, 260);
    fillGradient.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
    fillGradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDark ? '#94a3b8' : '#475569';

    weeklyProgressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Completions',
                data: completionCounts,
                borderColor: '#6366f1',
                borderWidth: 3,
                pointBackgroundColor: '#818cf8',
                pointBorderColor: '#ffffff',
                pointHoverRadius: 6,
                pointRadius: 4,
                tension: 0.35,
                fill: true,
                backgroundColor: fillGradient
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: {
                        color: textColor,
                        stepSize: 1,
                        beginAtZero: true
                    }
                }
            }
        }
    });
}

function renderCategoryDistributionChart(userHabits) {
    if (categoryDistributionChart) {
        categoryDistributionChart.destroy();
    }

    const categories = ['Health', 'Mind', 'Work', 'Finance', 'Social', 'Custom'];
    const completionsData = [0, 0, 0, 0, 0, 0];

    // Compute completions count per category
    userHabits.forEach(habit => {
        const categoryIndex = categories.indexOf(habit.category);
        if (categoryIndex !== -1) {
            const completionsCount = Object.keys(habit.completedDates || {}).length;
            completionsData[categoryIndex] += completionsCount;
        }
    });

    const ctx = document.getElementById('categoryDistributionChart').getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const legendColor = isDark ? '#f8fafc' : '#0f172a';

    categoryDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: completionsData,
                backgroundColor: [
                    '#10b981', // Health - success
                    '#a855f7', // Mind
                    '#3b82f6', // Work
                    '#f97316', // Finance
                    '#06b6d4', // Social
                    '#64748b'  // Custom
                ],
                borderWidth: isDark ? 2 : 1,
                borderColor: isDark ? '#0f172a' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: legendColor,
                        padding: 15,
                        font: { size: 11, family: "'Inter', sans-serif" }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

// ==========================================================================
// 15. Achievements Controller (Badges collection viewer)
// ==========================================================================

function renderAchievements() {
    const container = document.getElementById('achievements-badges-grid');
    container.innerHTML = '';

    const currentUnlocks = state.unlockedAchievements[state.currentUser] || {};
    const unlockedCount = Object.keys(currentUnlocks).length;
    const progressPct = Math.round((unlockedCount / ACHIEVEMENTS_LIST.length) * 100);

    // Update progress bars
    document.getElementById('ach-total-progress-bar').style.width = `${progressPct}%`;
    document.getElementById('ach-total-progress-text').textContent = `${unlockedCount} / 8 Badges Unlocked`;
    
    // Sidebar alert bubble
    const alertCount = document.getElementById('badge-alert-count');
    if (unlockedCount > 0) {
        alertCount.textContent = unlockedCount;
        alertCount.classList.remove('hidden');
    } else {
        alertCount.classList.add('hidden');
    }

    // Render individual badge cards
    ACHIEVEMENTS_LIST.forEach(badge => {
        const isUnlocked = !!currentUnlocks[badge.id];
        const unlockDate = currentUnlocks[badge.id];

        const card = document.createElement('div');
        card.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        let footerHtml = '';
        if (isUnlocked) {
            footerHtml = `<span class="badge-unlock-date">Unlocked ${unlockDate}</span>`;
        } else {
            // Render specific progress helper if locked
            const userHabits = state.habits.filter(h => h.userEmail === state.currentUser);
            const metrics = calculateGlobalMetrics();
            let progressRatio = 0;
            let progressText = 'Locked';

            if (badge.id === 'first_step') {
                progressRatio = Math.min(metrics.totalCompletions / 1, 1);
                progressText = `${metrics.totalCompletions}/1 log`;
            } else if (badge.id === 'threes_company') {
                progressRatio = Math.min(metrics.maxStreak / 3, 1);
                progressText = `${metrics.maxStreak}/3 streak`;
            } else if (badge.id === 'week_of_fire') {
                progressRatio = Math.min(metrics.maxStreak / 7, 1);
                progressText = `${metrics.maxStreak}/7 streak`;
            } else if (badge.id === 'consistency_king') {
                progressRatio = Math.min(metrics.maxStreak / 30, 1);
                progressText = `${metrics.maxStreak}/30 streak`;
            } else if (badge.id === 'habit_guru') {
                progressRatio = Math.min(userHabits.length / 5, 1);
                progressText = `${userHabits.length}/5 habits`;
            } else if (badge.id === 'perfect_day') {
                progressRatio = Math.min(metrics.perfectDaysCount / 1, 1);
                progressText = `${metrics.perfectDaysCount}/1 day`;
            } else if (badge.id === 'half_century') {
                progressRatio = Math.min(metrics.totalCompletions / 50, 1);
                progressText = `${metrics.totalCompletions}/50 logs`;
            } else if (badge.id === 'century_club') {
                progressRatio = Math.min(metrics.totalCompletions / 100, 1);
                progressText = `${metrics.totalCompletions}/100 logs`;
            }

            const progressPctInner = Math.round(progressRatio * 100);
            footerHtml = `
                <div class="badge-lock-progress">
                    <div class="badge-lock-progress-bar-outer">
                        <div class="badge-lock-progress-bar-inner" style="width: ${progressPctInner}%"></div>
                    </div>
                    <span class="badge-lock-progress-text">${progressText}</span>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="badge-svg-container">${badge.icon}</div>
            <h4 class="badge-title">${badge.name}</h4>
            <p class="badge-desc">${badge.desc}</p>
            ${footerHtml}
        `;

        container.appendChild(card);
    });
}

// ==========================================================================
// 16. Event Bindings & App Lifecycle Bootloader
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State Store
    loadState();

    // 2. Setup System Theme Settings
    const initialTheme = state.settings.theme || 'dark';
    document.documentElement.setAttribute('data-theme', initialTheme);

    // 3. Navigation link click bindings (Sidebar & mobile bottom bar)
    const navButtons = document.querySelectorAll('[data-target]');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            navigateTo(target);
        });
    });

    // Logout actions
    document.getElementById('sidebar-logout-btn').addEventListener('click', logout);

    // Theme toggle actions
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setAppTheme(nextTheme);
    });

    // Close Celebration click
    document.getElementById('close-celebration-btn').addEventListener('click', () => {
        document.getElementById('celebration-modal').classList.add('hidden');
    });

    // Cancel Habit form click
    document.getElementById('cancel-habit-form-btn').addEventListener('click', () => {
        navigateTo('dashboard');
    });

    // Submit Habit form
    document.getElementById('add-habit-page-form').addEventListener('submit', handleHabitFormSubmit);

    // Boot other settings
    setupAuthForms();
    setupDashboardHandlers();
    setupSettingsHandlers();
    setupCalendarNavHandlers();

    // 4. Initial Navigation Entry
    if (state.currentUser) {
        updateProfileWidgets();
        // Setup initial badge notification bubble counts
        const currentUnlocks = state.unlockedAchievements[state.currentUser] || {};
        const count = Object.keys(currentUnlocks).length;
        const alertCount = document.getElementById('badge-alert-count');
        if (count > 0 && alertCount) {
            alertCount.textContent = count;
            alertCount.classList.remove('hidden');
        }
        
        navigateTo('dashboard');
    } else {
        navigateTo('login-view');
    }

    // Render icons
    lucide.createIcons();
});
