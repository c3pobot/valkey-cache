'use strict'
const log = require('./logger')
const cache = require('./valkey')

let KEY_PREFIX = 'PLAYERID'
if(process.env.CACHE_PREFIX) KEY_PREFIX += `_${process.env.CACHE_PREFIX}`

module.exports.set = async(allyCode, playerId)=>{
  try{
    if(!allyCode || !playerId) return;

    return await cache.set(`${KEY_PREFIX}:${allyCode}`, playerId, 604800);
  }catch(e){
    log.error(e)
  }
}
module.exports.get = async(allyCode)=>{
  try{
    if(!allyCode) return;

    return await cache.get(`${KEY_PREFIX}:${allyCode}`);
  }catch(e){
    log.error(e)
  }
}
