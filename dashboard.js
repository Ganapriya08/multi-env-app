// ============================================
// Multi-Environment Deployment System
// Dashboard — Prometheus · Grafana · ELK Stack
// ============================================

const CIRCUMFERENCE = 2 * Math.PI * 52;
let scrapeCount = 0;
let currentLogFilter = "all";
let logEntries = [];
let chartData = { cpu: [], memory: [], network: [], requests: [] };
let maxDataPoints = 60;

// Live metric state (simulated Prometheus scrape targets)
let liveMetrics = { cpu: 18, memory: 42, uptime: 99.9, requests: 1500, networkIn: 12.4, networkOut: 8.7 };

// ===================== TAB SWITCHING =====================
function switchTab(tab) {
    document.querySelectorAll(".tool-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    document.getElementById("tab-" + tab).classList.add("active");
    document.getElementById("content-" + tab).classList.add("active");
}

// ===================== PROMETHEUS =====================
function setRingProgress(ringId, percent) {
    const ring = document.getElementById(ringId);
    if (!ring) return;
    const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
    ring.style.strokeDasharray = CIRCUMFERENCE;
    ring.style.strokeDashoffset = offset;
    ring.style.stroke = percent < 50 ? "#10b981" : percent < 80 ? "#f59e0b" : "#ef4444";
}

function getStatus(value, type) {
    if (type === "cpu" || type === "memory") {
        if (value < 50) return { cls: "good", text: "● Healthy" };
        if (value < 80) return { cls: "warning", text: "● Moderate" };
        return { cls: "critical", text: "● High" };
    }
    if (type === "uptime") {
        if (value >= 99.5) return { cls: "good", text: "● Excellent" };
        if (value >= 95) return { cls: "warning", text: "● Fair" };
        return { cls: "critical", text: "● Degraded" };
    }
    if (type === "requests") {
        if (value < 5000) return { cls: "good", text: "● Normal" };
        if (value < 10000) return { cls: "warning", text: "● Elevated" };
        return { cls: "critical", text: "● Heavy" };
    }
    return { cls: "good", text: "● OK" };
}

function updateStatus(elementId, value, type) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const s = getStatus(value, type);
    el.textContent = s.text;
    el.className = "metric-status " + s.cls;
}

