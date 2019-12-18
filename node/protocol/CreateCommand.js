const Header = require('./Header')
const DynamicClass = require('../factory/DynamicClass')


class CreateCommand {
    init(_command, _config){
       
        const payloadClass = DynamicClass.dynamicClass(this.capitalize(_command))
        let payload = new payloadClass()
        let payloadMessage = payload.init(_config)
        const header = new Header()
        return Buffer.from(header.init(_config, _command, payloadMessage) + payloadMessage , 'hex')
    }

    capitalize(_chaine) {
        return _chaine.charAt(0).toUpperCase() + _chaine.slice(1);
    }
}

module.exports = CreateCommand