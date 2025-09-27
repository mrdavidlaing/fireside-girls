#!/usr/bin/env node

const BotManager = require('../lib/bot-manager')

async function startAllBots() {
  console.log('🔥 Starting Fireside Girls Bot Troupe 🔥')
  console.log('=====================================')

  const manager = new BotManager()

  try {
    await manager.loadBotClasses()
    console.log('✅ Bot classes loaded successfully')

    const results = await manager.startAllBots()

    console.log('\n📊 Startup Results:')
    console.log('==================')

    results.forEach(result => {
      const status = result.success ? '✅' : '❌'
      console.log(`${status} ${result.name}: ${result.success ? 'Started' : 'Failed'}`)
    })

    const successCount = results.filter(r => r.success).length
    console.log(`\n🎯 Total: ${successCount}/${results.length} bots started successfully`)

    if (successCount > 0) {
      console.log('\n🎉 Fireside Girls are ready for action!')
      console.log('Available commands for bots:')
      console.log('- !follow <player> - Follow a player')
      console.log('- !come <player> - Come to a player')
      console.log('- !status - Report status')
      console.log('- !help - Show bot-specific commands')
      console.log('\nPress Ctrl+C to shutdown all bots')
    } else {
      console.log('\n❌ No bots started successfully. Check configuration and server connection.')
      process.exit(1)
    }

  } catch (error) {
    console.error('❌ Failed to start bots:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  startAllBots()
}

module.exports = startAllBots