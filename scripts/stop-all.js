#!/usr/bin/env node

const BotManager = require('../lib/bot-manager')

async function stopAllBots() {
  console.log('🛑 Stopping Fireside Girls Bot Troupe 🛑')
  console.log('======================================')

  const manager = new BotManager()

  try {
    await manager.loadBotClasses()

    const activeBots = manager.getActiveBots()

    if (activeBots.length === 0) {
      console.log('ℹ️  No active bots found to stop')
      return
    }

    console.log(`🔍 Found ${activeBots.length} active bots`)

    activeBots.forEach(bot => {
      console.log(`   - ${bot.name} (${bot.config.personality})`)
    })

    console.log('\n🛑 Stopping all bots...')

    const stoppedCount = manager.stopAllBots()

    console.log(`\n📊 Shutdown Results:`)
    console.log('===================')
    console.log(`✅ ${stoppedCount} bots stopped successfully`)

    if (stoppedCount > 0) {
      console.log('\n👋 All Fireside Girls have been dismissed!')
      console.log('Thanks for using the Fireside Girls Bot Troupe!')
    }

  } catch (error) {
    console.error('❌ Error during shutdown:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  stopAllBots()
}

module.exports = stopAllBots