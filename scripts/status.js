#!/usr/bin/env node

const BotManager = require('../lib/bot-manager')

async function showStatus() {
  console.log('📊 Fireside Girls Bot Status 📊')
  console.log('===============================')

  const manager = new BotManager()

  try {
    await manager.loadBotClasses()

    const allStatus = manager.getAllBotStatus()

    console.log(`\n🤖 Bot Status Report (${new Date().toLocaleString()}):`)
    console.log('=' .repeat(50))

    allStatus.forEach(status => {
      const statusIcon = status.status === 'running' ?
        (status.connected ? '🟢' : '🟡') : '🔴'

      const connectionStatus = status.connected ? 'Connected' : 'Disconnected'

      console.log(`${statusIcon} ${status.name}`)
      console.log(`   Status: ${status.status}`)
      if (status.status === 'running') {\n        console.log(`   Connection: ${connectionStatus}`)\n        console.log(`   Personality: ${status.personality}`)\n        if (status.reconnectAttempts > 0) {\n          console.log(`   Reconnect Attempts: ${status.reconnectAttempts}`)\n        }\n      }\n      console.log('')\n    })\n\n    const runningCount = allStatus.filter(s => s.status === 'running').length\n    const connectedCount = allStatus.filter(s => s.connected).length\n\n    console.log('📈 Summary:')\n    console.log(`   Total Bots: ${allStatus.length}`)\n    console.log(`   Running: ${runningCount}`)\n    console.log(`   Connected: ${connectedCount}`)\n    console.log(`   Offline: ${allStatus.length - runningCount}`)\n\n  } catch (error) {\n    console.error('❌ Error getting status:', error.message)\n    process.exit(1)\n  }\n}\n\nif (require.main === module) {\n  showStatus()\n}\n\nmodule.exports = showStatus"}]