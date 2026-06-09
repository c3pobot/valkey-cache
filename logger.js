'use strict'
let logLevel = process.env.LOG_LEVEL || 'info';

const timestampFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Etc/GMT+5',
  hour12: false,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

function getTimeStamp(timestamp = Date.now()) {
  return timestampFormatter.format(new Date(timestamp));
}

export function error(err, table_name){
  try{
    console.error(`${getTimeStamp(Date.now())} ERROR [${table_name || 'valkey-client'}] ${err}`)
    if(err?.stack) console.error(err)
  }catch(e){
    console.error(e)
  }
}
export function info(msg, table_name){
  try{
    console.log(`${getTimeStamp(Date.now())} INFO [${table_name || 'valkey-client'}] ${msg}`)
  }catch(e){
    console.error(e)
  }
}
