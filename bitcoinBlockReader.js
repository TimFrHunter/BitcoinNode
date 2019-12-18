var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

readTextFile('https://blockchain.info/block/00000000000000000011b3ad40dfd8ec8fe56075968714f4fffcc9c4c3837774?format=hex')


function parser(hex) {
    hex = conversionHexLittleIndianToHex(hex)
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
    var res = varInt(hex)
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
            console.log("Field !!OPTIONAL!! : Flag SegWit    || Size : 2B || Value :",conversionHexLittleIndianToHex(hex.substr(hex.length-4, hex.length)))
            hex = hex.substr(0,hex.length-4)
        }
        res = varInt(hex)
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
            res = varInt(hex)
            console.log("           Field : Script length        || Size : 1 à 9 B ici :",res.size,"B || Value :",res.nb)
            hex = res.hex
            console.log("           Field : Script               || Size : ",res.nb, "B             || Value :", conversionHexLittleIndianToHex(hex.substr(hex.length - (res.nb * 2), hex.length)))
            hex = hex.substr(0,hex.length - (res.nb * 2))
            console.log("           Field : Sequence             || Size : 4B                || Value :",hex.substr(hex.length-8,hex.length))
            hex = hex.substr(0,hex.length-8)
            console.log("------------------------------------ Tx : INPUT END ------------------------------------")
            console.log("");
            nbInputs--   
        }
        
        res = varInt(hex)
        hex = res.hex 
        console.log("Field : Number Of Output       || Size : 1 à 9 B ici :",res.size,"B || Value :",res.nb)
        var nbOutputs = res.nb
        while(nbOutputs > 0){ // tant qu'on a des outputs
            console.log(" ")
            console.log("------------------------------------ Tx : OUTPUT START ------------------------------------")
            console.log("           Field : Value                || Size : 8B                || Value :", hex.substr(hex.length-16,hex.length))
            hex = hex.substr(0, hex.length-16)
            res = varInt(hex)
            console.log("           Field : Script length        || Size : 1 à 9 B ici :",res.size,"B || Value :",res.nb)
            hex = res.hex
            console.log("           Field : Script               || Size : ",res.nb, "B             || Value :", conversionHexLittleIndianToHex(hex.substr(hex.length - (res.nb * 2), hex.length)))
            hex = hex.substr(0, hex.length - res.nb * 2)
            console.log("------------------------------------ Tx : OUTPUT END ------------------------------------")
            console.log(" ")
            nbOutputs--
        }
        if(segWit){
            while(nbInputsWitness > 0){//pour chaque input on recup le witness
                console.log(" ")
                console.log("--------------- SEGWIT START",nbInputsWitness, "-------------------")
                res = varInt(hex)
                var nbSegWit = res.nb
                hex = res.hex
                if(i==10){
                    console.log(hex.substr(hex.length-20,hex.length))
                }
            
                console.log("Field : Number of SegWit     || Size : 1 à 9 B || Value :",nbSegWit)
                while(nbSegWit > 0){
                    console.log("------------------ SegWit START ------------------")
                    res = varInt(hex)
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

/**
 *  The length of the variable integers is uncertain, between 1 and 9 bytes. The detailed rules to parse them are as follows:
 *
 *  If the first byte is less than 253, then directly returns the value represented by the byte
 *  If the first byte is equal to 253 = fd, read the next byte as the return value
 *  If the first byte is equal to 254 = fe, read the next four bytes as the return value
 *  If the first byte is equal to 255 = ff, read the next eight bytes as the return value
 * 
 */
function varInt(hex){
    var size = 1 // en octet
    var nb = 0
    switch (hex.substr(hex.length - 2, hex.length)) {
        case 'fd': 
            size = 2
            nb = hex.substr(hex.length - 4, hex.length -2)
            hex = hex.substr(0, hex.length -4)
            break;
        case 'fe': 
            size = 5
            nb = hex.substr(hex.length - 10, hex.length -2 )
            hex = hex.substr(0, hex.length -10)
            break;
        case 'ff': 
            size = 9    
            nb = hex.substr(hex.length - 18, hex.length -2)
            hex = hex.substr(0, hex.length -18)
            break;
        default:
            size = 1
            nb = hex.substr(hex.length -2, hex.length)
            hex = hex.substr(0, hex.length -2)
            break;
    }
    conversionHexLittleIndianToHex(nb)
    nb = parseInt(nb,16)
    return {'size' : size, 'nb' : nb, 'hex' : hex}
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                console.log(file);
                
                parser(allText)
            }
        }
    }
    rawFile.send(null);
}

function conversionHexLittleIndianToHex(lilHex){//Faut juste inverser l'ordre tout les 2 carac 
    if(lilHex.length% 2 == 1) // impair du copu on rajoute un 0 en debut
    lilHex = '0' + lilHex
    var resultat = '';
    for(var i=lilHex.length-1; i > 0; i-=2){
        resultat += lilHex[i-1]+lilHex[i]
    }
    return resultat
}