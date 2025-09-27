require('dotenv').config({ override: true })

const config = {
  server: {
    host: process.env.SERVER_HOST || 'localhost',
    port: parseInt(process.env.SERVER_PORT) || 25565,
    version: process.env.SERVER_VERSION || '1.21.1'
  },

  auth: {
    useOfflineMode: process.env.USE_OFFLINE_MODE === 'true',
    microsoftAuth: process.env.MICROSOFT_AUTH === 'true'
  },

  behavior: {
    spawnInterval: parseInt(process.env.BOT_SPAWN_INTERVAL) || 500,
    maxReconnectAttempts: parseInt(process.env.MAX_RECONNECT_ATTEMPTS) || 5,
    reconnectDelay: parseInt(process.env.RECONNECT_DELAY) || 5000
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    toFile: process.env.LOG_TO_FILE === 'true'
  },

  bots: {
    isabella: {
      username: process.env.ISABELLA_USERNAME || 'Isabella',
      password: process.env.ISABELLA_PASSWORD || null,
      personality: 'leader',
      description: 'Troop leader with coordination abilities'
    },
    gretchen: {
      username: process.env.GRETCHEN_USERNAME || 'Gretchen',
      password: process.env.GRETCHEN_PASSWORD || null,
      personality: 'technical',
      description: 'Smart bot with technical knowledge'
    },
    adyson: {
      username: process.env.ADYSON_USERNAME || 'Adyson',
      password: process.env.ADYSON_PASSWORD || null,
      personality: 'organized',
      description: 'Organized and methodical'
    },
    ginger: {
      username: process.env.GINGER_USERNAME || 'Ginger',
      password: process.env.GINGER_PASSWORD || null,
      personality: 'energetic',
      description: 'Energetic and enthusiastic'
    },
    holly: {
      username: process.env.HOLLY_USERNAME || 'Holly',
      password: process.env.HOLLY_PASSWORD || null,
      personality: 'artistic',
      description: 'Creative and artistic'
    },
    katie: {
      username: process.env.KATIE_USERNAME || 'Katie',
      password: process.env.KATIE_PASSWORD || null,
      personality: 'friendly',
      description: 'Friendly and approachable'
    },
    milly: {
      username: process.env.MILLY_USERNAME || 'Milly',
      password: process.env.MILLY_PASSWORD || null,
      personality: 'curious',
      description: 'Curious and inquisitive'
    },
    candace: {
      username: process.env.CANDACE_USERNAME || 'Candace',
      password: process.env.CANDACE_PASSWORD || null,
      personality: 'dramatic',
      description: 'Dramatic and attention-seeking'
    }
  }
}

module.exports = config