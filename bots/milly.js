const BotBase = require('../lib/bot-base')

class Milly extends BotBase {
  constructor(botName, botConfig) {
    super(botName, botConfig)
    this.questionsAsked = 0
  }

  onSpawn() {
    super.onSpawn()
    setTimeout(() => {
      if (this.bot && this.isActive) {
        this.bot.chat('Milly here! I have so many questions about this world!')
      }
    }, 2000)
  }

  handleCommand(username, message) {
    const command = message.slice(1).toLowerCase().split(' ')
    const baseCommand = command[0]

    if (message.toLowerCase().includes('milly')) {
      switch (baseCommand) {
        case 'explore':
          this.startExploring()
          break
        case 'question':
          this.askQuestion()
          break
        case 'investigate':
          this.investigateArea()
          break
        default:
          super.handleCommand(username, message)
      }
    } else {
      super.handleCommand(username, message)
    }
  }

  startExploring() {
    this.bot.chat('Exploration time! I wonder what we\'ll discover!')
    this.logger.info('Starting curious exploration')
  }

  askQuestion() {
    const questions = [
      'I wonder how redstone actually works?',
      'What\'s the most interesting thing you\'ve seen here?',
      'How do you think we could improve this area?',
      'What do you think is beyond those mountains?',
      'Have you ever wondered why creepers explode?'
    ]

    const question = questions[Math.floor(Math.random() * questions.length)]
    this.bot.chat(question)
    this.questionsAsked++
  }

  investigateArea() {
    this.bot.chat('Let me investigate this area thoroughly!')
    setTimeout(() => {
      this.bot.chat('So many interesting details to observe!')
    }, 2000)
  }

  handleMention(username, message) {
    if (message.toLowerCase().includes('curious') || message.toLowerCase().includes('question')) {
      this.bot.chat(`${username}, I love learning new things! What can you teach me?`)
    } else {
      super.handleMention(username, message)
    }
  }

  onChat(username, message) {
    super.onChat(username, message)

    if (message.includes('?') && username !== this.bot.username) {
      setTimeout(() => {
        this.bot.chat('Ooh, a question! I love questions!')
      }, 1000)
    }
  }
}

module.exports = Milly