const BotBase = require('../lib/bot-base')
const { goals } = require('mineflayer-pathfinder')

class Adyson extends BotBase {
  constructor(botName, botConfig) {
    super(botName, botConfig)
    this.organizationTasks = []
    this.currentInventoryState = null
  }

  onSpawn() {
    super.onSpawn()
    this.logger.info('Adyson is ready to organize everything!')

    setTimeout(() => {
      if (this.bot && this.isActive) {
        this.bot.chat('Adyson Sweetwater reporting! Ready to get everything organized and sorted!')
      }
    }, 2000)
  }

  handleCommand(username, message) {
    const command = message.slice(1).toLowerCase().split(' ')
    const baseCommand = command[0]

    if (message.toLowerCase().includes('adyson')) {
      switch (baseCommand) {
        case 'organize':
          this.organizeArea()
          break
        case 'sort':
          this.sortInventory()
          break
        case 'clean':
          this.cleanupArea()
          break
        case 'inventory':
          this.manageInventory()
          break
        case 'help':
          this.showOrganizationCommands(username)
          break
        default:
          super.handleCommand(username, message)
      }
    } else {
      super.handleCommand(username, message)
    }
  }

  organizeArea() {
    this.bot.chat('Time to get this area organized! Everything has its place!')
    this.logger.info('Starting area organization')

    setTimeout(() => {
      this.bot.chat('First, let me assess what we have here...')
    }, 2000)

    setTimeout(() => {
      this.bot.chat('Perfect! I can see exactly how to make this more efficient!')
    }, 4000)
  }

  sortInventory() {
    this.bot.chat('Inventory sorting time! A place for everything and everything in its place!')
    this.logger.info('Sorting inventory')

    const items = this.bot.inventory.items()
    if (items.length === 0) {
      this.bot.chat('Inventory is already perfectly empty and organized!')
      return
    }

    setTimeout(() => {
      this.bot.chat(`Organizing ${items.length} items by type, quantity, and usefulness...`)
    }, 1500)

    setTimeout(() => {
      this.bot.chat('Inventory successfully organized! Everything is in perfect order!')
    }, 3000)
  }

  cleanupArea() {
    this.bot.chat('Cleanup time! We need to maintain our high standards!')
    this.logger.info('Cleaning up area')

    setTimeout(() => {
      this.bot.chat('Scanning for any dropped items or disorganized blocks...')
    }, 2000)

    setTimeout(() => {
      this.bot.chat('Area cleanup complete! Everything looks much better now!')
    }, 4000)
  }

  manageInventory() {
    const items = this.bot.inventory.items()
    const itemCounts = new Map()

    items.forEach(item => {
      const count = itemCounts.get(item.name) || 0
      itemCounts.set(item.name, count + item.count)
    })

    this.bot.chat('Current inventory analysis:')

    if (itemCounts.size === 0) {
      this.bot.chat('Inventory is completely empty - perfectly organized!')
    } else {
      const sortedItems = Array.from(itemCounts.entries()).sort((a, b) => b[1] - a[1])
      sortedItems.slice(0, 5).forEach((item, index) => {
        setTimeout(() => {
          this.bot.chat(`${item[0]}: ${item[1]} units`)
        }, (index + 1) * 500)
      })
    }
  }

  showOrganizationCommands(username) {
    const commands = [
      '!organize - Organize current area',
      '!sort - Sort inventory items',
      '!clean - Clean up the area',
      '!inventory - Analyze inventory',
      '!status - Organization status'
    ]

    this.bot.chat(`${username}, Adyson's organization commands:`)
    commands.forEach((cmd, index) => {
      setTimeout(() => {
        this.bot.chat(cmd)
      }, (index + 1) * 500)
    })
  }

  handleMention(username, message) {
    if (message.toLowerCase().includes('organize') || message.toLowerCase().includes('sort')) {
      this.bot.chat(`${username}, I'd be happy to help organize anything that needs it!`)
    } else if (message.toLowerCase().includes('mess') || message.toLowerCase().includes('chaos')) {
      this.bot.chat(`${username}, don't worry! I can turn any chaos into perfect order!`)
    } else if (message.toLowerCase().includes('clean') || message.toLowerCase().includes('tidy')) {
      this.bot.chat(`${username}, cleanliness and organization go hand in hand!`)
    } else {
      super.handleMention(username, message)
    }
  }

  onChat(username, message) {
    super.onChat(username, message)

    if (message.toLowerCase().includes('messy') && username !== this.bot.username) {
      setTimeout(() => {
        this.bot.chat('Did someone say messy? I can fix that!')
      }, 1000)
    }

    if (message.toLowerCase().includes('perfect') && username !== this.bot.username) {
      setTimeout(() => {
        this.bot.chat('Perfect organization is always the goal!')
      }, 800)
    }
  }
}

module.exports = Adyson