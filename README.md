# ⚡ Multi-Environment Deployment System

> A DevOps CI/CD pipeline demonstration using **GitHub Actions** to automate deployments across Development, Testing, and Production environments.

![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=github-actions&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 📌 Project Overview

This project simulates how software companies deploy applications through multiple environments before reaching end users. The deployment pipeline follows industry best practices:

```
Development  →  Testing  →  Production
   (dev)         (test)       (main)
```

Each environment is triggered **automatically** when code is pushed to the corresponding Git branch, demonstrating real-world CI/CD workflows.

---

## 🎯 Key Features

- ✅ **Automated CI/CD Pipeline** — GitHub Actions triggers deployments on branch push
- ✅ **Three Environments** — Development, Testing, and Production
- ✅ **Interactive Environment Switcher** — Switch between environments to see UI differences
- ✅ **Monitoring Dashboard** — Real-time metrics with animated progress rings
- ✅ **Pipeline Visualization** — Visual representation of the deployment flow
- ✅ **Build Validation** — Automated file structure checks before deployment
- ✅ **Deployment Logging** — Structured logs with timestamps
- ✅ **Responsive Design** — Works on desktop, tablet, and mobile
- ✅ **Modern UI** — Dark theme with glassmorphism and smooth animations

---

## 🛠 Technologies Used

| Technology | Purpose |
|-----------|---------|
| HTML5 | Page structure & semantic markup |
| CSS3 | Styling, animations, responsive design |
| JavaScript | Environment detection, UI logic, metrics |
| Git | Version control & branching strategy |
| GitHub | Repository hosting & collaboration |
| GitHub Actions | CI/CD automation & deployment pipeline |

---

## 📂 Project Structure

```
multi-env-app/
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline configuration
│
├── index.html                  # Main application page
├── style.css                   # Main page styles
├── script.js                   # Environment logic & UI interactions
├── env.js                      # Environment variable configuration
│
├── dashboard.html              # Monitoring dashboard page
├── dashboard.css               # Dashboard styles
├── dashboard.js                # Metrics loading & animations
│
├── metrics.json                # Simulated infrastructure metrics
├── logs.txt                    # Deployment log entries
│
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## ⚙️ How It Works

### Branch → Environment Mapping

| Branch | Environment | Color Theme | Description |
|--------|-------------|-------------|-------------|
| `dev` | 🛠 Development | Green | New features are developed here |
| `test` | 🧪 Testing | Amber | QA verification & testing |
| `main` | 🚀 Production | Indigo | Live application for end users |

### GitHub Actions Workflow

The CI/CD pipeline consists of **three jobs**:

```
Build & Validate  →  Deploy  →  Notify
```

1. **Build & Validate** — Checks that all required files exist and reports project stats
2. **Deploy** — Deploys to the correct environment based on the branch
3. **Notify** — Outputs a deployment summary with status, commit, and metadata

### Environment Detection

The application determines the current environment using:
1. **`env.js`** configuration file (primary, for local development)
2. **URL path** detection (fallback, for deployed versions)

---

## 🚀 How to Run

### Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/multi-env-app.git
   cd multi-env-app
   ```

2. Open with VS Code Live Server or directly:
   ```bash
   # Option 1: Open in browser
   start index.html

   # Option 2: VS Code Live Server
   code . 
   # Then right-click index.html → Open with Live Server
   ```

3. Switch environments by editing `env.js`:
   ```javascript
   const ENV = "dev";   // Options: dev / test / prod
   ```

### Trigger CI/CD Pipeline

```bash
# Push to Development
git add .
git commit -m "Add new feature"
git push origin dev

# Push to Testing
git push origin test

# Push to Production
git push origin main
```

### View Workflow Results

1. Go to **GitHub → Repository → Actions**
2. Click on the latest workflow run
3. View logs for each job: Build, Deploy, Notify

---

## 📊 Monitoring Dashboard

The dashboard (`dashboard.html`) provides:

- **CPU Usage** — Animated circular progress ring
- **Memory Usage** — Color-coded health indicator
- **Uptime** — System availability percentage
- **Requests** — Current request throughput
- **Pipeline Status** — Visual deployment flow with timing
- **Deployment Logs** — Timestamped log entries

---

## 📊 Expected Output

### GitHub Actions Logs

| Branch | Environment | Workflow Output |
|--------|-------------|-----------------|
| `dev` | Development | `✅ Development deployment successful!` |
| `test` | Testing | `✅ Testing deployment successful!` |
| `main` | Production | `✅ Production deployment successful!` |

---

## ✅ Key Advantages

| Advantage | Description |
|-----------|-------------|
| **Automation** | No manual deployment — push code and it deploys |
| **Safety** | Bugs are caught in Dev/Test before reaching Production |
| **Traceability** | Every deployment is logged with commit hash & timestamp |
| **Scalability** | Easy to add more environments (staging, canary, etc.) |
| **Industry Standard** | Mirrors real-world DevOps practices used at companies |

---

## 📌 Conclusion

This project successfully demonstrates a **Multi-Environment Deployment Pipeline** using GitHub Actions. It simulates real-world DevOps practices where applications move through:

```
Development → Testing → Production
```

The automated CI/CD pipeline ensures safer releases, structured deployments, and complete traceability — all key principles of modern software engineering.

---

<p align="center">
  <b>Made with ❤️ using GitHub Actions CI/CD</b>
</p>