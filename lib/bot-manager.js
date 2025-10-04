const config = require('../config/config')
const fs = require('fs')
const path = require('path')

class BotManager {
  constructor() {
    this.bots = new Map()
    this.botInstances = new Map()
    this.isShuttingDown = false
    this.logger = this.createLogger()

    this.setupShutdownHandlers()
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
    const logMessage = `[${timestamp}] [BotManager] [${level}] ${message}`

    console.log(logMessage)

    if (config.logging.toFile) {
      const logDir = path.join(__dirname, '../logs')
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
      }

      const logFile = path.join(logDir, 'bot-manager.log')
      fs.appendFileSync(logFile, logMessage + '\n')
    }
  }

  async loadBotClasses() {
    const botDir = path.join(__dirname, '../bots')

    if (!fs.existsSync(botDir)) {
      this.logger.error('Bots directory not found')
      return
    }

    const botFiles = fs.readdirSync(botDir).filter(file => file.endsWith('.js'))

    for (const file of botFiles) {
      try {
        const botName = path.basename(file, '.js')
        const loadStart = Date.now()
        const BotClass = require(path.join(botDir, file))
        const loadTime = Date.now() - loadStart
        this.bots.set(botName, BotClass)
        this.logger.info(`Loaded bot class: ${botName} (${loadTime}ms)`)
      } catch (error) {
        this.logger.error(`Failed to load bot ${file}: ${error.message}`)
      }
    }
  }

  async startBot(botName) {
    if (this.isShuttingDown) {
      this.logger.warn(`Cannot start ${botName}: Bot manager is shutting down`)
      return null
    }

    if (this.botInstances.has(botName)) {
      this.logger.warn(`Bot ${botName} is already running`)
      return this.botInstances.get(botName)
    }

    const BotClass = this.bots.get(botName)
    if (!BotClass) {
      this.logger.error(`Bot class ${botName} not found`)
      return null
    }

    const botConfig = config.bots[botName]
    if (!botConfig) {
      this.logger.error(`Configuration for bot ${botName} not found`)
      return null
    }

    try {
      this.logger.info(`Starting bot: ${botName}`)
      const botInstance = new BotClass(botName, botConfig)

      await botInstance.connect()

      this.botInstances.set(botName, botInstance)
      this.logger.info(`Bot ${botName} started successfully`)

      return botInstance
    } catch (error) {
      this.logger.error(`Failed to start bot ${botName}: ${error.message}`)
      return null
    }
  }

  async startAllBots() {
    this.logger.info('Starting all bots...')

    const botNames = Object.keys(config.bots)
    const results = []

    for (let i = 0; i < botNames.length; i++) {
      const botName = botNames[i]

      if (i > 0) {
        await this.delay(config.behavior.spawnInterval)
      }

      const result = await this.startBot(botName)
      results.push({ name: botName, success: result !== null, instance: result })
    }

    const successCount = results.filter(r => r.success).length
    this.logger.info(`Started ${successCount}/${botNames.length} bots successfully`)

    return results
  }

  async startSelectedBots(botNames) {
    this.logger.info(`Starting selected bots: ${botNames.join(', ')}`)

    const results = []

    for (let i = 0; i < botNames.length; i++) {
      const botName = botNames[i]

      if (i > 0) {
        await this.delay(config.behavior.spawnInterval)
      }

      const result = await this.startBot(botName)
      results.push({ name: botName, success: result !== null, instance: result })
    }

    const successCount = results.filter(r => r.success).length
    this.logger.info(`Started ${successCount}/${botNames.length} selected bots successfully`)

    return results
  }

  stopBot(botName) {
    const botInstance = this.botInstances.get(botName)

    if (!botInstance) {
      this.logger.warn(`Bot ${botName} is not running`)
      return false
    }

    try {
      this.logger.info(`Stopping bot: ${botName}`)
      botInstance.disconnect()
      this.botInstances.delete(botName)
      this.logger.info(`Bot ${botName} stopped successfully`)
      return true
    } catch (error) {
      this.logger.error(`Failed to stop bot ${botName}: ${error.message}`)
      return false
    }
  }

  stopAllBots() {
    this.logger.info('Stopping all bots...')

    const botNames = Array.from(this.botInstances.keys())
    let successCount = 0

    for (const botName of botNames) {
      if (this.stopBot(botName)) {
        successCount++
      }
    }

    this.logger.info(`Stopped ${successCount}/${botNames.length} bots successfully`)
    return successCount
  }

  restartBot(botName) {
    this.logger.info(`Restarting bot: ${botName}`)

    this.stopBot(botName)

    setTimeout(() => {
      this.startBot(botName)
    }, 2000)
  }

  getBotStatus(botName) {
    const botInstance = this.botInstances.get(botName)

    if (!botInstance) {
      return { name: botName, status: 'stopped', connected: false }
    }

    return {
      name: botName,
      status: 'running',
      connected: botInstance.isConnected(),
      reconnectAttempts: botInstance.reconnectAttempts,
      personality: botInstance.config.personality
    }
  }

  getAllBotStatus() {
    const allBots = Object.keys(config.bots)

    return allBots.map(botName => this.getBotStatus(botName))
  }

  getActiveBots() {
    return Array.from(this.botInstances.values()).filter(bot => bot.isConnected())
  }

  sendMessageToBot(botName, message) {
    const botInstance = this.botInstances.get(botName)

    if (!botInstance || !botInstance.isConnected()) {
      this.logger.warn(`Cannot send message to ${botName}: Bot not connected`)
      return false
    }

    try {
      botInstance.bot.chat(message)
      this.logger.info(`Message sent to ${botName}: ${message}`)
      return true
    } catch (error) {
      this.logger.error(`Failed to send message to ${botName}: ${error.message}`)
      return false
    }
  }

  broadcastMessage(message) {
    this.logger.info(`Broadcasting message: ${message}`)

    let successCount = 0
    const activeBots = this.getActiveBots()

    for (const bot of activeBots) {
      if (this.sendMessageToBot(bot.name, message)) {
        successCount++
      }
    }

    this.logger.info(`Message broadcasted to ${successCount}/${activeBots.length} bots`)
    return successCount
  }

  coordinateBotsForTask(task, botNames = null) {
    const targetBots = botNames ?
      botNames.map(name => this.botInstances.get(name)).filter(bot => bot) :
      this.getActiveBots()

    this.logger.info(`Coordinating ${targetBots.length} bots for task: ${task}`)

    switch (task) {
      case 'follow_leader':
        this.coordinateFollowLeader(targetBots)
        break
      case 'gather_around':
        this.coordinateGatherAround(targetBots)
        break
      case 'spread_out':
        this.coordinateSpreadOut(targetBots)
        break
      default:
        this.logger.warn(`Unknown task: ${task}`)
    }
  }

  coordinateFollowLeader(bots) {
    const leader = bots.find(bot => bot.config.personality === 'leader')

    if (!leader) {
      this.logger.warn('No leader bot found for follow_leader task')
      return
    }

    const followers = bots.filter(bot => bot !== leader)

    for (const follower of followers) {
      if (follower.isConnected()) {
        follower.bot.chat(`Following ${leader.name}!`)
      }
    }
  }

  coordinateGatherAround(bots) {
    this.broadcastMessage('Everyone gather around!')
  }

  coordinateSpreadOut(bots) {
    this.broadcastMessage('Spread out and explore!')
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  setupShutdownHandlers() {
    const shutdown = () => {
      if (this.isShuttingDown) return

      this.isShuttingDown = true
      this.logger.info('Shutting down bot manager...')

      this.stopAllBots()

      setTimeout(() => {
        process.exit(0)
      }, 5000)
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
    process.on('SIGUSR1', shutdown)
    process.on('SIGUSR2', shutdown)
  }
}

module.exports = BotManager