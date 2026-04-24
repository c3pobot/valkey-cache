'use strict'
const log = require('./logger')
const { GlideClusterClient } = require('@valkey/valkey-glide')

const CLIENT_PORT = +(process.env.CLIENT_PORT || 6379), CLIENT_POD_NAME = process.env.CLIENT_POD_NAME || 'valkey', CLIENT_NAME_SPACE = process.env.CLIENT_NAME_SPACE || 'datastore', CLIENT_NUM_NODES = +(process.env.CLIENT_NUM_NODES || 5)

let NODE_ADDRESSES = [], client, client_ready

const init = async()=>{
  try{
    for(let i = 0; i < CLIENT_NUM_NODES; i++) NODE_ADDRESSES.push({ host: `${CLIENT_POD_NAME}-${i}.${CLIENT_POD_NAME}.${CLIENT_NAME_SPACE}.svc.cluster.local`, port: CLIENT_PORT })
    client = await GlideClusterClient.createClient({
      addresses: NODE_ADDRESSES,
      useTLS: false,
      requestTimeout: 1000,
      clientName: 'valkey_test'
    })
    testClient()
  }catch(e){
    setTimeout(init, 5000)
    log.error(e)
  }
}
const testClient = async()=>{
  try{
    let status = await client.ping()
    if(status == 'PONG'){
      log.info(`valkey cache client is ready...`)
      client_ready = true
      return
    }
    setTimeout(testClient, 5000)
  }catch(e){
    setTimeout(testClient, 5000)
    log.error(e)
  }
}
init()
const setValue = async(key, value, TTL)=>{
  try{
    if(!key || !value || !client_ready) return
    let opts = {}
    if(TTL) opts.expiry = { count: TTL, type: 'EX' }
    let res = await client.set(key, value, opts)
    if(res == 'OK') return true
  }catch(e){
    log.error(e)
  }
}
const getValue = async(key)=>{
  try{
    if(!key || !client_ready) return
    return await client.get(key)
  }catch(e){
    log.error(e)
  }
}
const delValue = async(key)=>{
  try{
    await client.del([key])
    return true
  }catch(e){
    log.error(e)
  }
}
module.exports.del = delValue
module.exports.get = getValue
module.exports.getJSON = async(key)=>{
  try{
    if(!key || !client_ready) return
    let res = await getValue(key)
    if(res) return JSON.parse(res)
  }catch(e){
    log.error(e)
  }
}
module.exports.set = setValue
module.exports.setJSON = async(key, data, TTL)=>{
  try{
    if(!key || !data || !client_ready) return
    return await setValue(key, JSON.stringify(data), TTL)
  }catch(e){
    log.error(e)
  }
}
module.exports.status = ()=>{
  return client_ready
}
