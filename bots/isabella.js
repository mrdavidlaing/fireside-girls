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
        case 'clear':
          this.clearArea(username, command.slice(1).join(' '))
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
      '!clear [radius] - Clear area (default 5, max 10)',
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

  async clearArea(username, args) {
    // Cancel any active pathfinder goal (like follow) to avoid conflicts
    this.bot.pathfinder.setGoal(null)

    // Parse args: "radius <number>" or just a number for radius around current position
    const argParts = args.trim().split(' ')
    let radius = 5 // default radius

    if (argParts.length > 0 && argParts[0] !== '') {
      const parsed = parseInt(argParts[0])
      if (!isNaN(parsed) && parsed > 0 && parsed <= 10) {
        radius = parsed
      }
    }

    // Check for other Fireside Girls online
    const troopMembers = ['gretchen', 'adyson', 'ginger', 'holly', 'katie', 'milly', 'candace']
    const activeTroop = troopMembers.filter(name => {
      // Check both lowercase and capitalized versions
      const lowerName = this.bot.players[name]
      const capitalName = this.bot.players[name.charAt(0).toUpperCase() + name.slice(1)]
      return (lowerName && lowerName.entity) || (capitalName && capitalName.entity)
    }).map(name => {
      // Return the actual player name (capitalized if that's what exists)
      if (this.bot.players[name]) return name
      return name.charAt(0).toUpperCase() + name.slice(1)
    })

    if (activeTroop.length > 0) {
      // Multi-bot clearing with troupe coordination
      this.bot.chat(`Clearing area for ${username}! Calling in the troupe!`)
      this.logger.info(`Clear area with ${activeTroop.length} troupe members: ${activeTroop.join(', ')}`)

      await this.coordinatedClear(username, radius, activeTroop)
    } else {
      // Solo clearing
      this.bot.chat(`Clearing area for ${username}! Working solo...`)
      this.logger.info(`Clear area command from ${username}: solo, radius ${radius}`)

      await this.soloClear(radius)
    }
  }

  async soloClear(radius) {
    try {
      const botPos = this.bot.entity.position
      let totalCleared = 0

      this.bot.chat(`Clearing ${radius} block radius area...`)

      // Clear blocks immediately instead of storing in array
      for (let x = -radius; x <= radius; x++) {
        for (let y = -2; y <= 3; y++) { // Clear from 2 below to 3 above
          for (let z = -radius; z <= radius; z++) {
            const pos = botPos.offset(x, y, z)
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

      this.bot.chat(`Area cleared! Removed ${totalCleared} blocks!`)
      this.logger.info(`Cleared ${totalCleared} blocks`)
    } catch (error) {
      this.bot.chat(`Oops, ran into a problem: ${error.message}`)
      this.logger.error(`Clear area error: ${error.message}`)
    }
  }

  async coordinatedClear(username, radius, activeTroop) {
    try {
      const centerPos = this.bot.entity.position
      const totalBots = activeTroop.length + 1 // +1 for Isabella

      this.bot.chat(`${totalBots} Fireside Girls reporting! Dividing the work...`)

      // Divide area into quadrants/zones based on number of bots
      const zones = this.divideIntoZones(centerPos, radius, totalBots)

      // Send zone assignments via chat with longer delays to avoid spam kick
      let delay = 1500
      activeTroop.forEach((botName, index) => {
        const zone = zones[index + 1]
        const zoneCenter = zone.center
        // Send a message that other bots can parse
        setTimeout(() => {
          this.bot.chat(`${botName}, clear zone at ${Math.round(zoneCenter.x)} ${Math.round(zoneCenter.y)} ${Math.round(zoneCenter.z)} radius ${zone.radius}`)
        }, delay)
        delay += 1500
      })

      // Isabella clears her zone
      setTimeout(async () => {
        const myZone = zones[0]
        this.bot.chat(`I'll take the center zone!`)
        await this.clearZone(myZone)
        this.bot.chat(`My zone is clear!`)
      }, delay)

    } catch (error) {
      this.bot.chat(`Coordination error: ${error.message}`)
      this.logger.error(`Coordinated clear error: ${error.message}`)
    }
  }

  divideIntoZones(center, totalRadius, numBots) {
    const zones = []

    if (numBots === 1) {
      zones.push({ center, radius: totalRadius })
    } else if (numBots === 2) {
      // Split east/west
      zones.push({ center: center.offset(-totalRadius/2, 0, 0), radius: totalRadius/2 })
      zones.push({ center: center.offset(totalRadius/2, 0, 0), radius: totalRadius/2 })
    } else if (numBots <= 4) {
      // Split into quadrants
      const offset = totalRadius / 2
      zones.push({ center: center.offset(-offset, 0, -offset), radius: totalRadius/2 })
      zones.push({ center: center.offset(offset, 0, -offset), radius: totalRadius/2 })
      zones.push({ center: center.offset(-offset, 0, offset), radius: totalRadius/2 })
      zones.push({ center: center.offset(offset, 0, offset), radius: totalRadius/2 })
    } else {
      // For more bots, create a grid pattern
      const gridSize = Math.ceil(Math.sqrt(numBots))
      const zoneRadius = totalRadius / gridSize

      for (let i = 0; i < numBots; i++) {
        const row = Math.floor(i / gridSize)
        const col = i % gridSize
        const offsetX = (col - gridSize/2 + 0.5) * zoneRadius * 2
        const offsetZ = (row - gridSize/2 + 0.5) * zoneRadius * 2
        zones.push({ center: center.offset(offsetX, 0, offsetZ), radius: zoneRadius })
      }
    }

    return zones
  }

  async clearZone(zone) {
    const centerPos = zone.center
    const radius = zone.radius
    let totalCleared = 0

    // Clear blocks immediately instead of storing in array
    for (let x = -radius; x <= radius; x++) {
      for (let y = -2; y <= 3; y++) {
        for (let z = -radius; z <= radius; z++) {
          const pos = centerPos.offset(x, y, z)
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

    this.logger.info(`Cleared ${totalCleared} blocks in zone`)
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