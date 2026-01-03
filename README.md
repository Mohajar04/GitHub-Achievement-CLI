# 🏆 GitHub Achievements Manager

A powerful CLI tool to automatically unlock GitHub achievements through automated workflows. This tool helps you earn GitHub profile achievements like Pair Extraordinaire, Pull Shark, Quickdraw, and Galaxy Brain by automating the necessary actions.

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen" alt="Node Version">
  <img src="https://img.shields.io/badge/typescript-5.x-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-MIT-orange" alt="License">
</p>

## ✨ Features

- **Interactive CLI** - Beautiful, user-friendly command-line interface with colors and progress bars
- **Multiple Achievements** - Support for Pair Extraordinaire, Pull Shark, Quickdraw, and Galaxy Brain
- **Tier Selection** - Choose which tier level you want to achieve (Default, Bronze, Silver, Gold)
- **Progress Tracking** - SQLite database for persistent progress tracking
- **Resume Support** - Interrupted runs can be resumed from where they left off
- **Dry-Run Mode** - Preview actions without executing them
- **Fork-Friendly** - Easy setup for anyone who forks the repository
- **Rate Limit Aware** - Graceful handling of GitHub API rate limits
- **Detailed Logging** - Console and file logging for debugging

## 🎯 Supported Achievements

| Achievement | Description | Tiers | Status |
|-------------|-------------|-------|--------|
| **Pair Extraordinaire** | Coauthor commits on merged PRs | 1, 10, 24, 48 | ✅ Fully Automated |
| **Pull Shark** | Open merged pull requests | 2, 16, 128, 1024 | ✅ Fully Automated |
| **Quickdraw** | Close issue/PR within 5 minutes | 1 | ✅ Fully Automated |
| **Galaxy Brain** | Get accepted answers in Discussions | 2, 8, 16, 32 | ✅ Fully Automated |
| **Starstruck** | Get stars on your repository | 16, 128, 512, 4096 | ⚠️ Manual (requires real stars) |

## 🚀 Quick Start

### For Fork Users

1. **Fork this repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/GitHub-Achievements-Manager.git
   cd GitHub-Achievements-Manager
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run the tool** (setup wizard will guide you)
   ```bash
   npm start
   ```

That's it! The interactive setup wizard will help you configure your GitHub token and target repository.

## 📋 Prerequisites

- **Node.js** 16.0.0 or higher
- **npm** 7.x or higher
- **GitHub Personal Access Token** with `repo` scope

