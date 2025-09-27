const BotBase = require('../lib/bot-base')
const { goals } = require('mineflayer-pathfinder')

class Isabella extends BotBase {
  constructor(botName, botConfig) {
    super(botName, botConfig)
    this.troopMembers = []
    this.currentMission = null
  }

  onSpawn() {
    super.onSpawn()
    this.logger.info('Isabella is ready to lead the Fireside Girls!')

    setTimeout(() => {
      if (this.bot && this.isActive) {
        this.bot.chat('Fireside Girls, assemble! Isabella Garcia-Shapiro reporting for duty!')
      }
    }, 2000)
  }

  handleCommand(username, message) {
    const command = message.slice(1).toLowerCase().split(' ')
    const baseCommand = command[0]

    if (message.toLowerCase().includes('isabella')) {
      switch (baseCommand) {
        case 'assemble':
          this.assembleTroop()
          break
        case 'mission':
          this.startMission(command.slice(1).join(' '))
          break
        case 'formation':
          this.formUp()
          break
        case 'patrol':
          this.startPatrol()
          break
        case 'help':
          this.showLeaderCommands(username)
          break
        default:
          super.handleCommand(username, message)
      }
    } else {
      super.handleCommand(username, message)
    }
  }

  assembleTroop() {
    this.bot.chat('Fireside Girls, form up! Let\'s show everyone how organized we are!')
    this.logger.info('Assembling the troop')

    setTimeout(() => {
      this.bot.chat('Remember girls: \"We never give up, we never give in!\"')
    }, 3000)
  }

  startMission(missionType) {
    if (!missionType) {
      this.bot.chat('What\'s our mission? Building? Exploring? Badge earning?')
      return
    }

    this.currentMission = missionType
    this.bot.chat(`New mission assigned: ${missionType}! Let's earn some patches!`)
    this.logger.info(`Started mission: ${missionType}`)

    switch (missionType.toLowerCase()) {
      case 'build':
        this.bot.chat('Alright girls, time to build something amazing! Gretchen, what\'s the plan?')
        break
      case 'explore':
        this.bot.chat('Exploration time! Everyone stay together and watch out for each other!')
        break
      case 'gather':
        this.bot.chat('Resource gathering mission! Let\'s collect what we need efficiently!')
        break
      default:
        this.bot.chat(`Let's tackle this ${missionType} mission with Fireside Girl determination!`)
    }
  }

  formUp() {
    this.bot.chat('Formation time! Everyone line up behind me!')
    this.logger.info('Commanding formation')

    const myPos = this.bot.entity.position
    this.bot.pathfinder.setGoal(new goals.GoalBlock(myPos.x, myPos.y, myPos.z))

    setTimeout(() => {
      this.bot.chat('Perfect formation, girls! We look great!')
    }, 5000)
  }

  startPatrol() {
    this.bot.chat('Starting patrol! Keep your eyes open for anything interesting!')
    this.logger.info('Starting patrol pattern')

    this.performPatrolPattern()
  }

  performPatrolPattern() {
    if (!this.isActive) return

    const startPos = this.bot.entity.position
    const patrolPoints = [
      { x: startPos.x + 10, z: startPos.z },
      { x: startPos.x + 10, z: startPos.z + 10 },
      { x: startPos.x, z: startPos.z + 10 },
      { x: startPos.x, z: startPos.z }
    ]

    let currentPoint = 0

    const moveToNextPoint = () => {
      if (!this.isActive || currentPoint >= patrolPoints.length) {
        this.bot.chat('Patrol complete! Area secured!')
        return
      }

      const point = patrolPoints[currentPoint]
      const goal = new goals.GoalNear(point, 2)
      this.bot.pathfinder.setGoal(goal)

      this.bot.pathfinder.once('goal_reached', () => {
        currentPoint++
        setTimeout(moveToNextPoint, 2000)
      })
    }

    moveToNextPoint()
  }

  showLeaderCommands(username) {
    const commands = [
      '!assemble - Gather the troop',
      '!mission <type> - Start a mission',
      '!formation - Form up in line',
      '!patrol - Start area patrol',
      '!follow - Follow a player',
      '!status - Report status'
    ]

    this.bot.chat(`${username}, Isabella's leader commands:`)
    commands.forEach(cmd => {
      setTimeout(() => {
        this.bot.chat(cmd)
      }, 500)
    })
  }

  handleMention(username, message) {
    if (message.toLowerCase().includes('leader') || message.toLowerCase().includes('chief')) {
      this.bot.chat(`${username}, as troop leader, I'm here to coordinate our activities!`)
    } else if (message.toLowerCase().includes('patch') || message.toLowerCase().includes('badge')) {
      this.bot.chat(`${username}, we're always working on earning new patches! What should we focus on?`)
    } else if (message.toLowerCase().includes('phineas')) {
      this.bot.chat(`${username}, Phineas always has the most amazing projects! I wonder what he's building today?`)
    } else {
      super.handleMention(username, message)
    }
  }

  onChat(username, message) {
    super.onChat(username, message)

    if (message.toLowerCase().includes('fireside girls') && username !== this.bot.username) {
      this.bot.chat('That\'s us! The most organized youth group in the Tri-State Area!')
    }

    if (message.toLowerCase().includes('phineas') && !message.includes(this.bot.username)) {
      setTimeout(() => {
        this.bot.chat('Did someone mention Phineas? *heart eyes*')
      }, 1000)
    }
  }
}

module.exports = Isabella