# 🔥 Fireside Girls Minecraft Bot Troupe 🔥

A multi-bot Minecraft framework inspired by the Fireside Girls from Phineas and Ferb. Each bot has a unique personality and specialized behaviors, working together as an organized troupe.

## 🎭 Meet the Troupe

| Bot | Personality | Username | Specialization |
|-----|-------------|----------|----------------|
| **Isabella** | Leader | Isabella | Troop coordination and mission leadership |
| **Gretchen** | Technical | Gretchen | Analysis, calculations, and research |
| **Adyson** | Organized | Adyson | Organization and inventory management |
| **Ginger** | Energetic | Ginger | High-energy activities and enthusiasm |
| **Holly** | Artistic | Holly | Creative projects and decoration |
| **Katie** | Friendly | Katie | Social interaction and welcoming |
| **Milly** | Curious | Milly | Exploration and asking questions |
| **Candace** | Dramatic | Candace | Drama and attention-seeking behavior |

## ⚡ Quick Start

### Prerequisites
- Node.js 16+
- PNPM package manager
- Minecraft server (Java Edition 1.8-1.21+)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd fireside-girls
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your server details
   ```

3. **Start all bots:**
   ```bash
   pnpm start
   ```

### Basic Configuration

Edit `.env` file with your server details:

```env
SERVER_HOST=localhost
SERVER_PORT=25565
USE_OFFLINE_MODE=true
BOT_SPAWN_INTERVAL=500
```

## 🚀 Usage

### Starting Bots

**Start all bots:**
```bash
pnpm start
# or
node scripts/start-all.js
```

**Start a specific bot:**
```bash
pnpm run start:single isabella
# or
node scripts/start-single.js gretchen
```

**Check bot status:**
```bash
node scripts/status.js
```

**Stop all bots:**
```bash
pnpm run stop
# or
node scripts/stop-all.js
```

### In-Game Commands

All bots respond to these basic commands:

- `!follow <player>` - Follow a specific player
- `!come <player>` - Come to a player's location
- `!stop` - Stop current activity
- `!status` - Report current status
- `!help` - Show available commands

### Bot-Specific Commands

**Isabella (Leader):**
- `!assemble` - Gather the troop
- `!mission <type>` - Start a mission (build/explore/gather)
- `!formation` - Form up in line
- `!patrol` - Start area patrol

**Gretchen (Technical):**
- `!analyze` - Analyze current area
- `!calculate <query>` - Perform calculations
- `!research <topic>` - Research information
- `!scan` - Scan surroundings
- `!optimize` - Optimize current strategy

**Adyson (Organized):**
- `!organize` - Organize current area
- `!sort` - Sort inventory items
- `!clean` - Clean up the area
- `!inventory` - Analyze inventory

**Ginger (Energetic):**
- `!jump` - Perform energetic jumps
- `!run` - Start running around
- `!dance` - Do a fun dance
- `!cheer` - Give an enthusiastic cheer

## 🏗️ Project Structure

```
fireside-girls/
├── package.json          # Project configuration and dependencies
├── .env.example          # Environment configuration template
├── config/
│   └── config.js         # Bot and server configuration
├── lib/
│   ├── bot-base.js       # Base bot class with shared functionality
│   ├── bot-manager.js    # Multi-bot coordination and management
│   └── plugins/          # Custom mineflayer plugins
├── bots/
│   ├── isabella.js       # Leader bot
│   ├── gretchen.js       # Technical bot
│   ├── adyson.js         # Organization bot
│   ├── ginger.js         # Energetic bot
│   ├── holly.js          # Artistic bot
│   ├── katie.js          # Friendly bot
│   ├── milly.js          # Curious bot
│   └── candace.js        # Dramatic bot
├── scripts/
│   ├── start-all.js      # Start all bots
│   ├── start-single.js   # Start individual bot
│   ├── stop-all.js       # Stop all bots
│   └── status.js         # Check bot status
└── logs/                 # Bot activity logs
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_HOST` | Minecraft server hostname | `localhost` |
| `SERVER_PORT` | Minecraft server port | `25565` |
| `SERVER_VERSION` | Minecraft version | `1.21.1` |
| `USE_OFFLINE_MODE` | Use offline/cracked mode | `true` |
| `MICROSOFT_AUTH` | Use Microsoft authentication | `false` |
| `BOT_SPAWN_INTERVAL` | Delay between bot spawns (ms) | `500` |
| `MAX_RECONNECT_ATTEMPTS` | Max reconnection attempts | `5` |
| `LOG_LEVEL` | Logging level (info/warn/error) | `info` |
| `LOG_TO_FILE` | Enable file logging | `true` |

### Bot Usernames

Each bot's username can be customized:

```env
ISABELLA_USERNAME=Isabella
GRETCHEN_USERNAME=Gretchen
ADYSON_USERNAME=Adyson
# ... etc
```

For premium/Microsoft accounts, add passwords:

```env
ISABELLA_PASSWORD=your_password
USE_OFFLINE_MODE=false
MICROSOFT_AUTH=true
```

## 🤖 Bot Features

### Shared Functionality (All Bots)
- **Auto-reconnect** - Automatic reconnection on disconnect
- **Plugin system** - Pathfinder, auto-eat, and custom plugins
- **Command system** - Responsive to chat commands
- **Logging** - Comprehensive activity logging
- **Personality responses** - Unique chat responses per bot
- **Status reporting** - Health, food, position reporting

### Advanced Features
- **Staggered spawning** - Prevents server overload
- **Coordinated activities** - Multi-bot task coordination
- **Error handling** - Robust error recovery
- **Inter-bot communication** - Bots can coordinate actions
- **Mission system** - Isabella can assign group missions

## 🔧 Development

### Adding New Bots

1. Create new bot file in `bots/` directory
2. Extend the `BotBase` class
3. Add configuration to `config/config.js`
4. Add environment variables to `.env.example`

Example:
```javascript
const BotBase = require('../lib/bot-base')

class NewBot extends BotBase {
  constructor(botName, botConfig) {
    super(botName, botConfig)
  }

  onSpawn() {
    super.onSpawn()
    // Custom spawn behavior
  }

  handleCommand(username, message) {
    // Custom command handling
    super.handleCommand(username, message)
  }
}

module.exports = NewBot
```

### Custom Plugins

Add plugins to `lib/plugins/` and load them in `bot-base.js`:

```javascript
// In bot-base.js loadPlugins() method
const customPlugin = require('./plugins/custom-plugin')
this.bot.loadPlugin(customPlugin)
```

## 📝 Logging

Logs are stored in the `logs/` directory:
- `bot-manager.log` - Manager operations
- `<botname>.log` - Individual bot activities

Log levels: `DEBUG`, `INFO`, `WARN`, `ERROR`

## 🐛 Troubleshooting

### Common Issues

**Bots won't connect:**
- Check server address and port
- Verify server is running and accessible
- Check firewall settings
- For premium servers, ensure correct authentication

**Bots disconnect frequently:**
- Increase `RECONNECT_DELAY`
- Check server stability
- Verify network connection
- Check server whitelist/authentication

**Missing dependencies:**
```bash
pnpm install
```

**Permission errors:**
```bash
chmod +x scripts/*.js
```

### Debug Mode

Enable debug logging:
```env
LOG_LEVEL=debug
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with a local Minecraft server
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **Phineas and Ferb** - For the amazing Fireside Girls characters
- **Mineflayer** - For the excellent Minecraft bot framework
- **PrismarineJS** - For the Minecraft protocol implementation

---

*"We never give up, we never give in!"* - Fireside Girls Motto
