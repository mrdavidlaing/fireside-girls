const BotBase = require('../lib/bot-base')

class Candace extends BotBase {
  constructor(botName, botConfig) {
    super(botName, botConfig)
    this.dramaLevel = 75
  }

  onSpawn() {
    super.onSpawn()
    setTimeout(() => {
      if (this.bot && this.isActive) {
        this.bot.chat('Candace Flynn has arrived! This is going to be SO amazing!')
      }
    }, 2000)
  }

  handleCommand(username, message) {
    const command = message.slice(1).toLowerCase().split(' ')
    const baseCommand = command[0]

    if (message.toLowerCase().includes('candace')) {
      switch (baseCommand) {
        case 'drama':
          this.createDrama()
          break
        case 'announce':
          this.makeAnnouncement()
          break
        case 'complain':
          this.voiceComplaint()
          break
        default:
          super.handleCommand(username, message)
      }
    } else {
      super.handleCommand(username, message)
    }
  }

  createDrama() {
    this.bot.chat('OH MY GOSH! This is like, the most dramatic thing EVER!')
    this.logger.info('Creating dramatic scene')
    
    setTimeout(() => {
      this.bot.chat('I mean, seriously, how can anyone be so calm about this?!')
    }, 2000)
  }

  makeAnnouncement() {
    this.bot.chat('ATTENTION EVERYONE! I have something VERY important to say!')
    setTimeout(() => {
      this.bot.chat('This Fireside Girls thing is actually pretty cool...')
    }, 3000)
  }

  voiceComplaint() {
    const complaints = [
      'Why is everything so complicated?',
      'This is harder than it looks!',
      'Can\'t we do something more... glamorous?',
      'Jeremy would totally be impressed by this... I think.'
    ]

    const complaint = complaints[Math.floor(Math.random() * complaints.length)]
    this.bot.chat(complaint)
  }

  handleMention(username, message) {
    if (message.toLowerCase().includes('dramatic') || message.toLowerCase().includes('attention')) {
      this.bot.chat(`${username}, I am NOT being dramatic! This is just how I express myself!`)
    } else if (message.toLowerCase().includes('jeremy')) {
      this.bot.chat(`${username}, did someone mention Jeremy?! *heart eyes*`)
    } else {
      super.handleMention(username, message)
    }
  }

  onChat(username, message) {
    super.onChat(username, message)

    if (message.toLowerCase().includes('jeremy') && username !== this.bot.username) {
      setTimeout(() => {
        this.bot.chat('Did someone say JEREMY?! Where?! *looks around frantically*')
      }, 800)
    }

    if (message.toLowerCase().includes('phineas') && message.toLowerCase().includes('ferb') && username !== this.bot.username) {
      setTimeout(() => {
        this.bot.chat('Wait, are my brothers doing something I should know about?')
      }, 1000)
    }
  }
}

module.exports = Candace