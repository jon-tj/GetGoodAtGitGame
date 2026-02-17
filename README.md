# Get Good At Git Game

A fast-paced game where you race to `.gitignore` files as quickly as possible!

![VS Code-style interface](https://img.shields.io/badge/interface-VS%20Code%20style-007ACC)
![Pure HTML/CSS/JS](https://img.shields.io/badge/tech-HTML%2FCSS%2FJS-orange)

## About

Test your reflexes and Git knowledge in this speed-based challenge. A VS Code-like interface shows you a project's files — your goal is to add the right files to `.gitignore` as fast as possible. The quicker you ignore, the higher your score!

Learn which files should never be committed:
- `node_modules/`, `__pycache__/`, `venv/`
- `.env` files with API keys and secrets
- Build outputs like `dist/`, `.next/`, `coverage/`
- System files like `.DS_Store`
- And more!

## Game Modes

### 🎮 Normal Mode
Files are labeled with **IGNORE** or **KEEP** badges. Great for learning!

### 🔥 Pro Mode
No labels! You must click on files to preview their contents and determine if they contain sensitive data like API keys, secrets, or credentials. Only then can you decide what to ignore!

## How to Play

1. **Select a mode** — Normal (with hints) or Pro (no hints)
2. **View the file explorer** — See all files in the project
3. **Type filenames** — Enter file/folder names to add to `.gitignore`
4. **Press Enter** — Submit each entry
5. **Be fast & accurate** — Time bonus for speed, penalties for wrong guesses!

### Scoring
- ✅ Correct ignore: **+100 points**
- ⏱️ Time bonus: **+10 points** per second under 60s
- ❌ Wrong attempt: **-25 points** (ignoring files you shouldn't)

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/jon-tj/GetGoodAtGitGame.git
   ```
2. Open `index.html` in your browser — no build step required!

Or just open the folder in VS Code and use Live Server.

## Levels

1. **Beginner Basics** — Node.js project essentials
2. **Python Project** — Virtual envs and pycache
3. **Full Stack App** — React/Next.js build outputs
4. **DevOps Config** — Terraform, Docker, and secrets
5. **Pro Challenge** — Mixed files with hidden credentials

## Tech Stack

- Pure HTML5
- CSS3 (VS Code dark theme styling)
- Vanilla JavaScript (no dependencies!)

## Contributing

Contributions are welcome! Ideas for new levels, file scenarios, or features — feel free to open issues or submit pull requests.

## License

This project is open source.
