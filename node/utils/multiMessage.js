const conversion = require('./Conversion')
module.exports = {

    multiMessage : (data) => {
  
        var messages = []
        var i = 0
        do{
          messages[i] = decode(data, messageHeader)
          data = data.substr((4 + 12 + 4 + 4 ) * 2 + messages[i].payload.length)
          i++
        }while(data.length > 0)
        
        return messages
    }, 

}

var messageHeader = {
    magic : 0,
    command :  4,
    length : 16,
    checksum : 20,
    payload : 24
}

function decode (data, schema) {
    var header = []
    var payload = ''
    var len = Object.keys(schema).length 
    for(var i = 0; i < len; i++){
      var start = Object.values(schema)[i] * 2
      if(i+1 < len){
        var end = Object.values(schema)[i+1] * 2 - start
        header.push(data.substr(start, end))
      }else{
        var end = conversion.hex2dec(conversion.unfill(header[2])) * 2
        payload = data.substr(start,end)
      }
    
    }
    return {header, payload}
}