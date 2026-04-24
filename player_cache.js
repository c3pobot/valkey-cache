'use strict'
const log = require('./logger')
const cache = require('./valkey')

const playerIdCache = require('./player_id_cache');
const guildIdCache = require('./guild_id_cache');
const dataProject = require('./data_projection');

let KEY_PREFIX = 'PLAYER'
if(process.env.CACHE_PREFIX) KEY_PREFIX += `_${process.env.CACHE_PREFIX}`

module.exports.set = async(data)=>{
  try{
    if(!data?.allyCode || !data?.playerId) return;

    if(data?.guildId) guildIdCache.set(data);
    await playerIdCache.set(data.allyCode, data.playerId);
    //300 = 5 mins
    return await cache.setJSON(`${KEY_PREFIX}:${data.playerId}`, data, 300);
  }catch(e){
    log.error(e)
  }
}
module.exports.get = async({ allyCode, playerId, projection })=>{
  try{
    if(!allyCode && !playerId) return;

    let tempId = playerId
    if(!tempId && allyCode) tempId = await playerIdCache.get(allyCode);
    if(!tempId) return;

    let data = await cache.getJSON(`${KEY_PREFIX}:${tempId}`);
    if(!data?.allyCode) return;

    if(!projection) return data
    return dataProject(data, projection);

  }catch(e){
    log.error(e)
  }
}
