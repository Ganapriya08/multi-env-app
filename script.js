// ============================================
// Multi-Environment Deployment System
// Main Application Script
// ============================================

// Environment configuration map
const ENV_CONFIG = {
    dev: {
        title: "🛠 DEVELOPMENT",
        desc: "New features are being developed and tested here.",
        branch: "dev",
        badge: "Development",
        color: "#10b981",
        colorRgb: "16, 185, 129",
        gradient: "linear-gradient(135deg, #10b981, #34d399)",
        version: "v2.1.0-dev",
        status: "Building"
    },
    test: {
        title: "🧪 TESTING",
        desc: "Application verification and QA testing in progress.",
        branch: "test",
        badge: "Testing",
        color: "#f59e0b",
        colorRgb: "245, 158, 11",
        gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
        version: "v2.0.1-rc",
        status: "Validating"
    },
    prod: {
        title: "🚀 PRODUCTION",
        desc: "Final application deployed and live for end users.",
        branch: "main",
        badge: "Production",
        color: "#6366f1",
        colorRgb: "99, 102, 241",
        gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        version: "v2.0.0",
        status: "Live"
    }
};

// Determine environment from env.js or URL
let currentEnv = typeof ENV !== "undefined" ? ENV : "prod";

// Also check URL for branch hints (useful when deployed)
const path = window.location.pathname.toLowerCase();
if (path.includes("dev")) currentEnv = "dev";
else if (path.includes("test")) currentEnv = "test";

// Normalize "main" or "prod" to "prod"
if (currentEnv === "main") currentEnv = "prod";

/**
 * Apply environment configuration to the UI
 */
function applyEnvironment(env) {
    const config = ENV_CONFIG[env];
    if (!config) return;

    currentEnv = env;

    // Update CSS custom properties for theme
    const root = document.documentElement;
    root.style.setProperty("--env-color", config.color);
    root.style.setProperty("--env-color-rgb", config.colorRgb);
    root.style.setProperty("--env-glow", `rgba(${config.colorRgb}, 0.3)`);
    root.style.setProperty("--env-gradient", config.gradient);

    // Update text content
    document.getElementById("env-title").textContent = config.title;
    document.getElementById("env-desc").textContent = config.desc;
    document.getElementById("branch-name").textContent = config.branch;
    document.getElementById("badge-text").textContent = config.badge;
    document.getElementById("env-status").textContent = config.status;
    document.getElementById("env-version").textContent = config.version;

    // Update pipeline visualization
    updatePipeline(env);

    // Update active switch button
    document.querySelectorAll(".switch-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.getElementById(`btn-${env}`);
    if (activeBtn) activeBtn.classList.add("active");

    // Clear status message
    document.getElementById("status").textContent = "";
}

/**
 * Update the pipeline visualization based on current environment
 */
function updatePipeline(env) {
    const stages = ["dev", "test", "prod"];
    const currentIndex = stages.indexOf(env);

    stages.forEach((stage, index) => {
        const stageEl = document.getElementById(`stage-${stage}`);
        stageEl.classList.remove("completed", "active");

        if (index < currentIndex) {
            stageEl.classList.add("completed");
        } else if (index === currentIndex) {
            stageEl.classList.add("active");
        }
    });

    // Update pipeline lines
    const line1 = document.getElementById("line-1");
    const line2 = document.getElementById("line-2");

    line1.classList.toggle("active", currentIndex >= 1);
    line2.classList.toggle("active", currentIndex >= 2);
}

/**
 * Switch to a different environment (UI demo only)
 */
function switchEnv(env) {
    // Add a brief transition effect
    const container = document.getElementById("main-container");
    container.style.opacity = "0";
    container.style.transform = "translateY(10px)";

    setTimeout(() => {
        applyEnvironment(env);
        container.style.opacity = "1";
        container.style.transform = "translateY(0)";
    }, 300);
}

/**
 * Show deployment status with animation
 */
function showStatus() {
    const statusEl = document.getElementById("status");
    const config = ENV_CONFIG[currentEnv];

    // Typing animation effect
    const message = `${config.badge} Build Successful ✓`;
    statusEl.textContent = "";
    statusEl.style.opacity = "0";

    setTimeout(() => {
        statusEl.textContent = message;
        statusEl.style.opacity = "1";
    }, 200);
}

/**
 * Create floating background particles
 */
function createParticles() {
    const container = document.getElementById("particles");
    if (!container) return;

    const count = 15;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");

        const size = Math.random() * 200 + 50;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${15 + Math.random() * 15}s`;

        container.appendChild(particle);
    }
}

// ============================================
// Initialize on page load
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    createParticles();
    applyEnvironment(currentEnv);
});