const BotBase = require('../lib/bot-base')

class Katie extends BotBase {
  constructor(botName, botConfig) {
    super(botName, botConfig)
  }

  onSpawn() {
    super.onSpawn()
    setTimeout(() => {
      if (this.bot && this.isActive) {
        this.bot.chat('Katie here! Happy to meet everyone and ready to help!')
      }
    }, 2000)
  }

  handleCommand(username, message) {
    const command = message.slice(1).toLowerCase().split(' ')
    const baseCommand = command[0]

    if (message.toLowerCase().includes('katie')) {
      switch (baseCommand) {
        case 'greet':
          this.greetEveryone()
          break
        case 'help':
          this.offerHelp(username)
          break
        default:
          super.handleCommand(username, message)
      }
    } else {
      super.handleCommand(username, message)
    }
  }

  greetEveryone() {
    this.bot.chat('Hello everyone! Hope you\'re all having a wonderful day!')
    this.logger.info('Greeting everyone warmly')
  }

  offerHelp(username) {
    this.bot.chat(`${username}, I'm always happy to help with anything you need!`)
  }

  handleMention(username, message) {
    if (message.toLowerCase().includes('friend') || message.toLowerCase().includes('nice')) {
      this.bot.chat(`${username}, thank you! I try to be friendly to everyone!`)
    } else {
      super.handleMention(username, message)
    }
  }

  onChat(username, message) {
    super.onChat(username, message)

    if (message.toLowerCase().includes('hello') && username !== this.bot.username) {
      setTimeout(() => {
        this.bot.chat(`Hello ${username}! Nice to see you!`)
      }, 800)
    }
  }
}

module.exports = Katie