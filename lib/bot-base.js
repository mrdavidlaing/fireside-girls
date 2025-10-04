const mineflayer = require('mineflayer')
const { pathfinder, goals } = require('mineflayer-pathfinder')
const autoEat = require('mineflayer-auto-eat').plugin
const toolPlugin = require('mineflayer-tool').plugin
const collectBlock = require('mineflayer-collectblock').plugin
const Vec3 = require('vec3')
const config = require('../config/config')
const fs = require('fs')
const path = require('path')

class BotBase {
  constructor(botName, botConfig) {
    this.name = botName
    this.config = botConfig
    this.bot = null
    this.reconnectAttempts = 0
    this.isActive = false
    this.logger = this.createLogger()
  }

  createLogger() {
    return {
      info: (message) => this.log('INFO', message),
      warn: (message) => this.log('WARN', message),
      error: (message) => this.log('ERROR', message),
      debug: (message) => this.log('DEBUG', message)
    }
  }

  log(level, message) {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [${this.name}] [${level}] ${message}`

    console.log(logMessage)

    if (config.logging.toFile) {
      const logDir = path.join(__dirname, '../logs')
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
      }

      const logFile = path.join(logDir, `${this.name.toLowerCase()}.log`)
      fs.appendFileSync(logFile, logMessage + '\n')
    }
  }

  async connect() {
    try {
      this.logger.info(`Attempting to connect to ${config.server.host}:${config.server.port}`)

      const botOptions = {
        host: config.server.host,
        port: config.server.port,
        username: this.config.username,
        version: config.server.version
      }

      if (!config.auth.useOfflineMode) {
        if (config.auth.microsoftAuth) {
          botOptions.auth = 'microsoft'
        }
        if (this.config.password) {
          botOptions.password = this.config.password
        }
      }

      this.logger.debug('Creating bot instance...')
      const createStart = Date.now()
      this.bot = mineflayer.createBot(botOptions)
      this.logger.debug(`Bot instance created in ${Date.now() - createStart}ms`)

      this.logger.debug('Setting up event handlers...')
      const handlersStart = Date.now()
      this.setupEventHandlers()
      this.logger.debug(`Event handlers setup in ${Date.now() - handlersStart}ms`)

      this.logger.debug('Loading plugins...')
      const pluginsStart = Date.now()
      this.loadPlugins()
      this.logger.debug(`Plugins loaded in ${Date.now() - pluginsStart}ms`)

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'))
        }, 30000)

        this.bot.once('spawn', () => {
          clearTimeout(timeout)
          this.isActive = true
          this.reconnectAttempts = 0
          this.logger.info('Successfully connected and spawned')
          this.onSpawn()
          resolve(this.bot)
        })

        this.bot.once('error', (err) => {
          clearTimeout(timeout)
          reject(err)
        })
      })
    } catch (error) {
      this.logger.error(`Connection failed: ${error.message}`)
      throw error
    }
  }

  setupEventHandlers() {
    this.bot.on('error', (err) => {
      this.logger.error(`Bot error: ${err.message}`)
      this.handleError(err)
    })

    this.bot.on('end', () => {
      this.logger.warn('Connection ended')
      this.isActive = false
      this.handleDisconnect()
    })

    this.bot.on('kicked', (reason) => {
      this.logger.warn(`Kicked from server: ${reason}`)
      this.isActive = false
    })

    this.bot.on('chat', (username, message) => {
      if (username !== this.bot.username) {
        this.onChat(username, message)
      }
    })

    this.bot.on('health', () => {
      if (this.bot.food < 16 && this.bot.autoEat) {
        try {
          this.bot.autoEat.eat()
        } catch (err) {
          // Silently ignore if no food available
          this.logger.debug(`Cannot eat: ${err.message}`)
        }
      }
    })
  }

  loadPlugins() {
    this.bot.loadPlugin(pathfinder)
    // Disabled auto-eat until bots have food
    // this.bot.loadPlugin(autoEat)
    this.bot.loadPlugin(toolPlugin)
    this.bot.loadPlugin(collectBlock)

    this.logger.info('Plugins loaded: pathfinder, tool, collect-block')
  }

  onSpawn() {
    this.logger.info(`${this.name} has spawned into the world`)
    this.sendPersonalityMessage()
  }

  sendPersonalityMessage() {
    const messages = {
      leader: "Isabella here! Ready to lead the troupe!",
      technical: "Gretchen reporting. My technical knowledge is at your service.",
      organized: "Adyson ready! Everything will be perfectly organized.",
      energetic: "Ginger here! I'm so excited to be here!",
      artistic: "Holly present! Ready to add some creativity to our mission.",
      friendly: "Katie here! Happy to meet everyone!",
      curious: "Milly reporting! I can't wait to explore and learn!",
      dramatic: "Candace is here! This is going to be SO amazing!"
    }

    const message = messages[this.config.personality] || `${this.name} has joined the server!`

    setTimeout(() => {
      if (this.bot && this.isActive) {
        this.bot.chat(message)
      }
    }, 1000)
  }

  onChat(username, message) {
    this.logger.info(`<${username}> ${message}`)

    // List of bot usernames to ignore (prevent bot-to-bot chat loops)
    const botUsernames = ['Isabella', 'Gretchen', 'Adyson', 'Ginger', 'Holly', 'Katie', 'Milly', 'Candace']
    const isBotMessage = botUsernames.some(botName => username.toLowerCase() === botName.toLowerCase())

    if (message.toLowerCase().includes(this.name.toLowerCase())) {
      // Only respond to mentions from players, not other bots (except for Isabella's zone commands)
      if (!isBotMessage) {
        this.handleMention(username, message)
      }
    }

    if (message.startsWith('!')) {
      this.handleCommand(username, message)
    }

    // Listen for Isabella's zone clearing assignments (special case - respond to bot)
    const zonePattern = new RegExp(`${this.name.toLowerCase()}, clear zone at (-?\\d+) (-?\\d+) (-?\\d+) radius ([\\d.]+)`, 'i')
    const zoneMatch = message.match(zonePattern)

    if (zoneMatch && username.toLowerCase() === 'isabella') {
      const x = parseInt(zoneMatch[1])
      const y = parseInt(zoneMatch[2])
      const z = parseInt(zoneMatch[3])
      const radius = parseFloat(zoneMatch[4])

      this.handleZoneClearingAssignment(x, y, z, radius)
    }
  }

  handleMention(username, message) {
    const responses = {
      leader: `Yes ${username}? How can I help the troupe?`,
      technical: `${username}, I'm here if you need technical assistance.`,
      organized: `${username}, I'm ready to help organize whatever you need!`,
      energetic: `Hi ${username}! What can I do for you?`,
      artistic: `${username}! Need some creative input?`,
      friendly: `Hello ${username}! How can I help you today?`,
      curious: `${username}! What interesting thing are we doing now?`,
      dramatic: `${username}! You called for me at the perfect moment!`
    }

