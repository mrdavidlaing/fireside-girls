# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fireside Girls is a multi-bot Minecraft framework using Mineflayer. Each bot represents a character from Phineas and Ferb with unique personalities and behaviors that can be extended through inheritance.

## Core Architecture

### Bot System Hierarchy
- **BotBase** (`lib/bot-base.js`) - Base class containing shared functionality all bots inherit from:
  - Connection/reconnection logic with exponential backoff
  - Event handlers (chat, health, spawn, error, disconnect)
  - Plugin loading (pathfinder, auto-eat)
  - Command parsing and base command implementations
  - Logging system with file and console output
  - Personality-based responses

- **Individual Bot Classes** (`bots/*.js`) - Extend BotBase with personality-specific behaviors:
  - Override `handleCommand()` for custom commands
  - Override `handleMention()` for unique responses
  - Override `onSpawn()` for initialization behavior
  - Add personality-specific methods (e.g., Isabella's `assembleTroop()`, `startMission()`)

- **BotManager** (`lib/bot-manager.js`) - Orchestrates multiple bot instances:
  - Dynamic bot class loading from `bots/` directory
  - Staggered spawning to prevent server overload
  - Inter-bot coordination methods (`coordinateBotsForTask()`)
  - Broadcasting messages to all active bots
  - Status tracking and reporting

### Configuration System
All configuration lives in `config/config.js` which loads from `.env`:
- Server connection settings (host, port, version)
- Authentication mode (offline/Microsoft)
- Bot behavior (spawn intervals, reconnect attempts)
- Per-bot usernames and passwords
- Logging configuration

## Development Commands

### Starting Bots
```bash
# Start all bots with staggered spawning
pnpm start

# Start a single bot
pnpm run start:single <botname>
# or
node scripts/start-single.js <botname>

# Development mode with auto-restart
pnpm dev
```

### Management Scripts
```bash
# Check status of all bots
node scripts/status.js

# Stop all running bots
pnpm run stop
# or
node scripts/stop-all.js
```

### Environment Setup
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your server details
# Key variables: SERVER_HOST, SERVER_PORT, USE_OFFLINE_MODE
```

## Adding New Bots

1. Create new bot class in `bots/<name>.js`:
```javascript
const BotBase = require('../lib/bot-base')

class NewBot extends BotBase {
  constructor(botName, botConfig) {
    super(botName, botConfig)
  }

  onSpawn() {
    super.onSpawn()  // Always call super to preserve base behavior
    // Add custom spawn logic
  }

  handleCommand(username, message) {
    // Handle custom commands
    super.handleCommand(username, message)  // Fallback to base commands
  }
}

module.exports = NewBot
```

2. Add bot configuration to `config/config.js` in the `bots` object
3. Add username/password environment variables to `.env.example`
4. BotManager will auto-discover the new bot file on startup

## Command System

### Base Commands (All Bots)
- `!follow <player>` - Use pathfinder to follow player entity
- `!come <player>` - Navigate to player's position
- `!stop` - Clear pathfinder goal
- `!status` - Report health, food, position

### Custom Commands
Override `handleCommand(username, message)` to add bot-specific commands. See `bots/isabella.js` for reference implementation with commands like `!assemble`, `!mission`, `!formation`, `!patrol`.

## Key Implementation Details

### Plugin System
Plugins are loaded in `BotBase.loadPlugins()`. The codebase uses:
- `mineflayer-pathfinder` - Navigation and movement goals
- `mineflayer-auto-eat` - Automatic food consumption when hungry

To add new plugins, import and call `this.bot.loadPlugin()` in the `loadPlugins()` method.

### Reconnection Logic
Bots automatically reconnect on disconnect with:
- Exponential backoff (delay = `RECONNECT_DELAY * attempt_number`)
- Max attempts controlled by `MAX_RECONNECT_ATTEMPTS` config
- Automatic reset of attempt counter on successful connection

### Logging
Each bot and the BotManager write to separate log files in `logs/`:
- Console output always enabled
- File logging controlled by `LOG_TO_FILE` environment variable
- Log levels: DEBUG, INFO, WARN, ERROR

### Staggered Spawning
`BotManager.startAllBots()` uses `BOT_SPAWN_INTERVAL` delay between connections to prevent overwhelming the server with simultaneous login attempts.

## Testing Changes

Always test against a local Minecraft server:
1. Start a Minecraft server (Java Edition 1.8-1.21+)
2. Set `USE_OFFLINE_MODE=true` in `.env` for testing
3. Start bot(s) and verify connection, commands, and behaviors in-game
4. Check `logs/` directory for errors or warnings
