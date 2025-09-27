#!/usr/bin/env node

const BotManager = require('../lib/bot-manager')
const config = require('../config/config')

async function startSingleBot() {
  const botName = process.argv[2]

  if (!botName) {
    console.log('🔥 Fireside Girls Single Bot Starter 🔥')
    console.log('======================================')
    console.log('')
    console.log('Usage: node scripts/start-single.js <bot_name>')
    console.log('')
    console.log('Available bots:')
    Object.keys(config.bots).forEach(bot => {
      const botConfig = config.bots[bot]
      console.log(`  - ${bot} (${botConfig.personality}): ${botConfig.description}`)
    })
    console.log('')
    console.log('Example: node scripts/start-single.js isabella')
    process.exit(1)
  }

  if (!config.bots[botName]) {
    console.error(`❌ Bot '${botName}' not found in configuration`)
    console.log('Available bots:', Object.keys(config.bots).join(', '))
    process.exit(1)
  }

  console.log(`🔥 Starting ${botName} 🔥`)
  console.log('='.repeat(20 + botName.length))

  const manager = new BotManager()

  try {
    await manager.loadBotClasses()
    console.log('✅ Bot classes loaded successfully')

    const result = await manager.startBot(botName)

    if (result) {
      const botConfig = config.bots[botName]
      console.log(`✅ ${botName} started successfully!`)
      console.log(`   Personality: ${botConfig.personality}`)
      console.log(`   Description: ${botConfig.description}`)
      console.log(`   Username: ${botConfig.username}`)
      console.log('')
      console.log('🎉 Bot is ready for action!')
      console.log('Press Ctrl+C to shutdown the bot')
    } else {
      console.log(`❌ Failed to start ${botName}`)
      console.log('Check configuration and server connection.')
      process.exit(1)
    }

  } catch (error) {
    console.error(`❌ Failed to start ${botName}:`, error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  startSingleBot()
}

module.exports = startSingleBot