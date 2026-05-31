const log = require('./logger')
const { GlideClusterClient } = require('@valkey/valkey-glide')

let client_ready, client
async function init(){
  try{
    client = await GlideClusterClient.createClient({
      addresses: [{ host: 'valkey-cache.datastore.svc.cluster.local', port: 6379 }],
      useTLS: false,
      requestTimeout: 5000,
      clientName: 'valkey_cache'
    })
    testClient()
  }catch(e){
    log.error(e)
    setTimeout(init, 5000)
  }
}
async function testClient(){
  try{
    let status = await client.ping()
    if(status == 'PONG'){
      log.info(`client is ready...`)
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
async function set(key, value, TTL){
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
async function get(key){
  try{
    if(!key || !client_ready) return
    return await client.get(key)
  }catch(e){
    log.error(e)
  }
}
async function del(key){
  try{
    if(!key || !client_ready) return
    await client.del([key])
    return true
  }catch(e){
    log.error(e)
  }
}
async function ping(){
  try{
    return await client.ping()
  }catch(e){
    log.error(e)
  }
}
module.exports = {
  del, get, set,
  status: () => ( client_ready )
}
