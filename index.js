'use strict'
const log = require('./logger')
let logLevel = process.env.LOG_LEVEL || log.Level.INFO;
log.setLevel(logLevel);

const cache = require('./valkey')
const Cmds = {}

Cmds.cacheReady = ()=>{
  return cache.status()
}

Cmds.cmdCache = require('./cmd_cache')
Cmds.guildCache = require('./guild_cache')
Cmds.guildIdCache = require('./guild_id_cache')
Cmds.playerCache = require('./player_cache')
Cmds.playerIdCache = require('./player_id_cache')

module.exports = Cmds
