'use strict'
const log = require('./logger')
const cache = require('./valkey')

const dataProject = require('./data_projection');

let KEY_PREFIX = 'GUILD'
if(process.env.CACHE_PREFIX) KEY_PREFIX += `_${process.env.CACHE_PREFIX}`

module.exports.set = async(data)=>{
  try{
    if(!data?.id) return;
    //300 = 5 mins
    return await cache.setJSON(`${KEY_PREFIX}:${data.id}`, data, 300);
  }catch(e){
    log.error(e)
  }
}
module.exports.get = async({ guildId, projection })=>{
  try{
    if(!guildId) return;

    let data = await cache.getJSON(`${KEY_PREFIX}:${guildId}`);
    if(!data?.id) return;

    if(!projection) return data
    return dataProject(data, projection);

  }catch(e){
    log.error(e)
  }
}