    const response = responses[this.config.personality] || `Hello ${username}!`

    setTimeout(() => {
      if (this.bot && this.isActive) {
        this.bot.chat(response)
      }
    }, 500)
  }

  handleCommand(username, message) {
    const command = message.slice(1).toLowerCase().split(' ')[0]

    switch (command) {
      case 'follow':
        this.followPlayer(username)
        break
      case 'stop':
        this.stopFollowing()
        break
      case 'come':
        this.comeToPlayer(username)
        break
      case 'status':
        this.reportStatus()
        break
      default:
        if (message.toLowerCase().includes(this.name.toLowerCase())) {
          this.bot.chat(`I don't understand that command, ${username}.`)
        }
    }
  }

  followPlayer(username) {
    const player = this.bot.players[username]
    if (player && player.entity) {
      const goal = new goals.GoalFollow(player.entity, 3)
      this.bot.pathfinder.setGoal(goal, true)  // dynamic = true for persistent following
      this.bot.chat(`Following ${username}!`)
      this.logger.info(`Started following ${username}`)
    } else {
      this.bot.chat(`I can't see ${username} to follow them.`)
    }
  }

  stopFollowing() {
    this.bot.pathfinder.setGoal(null)
    this.bot.chat("Stopped following.")
    this.logger.info("Stopped following")
  }

  comeToPlayer(username) {
    const player = this.bot.players[username]
    if (player && player.entity) {
      const goal = new goals.GoalNear(player.entity.position, 2)
      this.bot.pathfinder.setGoal(goal)
      this.bot.chat(`Coming to ${username}!`)
      this.logger.info(`Moving to ${username}`)
    } else {
      this.bot.chat(`I can't see ${username} to come to them.`)
    }
  }

  reportStatus() {
    const health = this.bot.health
    const food = this.bot.food
    const position = this.bot.entity.position

    this.bot.chat(`Status: Health ${health}/20, Food ${food}/20, Position: ${Math.round(position.x)}, ${Math.round(position.y)}, ${Math.round(position.z)}`)
  }

  async handleZoneClearingAssignment(x, y, z, radius) {
    // Stop any current pathfinding
    this.bot.pathfinder.setGoal(null)

    this.bot.chat(`On it, Isabella! Clearing my zone!`)
    this.logger.info(`Zone clearing assignment: center (${x}, ${y}, ${z}), radius ${radius}`)

    try {
      const centerPos = new Vec3(x, y, z)
      let totalCleared = 0

      // Clear blocks immediately instead of storing in array
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -2; dy <= 3; dy++) {
          for (let dz = -radius; dz <= radius; dz++) {
            const pos = centerPos.offset(dx, dy, dz)
            const block = this.bot.blockAt(pos)
            if (block && block.name !== 'air' && this.bot.canDigBlock(block)) {
              try {
                await this.bot.collectBlock.collect(block)
                totalCleared++
              } catch (err) {
                this.logger.warn(`Failed to collect block at ${block.position}: ${err.message}`)
              }
            }
          }
        }
      }

      this.bot.chat(`My zone is clear, Isabella! Removed ${totalCleared} blocks!`)
      this.logger.info(`Cleared ${totalCleared} blocks in assigned zone`)
    } catch (error) {
      this.bot.chat(`Had trouble with my zone: ${error.message}`)
      this.logger.error(`Zone clearing error: ${error.message}`)
    }
  }

  handleError(error) {
    this.logger.error(`Handling error: ${error.message}`)

    if (this.reconnectAttempts < config.behavior.maxReconnectAttempts) {
      this.scheduleReconnect()
    } else {
      this.logger.error('Max reconnection attempts reached. Giving up.')
    }
  }

  handleDisconnect() {
    if (this.reconnectAttempts < config.behavior.maxReconnectAttempts) {
      this.scheduleReconnect()
    }
  }

  scheduleReconnect() {
    this.reconnectAttempts++
    const delay = config.behavior.reconnectDelay * this.reconnectAttempts

    this.logger.info(`Scheduling reconnect attempt ${this.reconnectAttempts}/${config.behavior.maxReconnectAttempts} in ${delay}ms`)

    setTimeout(() => {
      this.connect().catch((error) => {
        this.logger.error(`Reconnection attempt ${this.reconnectAttempts} failed: ${error.message}`)
      })
    }, delay)
  }

  disconnect() {
    if (this.bot) {
      this.logger.info('Disconnecting...')
      this.isActive = false
      this.bot.quit()
      this.bot = null
    }
  }

  isConnected() {
    return this.bot && this.isActive
  }
}

module.exports = BotBase