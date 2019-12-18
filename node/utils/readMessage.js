
module.exports = {
    getHeader : (data) => {
        let header = []
        let headerLen = Object.keys(headerMapping).length 
        for(let i = 0; i < headerLen-1; i++){
            let start = Object.values(headerMapping)[i] * 2
            let end = Object.values(headerMapping)[i+1] * 2 - start
            header.push(data.substr(start, end))
        }
        return  header
    },

    getPayload : (data, payloadLength) => {
       
            return data.substr(0, payloadLength)
        
    }

}

var headerMapping = {
    magic : 0,
    command :  4,
    length : 16,
    checksum : 20,
    payload : 24
}