### Generating a GitHub Token

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Achievement Manager")
4. Select the **`repo`** scope (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** - you'll need it during setup

## 🛠️ Installation

### Method 1: Fork and Clone (Recommended)

```bash
# 1. Fork this repo on GitHub first, then:
git clone https://github.com/YOUR-USERNAME/GitHub-Achievements-Manager.git
cd GitHub-Achievements-Manager

# 2. Install dependencies
npm install

# 3. Build
npm run build

# 4. Run
npm start
```

### Method 2: Direct Clone

```bash
# Clone directly
git clone https://github.com/n0/GitHub-Achievements-Manager.git
cd GitHub-Achievements-Manager

# Install and build
npm install
npm run build

# Run
npm start
```

## 📖 Usage

### Interactive Mode (Default)

Simply run `npm start` for the interactive menu:

```bash
npm start
```

This will display:
1. Welcome banner
2. Main menu with options
3. Achievement selection (if running)
4. Tier selection for each achievement
5. Confirmation before execution
6. Real-time progress display
7. Final summary

### Command-Line Mode

```bash
# Run specific commands
npm start -- run              # Run achievement automation
npm start -- status           # Show current progress
npm start -- list             # List all achievements
npm start -- resume           # Resume interrupted run
npm start -- setup            # Re-run setup wizard

# With options
npm start -- --dry-run        # Preview without executing
npm start -- --verbose        # Enable detailed logging
npm start -- run --dry-run    # Combine command and option
```

### NPM Scripts

```bash
npm start          # Interactive menu
npm run setup      # Run setup wizard
npm run resume     # Resume interrupted achievements
npm run build      # Compile TypeScript
npm run clean      # Clean build artifacts and database
```

## ⚙️ Configuration

Configuration is stored in `.env` file (created during setup):

```env
# Required
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_USERNAME=your-username
TARGET_REPO=your-username/your-repo

# Optional (with defaults)
COAUTHOR_NAME=Carter2565
COAUTHOR_EMAIL=Carter@carter2565.dev
BRANCH_PREFIX=achievement
DELAY_MS=1000
VERBOSE=false
TEST_MODE=false
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GITHUB_TOKEN` | Yes | - | Your GitHub Personal Access Token |
| `GITHUB_USERNAME` | Yes | - | Your GitHub username |
| `TARGET_REPO` | Yes | - | Repository for achievement operations (owner/repo) |
| `COAUTHOR_NAME` | No | Carter2565 | Name for coauthored commits |
| `COAUTHOR_EMAIL` | No | Carter@carter2565.dev | Email for coauthored commits |
| `BRANCH_PREFIX` | No | achievement | Prefix for created branches |
| `DELAY_MS` | No | 1000 | Delay between operations (milliseconds) |
| `VERBOSE` | No | false | Enable verbose logging |
| `TEST_MODE` | No | false | Enable dry-run mode |

## 🎮 Achievement Details

### Pair Extraordinaire 👥
Creates branches with coauthored commits and merges them via PRs.

- Creates `achievement-pair-N` branches
- Adds entries to `ACHIEVEMENTS.md`
- Commit messages include `Co-authored-by` trailer
- PRs are automatically merged and branches deleted

### Pull Shark 🦈
Similar to Pair Extraordinaire but without coauthor requirement.

- Creates `achievement-shark-N` branches
- Standard commits (no coauthor)
- PRs are automatically merged

### Quickdraw ⚡
Creates issues and immediately closes them (within seconds).

- Creates timestamped issues
- Immediately closes them
- Simplest achievement to unlock

### Galaxy Brain 🧠
Creates GitHub Discussions with accepted answers.

- Requires Discussions enabled on repository
- Creates Q&A discussions
- Posts and accepts answers

### Starstruck ⭐
Cannot be fully automated - requires real users to star your repository.

- Tool provides guidance only
- You need to earn stars organically

## 📊 Progress Tracking

Progress is stored in a local SQLite database (`achievements.db`):

- View progress: `npm start -- status`
- Resume interrupted runs: `npm run resume`
- Database survives restarts

## 🔧 Troubleshooting

### Token Issues

**Error: "Bad credentials"**
- Your token may be expired or invalid
- Generate a new token at https://github.com/settings/tokens
- Re-run `npm run setup`

**Error: "Insufficient permissions"**
- Ensure your token has the `repo` scope
- For organization repos, you may need admin approval

### Repository Issues

**Error: "Repository not found"**
- Check the repository name format: `owner/repo`
- Ensure the repository exists and you have access

**Error: "No write access"**
- You need push access to the target repository
- Fork the repository or request access from the owner

### Rate Limiting

**Error: "Rate limit exceeded"**
- The tool automatically handles rate limits
- Wait for the reset time shown in the error
- Consider increasing `DELAY_MS` in your config

### Discussions Not Enabled

**Error: "Discussions not enabled"**
- Galaxy Brain requires Discussions
- Enable in Repository Settings → Features → Discussions
- Or skip the Galaxy Brain achievement

### Resuming Interrupted Runs

If the tool is interrupted (Ctrl+C or error):

```bash
npm run resume
```

This will continue from where it left off.

## 🔒 Security

- **Token Safety**: Your token is stored only in `.env` (git-ignored) and never logged
- **No Uploads**: Configuration never leaves your machine
- **Minimal Permissions**: Only `repo` scope needed
- **No Third Parties**: Direct GitHub API communication only

## 📁 Project Structure

```
GitHub-Achievements-Manager/
├── src/
│   ├── index.ts                 # CLI entry point
│   ├── cli/
│   │   ├── commands/            # CLI commands
│   │   │   ├── setup.ts         # Setup wizard
│   │   │   ├── run.ts           # Main run command
│   │   │   ├── status.ts        # Status display
│   │   │   ├── list.ts          # List achievements
│   │   │   └── resume.ts        # Resume command
│   │   └── prompts.ts           # Reusable prompts
│   ├── achievements/
│   │   ├── base.ts              # Base achievement class
│   │   ├── pairExtraordinaire.ts
│   │   ├── pullShark.ts
│   │   ├── quickdraw.ts
│   │   ├── galaxyBrain.ts
│   │   └── starstruck.ts
│   ├── github/
│   │   ├── client.ts            # Octokit wrapper
│   │   ├── auth.ts              # Authentication
│   │   ├── branch.ts            # Branch operations
│   │   ├── commit.ts            # Commit operations
│   │   ├── pr.ts                # PR operations
│   │   ├── issue.ts             # Issue operations
│   │   └── discussion.ts        # Discussion operations
│   ├── db/
│   │   ├── database.ts          # SQLite wrapper
│   │   └── schema.ts            # Database schema
│   ├── utils/
│   │   ├── config.ts            # Configuration
│   │   ├── logger.ts            # Logging
│   │   ├── errors.ts            # Error classes
│   │   ├── helpers.ts           # Utilities
│   │   └── timing.ts            # Delays/retries
│   ├── ui/
│   │   ├── menu.ts              # Interactive menus
│   │   ├── output.ts            # Formatted output
│   │   └── progress.ts          # Progress bars
│   └── types/
│       └── index.ts             # TypeScript types
├── dist/                        # Compiled JS (git-ignored)
├── logs/                        # Log files (git-ignored)
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## ❓ FAQ

**Q: Will this create a mess in my repository?**
A: The tool creates temporary branches and PRs that are immediately merged. A single file (`ACHIEVEMENTS.md`) tracks operations. You can use a dedicated test repository if you prefer.

**Q: Can I use someone else's repository?**
A: Only if you have write access. The tool validates this before proceeding.

**Q: What about the coauthor feature?**
A: Default is Carter2565, but you can customize it to any name/email during setup.

**Q: Can I resume if interrupted?**
A: Yes! Run `npm run resume` to continue from where you left off.

**Q: Is my token safe?**
A: Your token is stored only in `.env` (git-ignored), never uploaded, logged, or exposed.

**Q: How long does this take?**
A: Depends on tier. Gold tier (~48 operations) typically takes 10-15 minutes. Progress is shown in real-time.

**Q: Can I run this multiple times?**
A: Yes! Each run creates new operations. GitHub may not immediately update your achievement tier, but the operations count.

**Q: Why aren't my achievements showing?**
A: GitHub updates achievement status periodically (not instantly). Check back in a few minutes to an hour.

---

<p align="center">
  Made with ❤️ for the GitHub community
</p>
