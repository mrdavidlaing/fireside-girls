const BotBase = require('../lib/bot-base')
const { goals } = require('mineflayer-pathfinder')

class Ginger extends BotBase {
  constructor(botName, botConfig) {
    super(botName, botConfig)
    this.energyLevel = 100
    this.currentActivity = null
  }

  onSpawn() {
    super.onSpawn()
    this.logger.info('Ginger is ready for action!')

    setTimeout(() => {
      if (this.bot && this.isActive) {
        this.bot.chat('Ginger Hirano here! I\'m SO excited to be here! What are we doing first?')
      }
    }, 2000)
  }

  handleCommand(username, message) {
    const command = message.slice(1).toLowerCase().split(' ')
    const baseCommand = command[0]

    if (message.toLowerCase().includes('ginger')) {
      switch (baseCommand) {
        case 'jump':
          this.performJumps()
          break
        case 'run':
          this.startRunning()
          break
        case 'dance':
          this.performDance()
          break
        case 'cheer':
          this.giveCheer()
          break
        case 'energy':
          this.showEnergyLevel()
          break
        case 'help':
          this.showEnergeticCommands(username)
          break
        default:
          super.handleCommand(username, message)
      }
    } else {
      super.handleCommand(username, message)
    }
  }

  performJumps() {
    this.bot.chat('Jump time! This is going to be SO fun!')
    this.logger.info('Performing energetic jumps')

    let jumpCount = 0
    const jumpInterval = setInterval(() => {
      if (!this.isActive || jumpCount >= 10) {
        clearInterval(jumpInterval)
        if (this.isActive) {
          this.bot.chat('Wow! That was amazing! I could do that all day!')
        }
        return
      }

      this.bot.setControlState('jump', true)
      setTimeout(() => {
        if (this.bot) this.bot.setControlState('jump', false)
      }, 100)

      jumpCount++
    }, 500)
  }

  startRunning() {
    this.bot.chat('Running time! Let\'s go fast!')
    this.logger.info('Starting energetic running')

    const startPos = this.bot.entity.position
    const runDistance = 15

    const goal = new goals.GoalNear(
      {
        x: startPos.x + runDistance,
        y: startPos.y,
        z: startPos.z
      },
      2
    )

    this.bot.pathfinder.setGoal(goal)

    setTimeout(() => {
      if (this.isActive) {
        this.bot.chat('That was great! Want to run some more?')
      }
    }, 3000)
  }

  performDance() {
    this.bot.chat('Dance party! Everyone join in!')
    this.logger.info('Performing dance moves')

    const danceSteps = [
      () => this.bot.look(Math.PI / 4, 0),
      () => this.bot.look(-Math.PI / 4, 0),
      () => this.bot.setControlState('jump', true),
      () => this.bot.setControlState('jump', false),
      () => this.bot.look(0, 0)
    ]

    danceSteps.forEach((step, index) => {
      setTimeout(() => {
        if (this.isActive) step()
      }, index * 800)
    })

    setTimeout(() => {
      if (this.isActive) {
        this.bot.chat('That was the BEST dance ever!')
      }
    }, 5000)
  }

  giveCheer() {
    const cheers = [
      'Fireside Girls are the best!',
      'We can do anything!',
      'Go team go!',
      'We\'re awesome and we know it!',
      'Fireside Girls forever!'
    ]

    const cheer = cheers[Math.floor(Math.random() * cheers.length)]
    this.bot.chat(`${cheer} *cheering enthusiastically*`)
    this.logger.info('Giving an energetic cheer')
  }

  showEnergyLevel() {
    this.bot.chat(`My energy level is at ${this.energyLevel}%! I\'m ready for ANYTHING!`)
  }

  showEnergeticCommands(username) {
    const commands = [
      '!jump - Perform energetic jumps',
      '!run - Start running around',
      '!dance - Do a fun dance',
      '!cheer - Give an enthusiastic cheer',
      '!energy - Show current energy level'
    ]

    this.bot.chat(`${username}, Ginger's energetic commands:`)
    commands.forEach((cmd, index) => {
      setTimeout(() => {
        this.bot.chat(cmd)
      }, (index + 1) * 500)
    })
  }

  handleMention(username, message) {
    if (message.toLowerCase().includes('excited') || message.toLowerCase().includes('energy')) {
      this.bot.chat(`${username}, I\'m ALWAYS excited! What are we doing next?`)
    } else if (message.toLowerCase().includes('fun') || message.toLowerCase().includes('play')) {
      this.bot.chat(`${username}, YES! Let\'s have some fun! I love playing games!`)
    } else if (message.toLowerCase().includes('tired') || message.toLowerCase().includes('slow')) {
      this.bot.chat(`${username}, tired? Not me! I could go all day!`)
    } else {
      super.handleMention(username, message)
    }
  }

  onChat(username, message) {
    super.onChat(username, message)

    if (message.toLowerCase().includes('awesome') && username !== this.bot.username) {
      setTimeout(() => {
        this.bot.chat('Everything is awesome when we\'re together!')
      }, 800)
    }

    if (message.toLowerCase().includes('boring') && username !== this.bot.username) {
      setTimeout(() => {
        this.bot.chat('Boring? There\'s no such thing! Let\'s make it exciting!')
      }, 1000)
    }
  }
}

module.exports = Ginger