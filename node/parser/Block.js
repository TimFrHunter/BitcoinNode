const conversion = require('../utils/Conversion')

module.exports = {

    blockParser : function (hex) {
        hex = conversion.littleEndian2BigEndian(hex)
        console.log("------------------ Block : HEADER START ------------------")
        console.log("Field : Version             || Size : 4B                || Value :",hex.substr(hex.length-8,hex.length)) 
        hex = hex.substr(0, hex.length-8)
        console.log("Field : Previous Block Hash || Size : 32B               || Value :",hex.substr(hex.length-64,hex.length)) 
        hex = hex.substr(0, hex.length-64)
        console.log("Field : Merkle Root         || Size : 32B               || Value :", hex.substr(hex.length-64,hex.length))
        hex = hex.substr(0, hex.length-64)
        console.log("Field : Time                || Size : 4B                || Value :", hex.substr(hex.length-8,hex.length))
        hex = hex.substr(0, hex.length-8)
        console.log("Field : Bits                || Size : 4B                || Value :", hex.substr(hex.length-8,hex.length))
        hex = hex.substr(0, hex.length-8)
        console.log("Field : Nonce               || Size : 4B                || Value :", hex.substr(hex.length-8,hex.length))
        hex = hex.substr(0, hex.length-8)
        console.log("------------------ Block : HEADER END ------------------")
        console.log("")
        var res = conversion.varInt(hex)
        console.log("Field : Number Of Tx        || Size : 1 à 9 B ici :",res.size,"B || Value :",res.nb)
        hex = res.hex
        console.log("")
        var nbTxs = res.nb
        var i=0
        while(nbTxs > 0){// si on a des tx
            console.log("------------------ Block : TX START ------------------")
            console.log("Field : Version                || Size : 4B                || Value :",hex.substr(hex.length-8,hex.length)) 
            hex = hex.substr(0, hex.length-8)
            var segWit = hex.substr(hex.length-4, hex.length) == '0100' 
            if(segWit){
                console.log("Field !!OPTIONAL!! : Flag SegWit    || Size : 2B || Value :",conversion.littleEndian2BigEndian(hex.substr(hex.length-4, hex.length)))
                hex = hex.substr(0,hex.length-4)
            }
            res = conversion.varInt(hex)
            console.log("Field : Number Of Input        || Size : 1 à 9 B ici :",res.size,"B || Value :",res.nb)
            hex = res.hex 
            var nbInputs = res.nb 
            if(segWit){
                var nbInputsWitness = nbInputs
            }

        
            while(nbInputs > 0){ //tant qu'on a des inputs
                console.log(" ")
                console.log("------------------------------------ Tx : INPUT START ------------------------------------")
                console.log("           Field : Previous Tx Hash     || Size : 32B               || Value :",hex.substr(hex.length-64,hex.length))
                hex = hex.substr(0, hex.length-64)
                console.log("           Field : Previous Tx Index    || Size : 4B                || Value :",hex.substr(hex.length-8,hex.length))
                hex = hex.substr(0, hex.length-8)
                res = conversion.varInt(hex)
                console.log("           Field : Script length        || Size : 1 à 9 B ici :",res.size,"B || Value :",res.nb)
                hex = res.hex
                console.log("           Field : Script               || Size : ",res.nb, "B             || Value :", conversion.littleEndian2BigEndian(hex.substr(hex.length - (res.nb * 2), hex.length)))
                hex = hex.substr(0,hex.length - (res.nb * 2))
                console.log("           Field : Sequence             || Size : 4B                || Value :",hex.substr(hex.length-8,hex.length))
                hex = hex.substr(0,hex.length-8)
                console.log("------------------------------------ Tx : INPUT END ------------------------------------")
                console.log("");
                nbInputs--   
            }
            
            res = conversion.varInt(hex)
            hex = res.hex 
            console.log("Field : Number Of Output       || Size : 1 à 9 B ici :",res.size,"B || Value :",res.nb)
            var nbOutputs = res.nb
            while(nbOutputs > 0){ // tant qu'on a des outputs
                console.log(" ")
                console.log("------------------------------------ Tx : OUTPUT START ------------------------------------")
                console.log("           Field : Value                || Size : 8B                || Value :", hex.substr(hex.length-16,hex.length))
                hex = hex.substr(0, hex.length-16)
                res = conversion.varInt(hex)
                console.log("           Field : Script length        || Size : 1 à 9 B ici :",res.size,"B || Value :",res.nb)
                hex = res.hex
                console.log("           Field : Script               || Size : ",res.nb, "B             || Value :", conversion.littleEndian2BigEndian(hex.substr(hex.length - (res.nb * 2), hex.length)))
                hex = hex.substr(0, hex.length - res.nb * 2)
                console.log("------------------------------------ Tx : OUTPUT END ------------------------------------")
                console.log(" ")
                nbOutputs--
            }
            if(segWit){
                while(nbInputsWitness > 0){//pour chaque input on recup le witness
                    console.log(" ")
                    console.log("--------------- SEGWIT START",nbInputsWitness, "-------------------")
                    res = conversion.varInt(hex)
                    var nbSegWit = res.nb
                    hex = res.hex
                    if(i==10){
                        console.log(hex.substr(hex.length-20,hex.length))
                    }
                
                    console.log("Field : Number of SegWit     || Size : 1 à 9 B || Value :",nbSegWit)
                    while(nbSegWit > 0){
                        console.log("------------------ SegWit START ------------------")
                        res = conversion.varInt(hex)
                        hex = res.hex
                        console.log("Filed :  SegWit    || Size :",res.nb,"B    || Value :",hex.substr(hex.length - (res.nb *2), hex.length))
                        hex = hex.substr(0, hex.length - (res.nb * 2))
                        console.log("------------------ SegWit END ------------------")
                        nbSegWit--
                    }
                    console.log("--------------- SEGWIT END ",nbInputsWitness, "-------------------")
                    console.log(" ")
                    nbInputsWitness--
                }

            }

            console.log("Field : LockTime               || Size : 4B    || Value :", hex.substr(hex.length-8,hex.length))
            hex = hex.substr(0, hex.length-8)
            console.log("------------------ Block : TX END ------------------")
            console.log("");
            nbTxs--
        
            
        i++    
        }
        
    }

}