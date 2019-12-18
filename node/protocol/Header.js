const conversion = require('../utils/Conversion')
const crypto = require('crypto')

class Header{

    init(_config, _command, _payload){
        return this.version(_config.bitcoin.header.network) 
        + this.command(_command) 
        + this.payloadLength(_payload)
        + this.payloadChecksum(_payload)
    }

    version (_version) {
        let version = false
        switch (_version) {
            case 'main':
                version = 'D9B4BEF9'
                break;
            case 'testnet':
                version = 'DAB5BFFA'
                break;
        /*  case 'testnet3':
                version = "0709110B"
                break;
            case 'namecoin':
                version = "FEB4BEF9"
                break; */
            default:
                break;
        }
        return conversion.littleEndian2BigEndian(version)
    }

    command (_command){
        let command = false 
        switch (_command) {
            case 'version':
                command = '6E6F6973726576'
                break;
            case 'verack':
                command = '6B6361726576'
                break;
            case 'getdata':
                command = '61746164746567'
                break;
            case 'reject':
                command = '7463656A6572'
                break;
            case 'block':
                command = '6B636F6C62'
                break;
            default:
                break;
        }
        return conversion.fill(conversion.littleEndian2BigEndian(command), 12 * 2)
    }

    payloadLength (_payload) {
        let payload = conversion.littleEndian2BigEndian(conversion.dec2hex(_payload.length / 2))
        return conversion.fill(payload, 4 * 2)
        
    }

    payloadChecksum (_payload) {
        let buffer = Buffer.from(_payload,'hex')
        buffer = crypto.createHash('sha256').update(buffer).digest()
        buffer = crypto.createHash('sha256').update(buffer).digest()
        return buffer.toString('hex').substr(0, 4 * 2)
    }

}

module.exports = Header