/** Simulate Prometheus scraping metrics */
function scrapeMetrics() {
    // Simulate realistic metric fluctuations
    liveMetrics.cpu = clamp(liveMetrics.cpu + (Math.random() - 0.48) * 8, 5, 95);
    liveMetrics.memory = clamp(liveMetrics.memory + (Math.random() - 0.5) * 4, 20, 90);
    liveMetrics.requests = clamp(liveMetrics.requests + (Math.random() - 0.5) * 300, 200, 8000);
    liveMetrics.networkIn = clamp(liveMetrics.networkIn + (Math.random() - 0.5) * 3, 1, 50);
    liveMetrics.networkOut = clamp(liveMetrics.networkOut + (Math.random() - 0.5) * 2, 0.5, 40);
    liveMetrics.uptime = clamp(liveMetrics.uptime + (Math.random() - 0.3) * 0.05, 95, 100);

    scrapeCount++;
    document.getElementById("scrape-count").textContent = scrapeCount;
    document.getElementById("prom-last-scrape").textContent = new Date().toLocaleTimeString();

    // Update Prometheus metric cards
    setRingProgress("ring-fill-cpu", liveMetrics.cpu);
    setRingProgress("ring-fill-memory", liveMetrics.memory);
    document.getElementById("cpu").textContent = liveMetrics.cpu.toFixed(1) + "%";
    document.getElementById("memory").textContent = liveMetrics.memory.toFixed(1) + "%";
    document.getElementById("uptime").textContent = liveMetrics.uptime.toFixed(1);
    document.getElementById("requests").textContent = Math.round(liveMetrics.requests).toLocaleString();

    updateStatus("cpu-status", liveMetrics.cpu, "cpu");
    updateStatus("memory-status", liveMetrics.memory, "memory");
    updateStatus("uptime-status", liveMetrics.uptime, "uptime");
    updateStatus("requests-status", liveMetrics.requests, "requests");

    // Update raw Prometheus metrics endpoint
    updatePrometheusEndpoint();

    // Push data for Grafana charts
    const now = new Date();
    chartData.cpu.push({ t: now, v: liveMetrics.cpu });
    chartData.memory.push({ t: now, v: liveMetrics.memory });
    chartData.network.push({ t: now, v: liveMetrics.networkIn });
    chartData.requests.push({ t: now, v: liveMetrics.requests });

    // Trim to max data points
    Object.keys(chartData).forEach(k => {
        if (chartData[k].length > maxDataPoints * 2) chartData[k] = chartData[k].slice(-maxDataPoints);
    });

    // Update Grafana live values
    document.getElementById("chart-cpu-val").textContent = liveMetrics.cpu.toFixed(1) + "%";
    document.getElementById("chart-mem-val").textContent = liveMetrics.memory.toFixed(1) + "%";
    document.getElementById("chart-net-val").textContent = liveMetrics.networkIn.toFixed(1) + " MB/s";
    document.getElementById("chart-req-val").textContent = Math.round(liveMetrics.requests) + " req/s";

    // Redraw Grafana charts
    drawChart("chart-cpu", chartData.cpu, "#6366f1", 0, 100);
    drawChart("chart-memory", chartData.memory, "#f59e0b", 0, 100);
    drawChart("chart-network", chartData.network, "#10b981", 0, 60);
    drawChart("chart-requests", chartData.requests, "#3b82f6", 0, 10000);

    // Update ELK stats
    document.getElementById("logstash-events").textContent = Math.round(5 + Math.random() * 15);
    document.getElementById("es-docs").textContent = logEntries.length.toLocaleString();
}

function updatePrometheusEndpoint() {
    const ts = Date.now();
    const text = `# HELP node_cpu_usage_percent Current CPU usage percentage
# TYPE node_cpu_usage_percent gauge
node_cpu_usage_percent{instance="multi-env-app:9090",env="production"} ${liveMetrics.cpu.toFixed(2)} ${ts}

# HELP node_memory_usage_percent Current memory usage percentage
# TYPE node_memory_usage_percent gauge
node_memory_usage_percent{instance="multi-env-app:9090",env="production"} ${liveMetrics.memory.toFixed(2)} ${ts}

# HELP node_uptime_percent System uptime percentage
# TYPE node_uptime_percent gauge
node_uptime_percent{instance="multi-env-app:9090",env="production"} ${liveMetrics.uptime.toFixed(4)} ${ts}

# HELP http_requests_total Total HTTP requests per second
# TYPE http_requests_total counter
http_requests_total{instance="multi-env-app:9090",method="GET",status="200"} ${Math.round(liveMetrics.requests * 0.85)} ${ts}
http_requests_total{instance="multi-env-app:9090",method="POST",status="200"} ${Math.round(liveMetrics.requests * 0.12)} ${ts}
http_requests_total{instance="multi-env-app:9090",method="GET",status="404"} ${Math.round(liveMetrics.requests * 0.03)} ${ts}

# HELP network_receive_bytes_total Network received MB/s
# TYPE network_receive_bytes_total gauge
network_receive_bytes_total{instance="multi-env-app:9090"} ${liveMetrics.networkIn.toFixed(2)} ${ts}

# HELP network_transmit_bytes_total Network transmitted MB/s
# TYPE network_transmit_bytes_total gauge
network_transmit_bytes_total{instance="multi-env-app:9090"} ${liveMetrics.networkOut.toFixed(2)} ${ts}

# HELP up Target up status
# TYPE up gauge
up{instance="multi-env-app:9090"} 1 ${ts}

# HELP scrape_duration_seconds Duration of last scrape
# TYPE scrape_duration_seconds gauge
scrape_duration_seconds{instance="multi-env-app:9090"} ${(Math.random() * 0.05 + 0.01).toFixed(4)} ${ts}`;

    document.getElementById("prom-metrics").textContent = text;
}

