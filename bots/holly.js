const BotBase = require('../lib/bot-base')

class Holly extends BotBase {
  constructor(botName, botConfig) {
    super(botName, botConfig)
    this.currentProject = null
  }

  onSpawn() {
    super.onSpawn()
    setTimeout(() => {
      if (this.bot && this.isActive) {
        this.bot.chat('Holly here! Ready to add some artistic flair to our adventures!')
      }
    }, 2000)
  }

  handleCommand(username, message) {
    const command = message.slice(1).toLowerCase().split(' ')
    const baseCommand = command[0]

    if (message.toLowerCase().includes('holly')) {
      switch (baseCommand) {
        case 'create':
          this.startCreativeProject()
          break
        case 'design':
          this.designSomething()
          break
        case 'decorate':
          this.decorateArea()
          break
        default:
          super.handleCommand(username, message)
      }
    } else {
      super.handleCommand(username, message)
    }
  }

  startCreativeProject() {
    this.bot.chat('Time for a creative project! Art makes everything better!')
    this.logger.info('Starting creative project')
  }

  designSomething() {
    this.bot.chat('Let me design something beautiful and functional!')
  }

  decorateArea() {
    this.bot.chat('This area needs some artistic touches!')
  }

  handleMention(username, message) {
    if (message.toLowerCase().includes('art') || message.toLowerCase().includes('creative')) {
      this.bot.chat(`${username}, I'd love to help with anything artistic!`)
    } else {
      super.handleMention(username, message)
    }
  }
}

module.exports = Holly