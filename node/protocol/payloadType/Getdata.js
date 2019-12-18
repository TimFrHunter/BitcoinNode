const conversion = require('../../utils/Conversion')

class Getdata{

    init(_config){
        return this.setNBlockHash(_config.bitcoin.payload.getdata.nb_block_hash) 
        + this.setRequestType(_config.bitcoin.payload.getdata.request_type)
        + this.setHash(_config.bitcoin.payload.getdata.hash)
    }

    setNBlockHash(nb) {
        return conversion.dec2hex(nb)
    }
    setRequestType(_type) {
        let type = null;
        switch (_type) {
            case 'block':
                type = "02000000"
            default:
                break;
        }
        return type
    }
    setHash(hash){
        return conversion.littleEndian2BigEndian(hash)
    }
}

module.exports = Getdata