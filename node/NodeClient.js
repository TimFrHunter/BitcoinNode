const net = require('net')
const fs   = require('fs');
const yaml = require('js-yaml');
const CreateCommand = require('./protocol/CreateCommand')
const multiMessage = require('./utils/multiMessage')
const conversion = require('./utils/Conversion')
const parser = require('./parser/Block')
const readMessage = require('./utils/readMessage')
const BlockHeader = require('./protocol/Header')
const headerLength = 24 * 2//24 octects taille fixe du header


//Get parameters.yml for Config
try {
    var config = yaml.safeLoad(fs.readFileSync('./parameters.yml', 'utf8'));
} catch (e) {
    console.log(e);
}

// var hexaStream = "f9beb4d976657273696f6e000000000066000000710bc6c27f1101000d04000000000000a2dfc55d00000000000000000000000000000000000000000000ffffb08b745f208d0d04000000000000000000000000000000000000000000000000a8f5a0cd56a2096c102f5361746f7368693a302e31382e312f1b33090001f9beb4d976657261636b000000000000000000005df6e0e2"
// let messages = multiMessage.multiMessage(hexaStream)
// console.log(messages)

// return 1;
var dataUncompleted = ''

// Create Client Tcp Socket
var Client = new net.Socket()
Client.connect({
    port : config.node.port_remote,
    host : config.node.host_remote,
    localPort :config.node.port_local,
    localAddress: config.node.host_local
}, () => {})

Client.on('connect', function() {
    console.log('Infos => me: ',Client.localAddress, Client.localPort, " remote:",Client.remoteAddress,Client.remotePort)
    let createCommand = new CreateCommand()
    Client.write(createCommand.init('version', config)) 

});
Client.on('data', function(data) {
    var dataHex = Buffer.from(data,'hex').toString('hex');
    if(dataUncompleted.length){
        dataHex =  dataUncompleted + dataHex
       // console.log("Concated:",dataHex)
        dataUncompleted = ''
    }

    //console.log("recu:",dataHex)
    while(dataHex.length){
     
        let header = readMessage.getHeader(dataHex)  //get entete
        dataHex = dataHex.substr(headerLength)
       
        let checksum = header[3]
     
            let payloadLength = conversion.hex2dec(conversion.littleEndian2BigEndian(conversion.unfill(header[2]))) * 2
        
        let payload = readMessage.getPayload(dataHex,payloadLength)  
        let BH  = new BlockHeader()
        
        if(checksum != BH.payloadChecksum(payload) ){
            console.log("a => Command en cours :", conversion.hex2ascii(conversion.unfill(header[1])))
            dataUncompleted = header.join('')
            dataUncompleted += dataHex
            break
        }else{
            console.log("b")
            //console.log("header :",header,"payload:",payload)
            command(header, payload)
            dataHex = dataHex.substr(payloadLength)
        }
          
           
            
    }
    console.log("c")


});
Client.on('close', function() {
    console.log('Connection closed');

});
Client.on('error', function(err) {
    console.log('Error :',err);
});


function command(header, payload){
    let command = conversion.hex2ascii(conversion.unfill(header[1]))
    let createCommand = new CreateCommand()


    switch (command) {
        case 'version':
            //Read version
            console.log("\r\nReceive Version\r\n")
            //send verack
            Client.write(createCommand.init('verack', config))
            break;
        case 'verack':
            //Read verack
            console.log("\r\nReceive Verack\r\n")
            //send getdata
            Client.write(createCommand.init('getdata', config))
            break;
        case 'block':
            //Read block
            console.log("\r\nReceive Block\r\n")
            //console.log("block: header =>",header," payload => ",payload)
           // parser.blockParser(payload)    
            break;
        case 'reject':
            //Read verack
            console.log('reject')
            break;
        default:
            //read unknow
            console.log("Receive => Command : Pas encore implémentée =>", command/* , "unknow :" , message  */) 
            break;
    }
    return true

}