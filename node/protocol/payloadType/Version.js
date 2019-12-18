const conversion = require('../../utils/Conversion')

class Version{

    init(_config){
        return this.protocol(_config.bitcoin.payload.version.protocol) 
        + this.services(_config.bitcoin.payload.version.services)
        + this.timestamp()
        + this.addr(_config.bitcoin.payload.version.services,
             _config.node.host_remote, 
             _config.node.port_remote
        )
        + this.addr(_config.bitcoin.payload.version.services,
            _config.node.host_local, 
            _config.node.port_local
        )
        + this.nonce(_config.bitcoin.payload.version.nonce)
        + this.userAgent(_config.bitcoin.payload.version.user_agent)
        + this.startHeight(_config.bitcoin.payload.version.start_height)
        + this.relay(_config.bitcoin.payload.version.relay)

    
    }

    protocol (_protocol){//decimal
        return conversion.fill(conversion.littleEndian2BigEndian(conversion.dec2hex(_protocol)), 4 * 2)
    }

    services (_nodeType) {
        var nodeType = false
        switch (_nodeType) {
            case 'node_network':
                nodeType = '01'
                break;
            default:
                break;
        }
        return conversion.fill(conversion.littleEndian2BigEndian(nodeType), 8 * 2)
    }

    timestamp () {
        var timestamp = Date.now() 
        return conversion.fill(conversion.littleEndian2BigEndian(conversion.dec2hex(timestamp)), 8 * 2)
    }

    addr ( _nodeType, _ip, _port) {//0.0.0.0 format IP v4 
        var nodeType = this.services(_nodeType)
        var ip = '00000000000000000000FFFF'
        var decIps = _ip.split('.')
        for(var decIp of decIps){
            ip+= conversion.dec2hex(decIp)
        }
        var port = conversion.dec2hex(_port)
        return nodeType + ip + port
    }

    nonce (_nonce) {
        return _nonce // random
    }

    userAgent (_userAgent) {
        return _userAgent //'102F5361746F7368693A302E31382E312F' // '/Satoshi:0.18.1/'
    }

    startHeight (_lastBlockNumber) {// last block number that I have
        return conversion.fill(conversion.littleEndian2BigEndian(conversion.dec2hex(_lastBlockNumber)), 4* 2)
    }

    relay (relay) {
        return relay
    }

}

module.exports = Version