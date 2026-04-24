'use strict'
const log = require('./logger')
const cache = require('./valkey')

const playerIdCache = require('./player_id_cache')

let KEY_PREFIX = 'GUILDID'
if(process.env.CACHE_PREFIX) KEY_PREFIX += `_${process.env.CACHE_PREFIX}`

module.exports.set = async({ allyCode, playerId, guildId, guildName })=>{
  try{
    if(!playerId || !guildId) return;

    return await cache.setJSON(`${KEY_PREFIX}:${playerId}`, { allyCode, playerId, guildId, guildName }, 604800);
  }catch(e){
    log.error(e)
  }
};
module.exports.get = async({ playerId, allyCode })=>{
  try{
    if(!playerId && !allyCode) return;

    let tempId = playerId
    if(!tempId) tempId = await playerIdCache.getJSON(allyCode);
    if(!tempId) return;

    return await cache.get(`${KEY_PREFIX}:${playerId}`);
  }catch(e){
    log.error(e)
  }
}
