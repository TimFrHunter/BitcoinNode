
module.exports = { 
    fill : (data, len) => {
        while(data.length < len){
            data += '00'
        }
        return data
    },
    
    dec2hex : (dec) => {
        var hex = dec2hexRecursive(dec)
        if(hex.length % 2 == 1){
            hex = '0' + hex
        }
        return hex
    },

    hex2dec : (hex) => {
        resultat = 0;
        puissance = hex.length - 1 // la puissance maximale
        for(var caracter of hex){ // Parcours chaque caractere de la chaine hexadecimal 
            dec = parseInt(caracter,16) // conversion hex vers décimal
            //Calcul
            resultat = resultat + (dec * Math.pow(16,puissance))
            //Decrementer la puissance
            puissance-- // puissance = puisssance - 1
        }
    
        return resultat
    },

    littleEndian2BigEndian: (hex) => {
        if(hex.length% 2 == 1) // impair du coup on rajoute un 0 en debut
        hex = '0' + hex
        var resultat = '';
        for(var i=hex.length-1; i > 0; i-=2){
            resultat += hex[i-1]+hex[i]
        }
        return resultat
    },

    unfill: (hex) => {
        for(var i = 0; i < hex.length; i++){
          if(hex[i] == '0' && hex[i+1] == '0'){
            hex = hex.substr(0, i)
          }
        }
        return hex
    },

    hex2ascii : (hexx) => {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    },

     /**
     *  The length of the variable integers is uncertain, between 1 and 9 bytes. The detailed rules to parse them are as follows:
     *
     *  If the first byte is less than 253, then directly returns the value represented by the byte
     *  If the first byte is equal to 253 = fd, read the next byte as the return value
     *  If the first byte is equal to 254 = fe, read the next four bytes as the return value
     *  If the first byte is equal to 255 = ff, read the next eight bytes as the return value
     * 
     */
    varInt : function (hex){
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
        this.littleEndian2BigEndian(nb)
        nb = parseInt(nb,16)
        return {'size' : size, 'nb' : nb, 'hex' : hex}
    },
    

}




// private function

function dec2hexRecursive (dec){
    var quotient = ""
    var reste = Math.floor(dec / 16)
    //console.log(dec % 16)
    switch(dec % 16){
        case 10 : quotient = 'A'; break;
        case 11 : quotient = 'B'; break;
        case 12 : quotient = 'C'; break;
        case 13 : quotient = 'D'; break;
        case 14 : quotient = 'E'; break;
        case 15 : quotient = 'F'; break; 
        default : quotient = dec % 16
    }
    if(reste > 0)
        quotient = dec2hexRecursive(reste)  +  quotient//permet d'avoir l'ordre correctement

    return quotient.toString() 
}