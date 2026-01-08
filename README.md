# GitHub Achievement CLI

Automate GitHub profile achievements. Earn Pair Extraordinaire, Pull Shark, Galaxy Brain, Quickdraw, and YOLO badges through automated workflows.

## Supported Achievements

| Achievement | Description | Tiers |
|-------------|-------------|-------|
| **Pair Extraordinaire** | Coauthored commits on merged PRs | 1 / 10 / 24 / 48 |
| **Pull Shark** | Merged pull requests | 2 / 16 / 128 / 1024 |
| **Galaxy Brain** | Accepted answers in Discussions | 2 / 8 / 16 / 32 |
| **Quickdraw** | Close issue within 5 min of opening | 1 |
| **YOLO** | Merge PR without code review | 1 |

Galaxy Brain and YOLO require a second GitHub account (helper account).

## Quick Start

```bash
# Clone
git clone https://github.com/n0/GitHub-Achievement-CLI.git
cd GitHub-Achievement-CLI

# Install & build
npm install
npm run build

# Run (setup wizard guides you)
npm start
```

## Requirements

- Node.js 16+
- GitHub Personal Access Token with `repo` scope
- A repository you own (the tool creates branches/PRs here)

### Get a Token

1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select `repo` scope
4. Copy the token

## Usage

Run `npm start` for the interactive menu:

- **Run Achievements** - Select achievements and tiers to execute
- **View Status** - Check progress on current achievements
- **List Achievements** - See all available achievements
- **Reset Repo History** - Squash commits after completion
- **Reconfigure** - Change tokens and settings

## Configuration

Created automatically during setup in `.env`:

```env
GITHUB_TOKEN=ghp_xxx
GITHUB_USERNAME=your-username
TARGET_REPO=your-username/your-repo

# Optional: For Galaxy Brain / YOLO
HELPER_TOKEN=ghp_xxx
```

## How It Works

1. Creates temporary branches in your target repo
2. Makes commits (with coauthor for Pair Extraordinaire)
3. Opens and merges PRs
4. Cleans up branches
5. Tracks progress locally per account

Each achievement type uses a specific workflow that triggers GitHub's achievement system.

## After Completion

The tool creates many commits/PRs. To clean up:

1. Use **Reset Repo History** from the menu (squashes to single commit)
2. To also clear PR history from your profile: delete and recreate the repo

## Rate Limits

The tool respects GitHub's API limits:
- 2 concurrent operations
- 15 operations/minute (under GitHub's 80 content-requests/min limit)
- Automatic retry with backoff on rate limit errors

## License

MIT
