const Version = require('../protocol/payloadType/Version')
const Verack = require('../protocol/payloadType/Verack')
const Getdata = require('../protocol/payloadType/Getdata')

const classes = { Version, Verack, Getdata };

module.exports = { 
    dynamicClass : (name) => {
        return classes[name];
    }
}