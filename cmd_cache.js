'use strict'
const log = require('./logger')
const cache = require('./valkey')

let KEY_PREFIX = 'CMD'
if(process.env.CACHE_PREFIX) KEY_PREFIX += `_${process.env.CACHE_PREFIX}`

module.exports.set = async(key, data)=>{
  try{
    if(!key || !data) return;

    return await cache.setJSON(`${KEY_PREFIX}:${key}`, data, 600);
  }catch(e){
    log.error(e)
  }
}
module.exports.get = async(key)=>{
  try{
    if(!key) return;

    return await cache.getJSON(`${KEY_PREFIX}:${key}`);
  }catch(e){
    log.error(e)
  }
}
module.exports.del = async(key)=>{
  try{
    if(!key) return;
    
    return await cache.del(`${KEY_PREFIX}:${key}`);
  }catch(e){
    log.error(e)
  }
}