// ===================== GRAFANA CHARTS =====================
function drawChart(canvasId, data, color, minY, maxY) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
    const H = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    const pts = data.slice(-maxDataPoints);
    if (pts.length < 2) return;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = "rgba(148,163,184,0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = (h / 4) * i;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Data line
    const padX = 10, padY = 15;
    const range = maxY - minY || 1;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";

    pts.forEach((p, i) => {
        const x = padX + (i / (pts.length - 1)) * (w - padX * 2);
        const y = h - padY - ((p.v - minY) / range) * (h - padY * 2);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill gradient
    const lastX = padX + ((pts.length - 1) / (pts.length - 1)) * (w - padX * 2);
    ctx.lineTo(lastX, h);
    ctx.lineTo(padX, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + "30");
    grad.addColorStop(1, color + "05");
    ctx.fillStyle = grad;
    ctx.fill();

    // Current value dot
    if (pts.length > 0) {
        const last = pts[pts.length - 1];
        const lx = padX + ((pts.length - 1) / (pts.length - 1)) * (w - padX * 2);
        const ly = h - padY - ((last.v - minY) / range) * (h - padY * 2);
        ctx.beginPath();
        ctx.arc(lx, ly, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(lx, ly, 7, 0, Math.PI * 2);
        ctx.strokeStyle = color + "50";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function changeTimeRange() {
    maxDataPoints = parseInt(document.getElementById("grafana-range").value, 10);
}

// ===================== ELK STACK =====================
const LOG_TEMPLATES = [
    { level: "INFO", messages: [
        "Incoming request GET /api/v1/health",
        "Response sent 200 OK in {ms}ms",
        "Database connection pool: {n} active",
        "Cache hit ratio: {pct}%",
        "Scheduled job 'metrics-collector' completed",
        "SSL certificate valid for {n} more days",
        "Config reload triggered by env change",
        "Deployment webhook received from GitHub",
        "Health check passed for instance {id}",
        "Load balancer routing to node-{n}",
    ]},
    { level: "SUCCESS", messages: [
        "Deployment to production completed successfully",
        "All {n} test suites passed",
        "Database migration v{n} applied",
        "CI/CD pipeline finished — build #{n}",
        "SSL certificate renewed successfully",
        "Backup completed: {n}MB archived",
    ]},
    { level: "WARN", messages: [
        "High memory usage detected: {pct}%",
        "Slow query detected: {ms}ms on /api/metrics",
        "Rate limit approaching for IP 192.168.1.{n}",
        "Disk usage above 75% on /dev/sda1",
        "Connection pool nearing capacity: {n}/100",
        "Response time above threshold: {ms}ms",
    ]},
    { level: "ERROR", messages: [
        "Failed to connect to database: timeout after {ms}ms",
        "HTTP 500 on POST /api/deploy — retrying",
        "Certificate validation failed for *.example.com",
        "Out of memory on worker-{n} — restarting",
    ]},
    { level: "DEBUG", messages: [
        "Parsing request headers: content-type=application/json",
        "Middleware chain: auth → rate-limit → handler",
        "Query plan: sequential scan on metrics_table",
        "GC pause: {ms}ms — heap: {n}MB",
    ]},
];

function generateLogEntry() {
    // Weighted random: more INFO, fewer ERROR
    const weights = [50, 15, 15, 8, 12];
    let r = Math.random() * 100, idx = 0;
    for (let i = 0; i < weights.length; i++) {
        r -= weights[i];
        if (r <= 0) { idx = i; break; }
    }
    const group = LOG_TEMPLATES[idx];
    let msg = group.messages[Math.floor(Math.random() * group.messages.length)];
    msg = msg.replace("{ms}", Math.floor(Math.random() * 500 + 10));
    msg = msg.replace("{n}", Math.floor(Math.random() * 50 + 1));
    msg = msg.replace("{pct}", Math.floor(Math.random() * 40 + 55));
    msg = msg.replace("{id}", "i-" + Math.random().toString(36).substring(2, 8));

    return {
        time: new Date().toLocaleTimeString(),
        level: group.level,
        message: msg,
    };
}

function addLogEntry(entry) {
    logEntries.push(entry);
    renderFilteredLogs();
    updateLogCounts();
}

function renderFilteredLogs() {
    const container = document.getElementById("elk-logs");
    const searchTerm = (document.getElementById("elk-search").value || "").toLowerCase();

    let filtered = logEntries;
    if (currentLogFilter !== "all") {
        filtered = filtered.filter(e => e.level === currentLogFilter);
    }
    if (searchTerm) {
        filtered = filtered.filter(e =>
            e.message.toLowerCase().includes(searchTerm) ||
            e.level.toLowerCase().includes(searchTerm)
        );
    }

    // Only render last 200 for performance
    const visible = filtered.slice(-200);
    container.innerHTML = visible.map(e =>
        `<div class="log-entry">` +
        `<span class="log-time">${e.time}</span>` +
        `<span class="log-level ${e.level}">${e.level}</span>` +
        `<span class="log-msg">${e.message}</span>` +
        `</div>`
    ).join("");

    // Auto-scroll
    if (document.getElementById("elk-autoscroll").checked) {
        container.scrollTop = container.scrollHeight;
    }
}

function updateLogCounts() {
    const counts = { INFO: 0, SUCCESS: 0, WARN: 0, ERROR: 0, DEBUG: 0 };
    logEntries.forEach(e => { if (counts[e.level] !== undefined) counts[e.level]++; });
    document.getElementById("count-total").textContent = logEntries.length;
    document.getElementById("count-info").textContent = counts.INFO;
    document.getElementById("count-success").textContent = counts.SUCCESS;
    document.getElementById("count-warn").textContent = counts.WARN;
    document.getElementById("count-error").textContent = counts.ERROR;
    document.getElementById("count-debug").textContent = counts.DEBUG;
}

function setLogFilter(level) {
    currentLogFilter = level;
    document.querySelectorAll(".elk-filter").forEach(b => b.classList.remove("active"));
    document.querySelector(`.elk-filter[data-level="${level}"]`).classList.add("active");
    renderFilteredLogs();
}

function filterLogs() { renderFilteredLogs(); }

// ===================== UTILITIES =====================
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

// ===================== SEED INITIAL LOGS =====================
function seedLogs() {
    fetch("logs.txt")
        .then(r => r.text())
        .then(text => {
            text.split("\n").filter(l => l.trim()).forEach(line => {
                let level = "INFO";
                if (line.includes("[SUCCESS]")) level = "SUCCESS";
                else if (line.includes("[WARN]")) level = "WARN";
                else if (line.includes("[ERROR]")) level = "ERROR";
                else if (line.includes("[DEBUG]")) level = "DEBUG";
                else if (line.includes("[OK]")) level = "SUCCESS";
                const msg = line.replace(/\[.*?\]\s*/g, "").trim();
                const timeMatch = line.match(/\d{2}:\d{2}:\d{2}/);
                logEntries.push({ time: timeMatch ? timeMatch[0] : "00:00:00", level, message: msg });
            });
            renderFilteredLogs();
            updateLogCounts();
        })
        .catch(() => {});
}

// ===================== INIT =====================
document.addEventListener("DOMContentLoaded", () => {
    seedLogs();

    // Initial scrape
    scrapeMetrics();

    // Prometheus scrape interval — every 5 seconds
    setInterval(scrapeMetrics, 5000);

    // ELK log stream — new log every 2-4 seconds
    setInterval(() => {
        addLogEntry(generateLogEntry());
    }, 2000 + Math.random() * 2000);

    // Additional log burst occasionally
    setInterval(() => {
        const burst = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < burst; i++) {
            setTimeout(() => addLogEntry(generateLogEntry()), i * 300);
        }
    }, 8000);
});