angular.module('starter.filters', []).filter("formatPrice", function () {
    return function (price, digits, thoSeperator, decSeperator, bdisplayprice) {
        var i;
        digits = (typeof digits === "undefined") ? 2 : digits;
        bdisplayprice = (typeof bdisplayprice === "undefined") ? true : bdisplayprice;
        thoSeperator = (typeof thoSeperator === "undefined") ? "." : thoSeperator;
        decSeperator = (typeof decSeperator === "undefined") ? "" : decSeperator;
        price = price.toString();
        var _temp = price.split(".");
        var dig = (typeof _temp[1] === "undefined") ? "00" : _temp[1];
        if (bdisplayprice && parseInt(dig, 10) === 0) {
            dig = "";
        } else {
            dig = dig.toString();
            if (dig.length > digits) {
                dig = (Math.round(parseFloat("0." + dig) * Math.pow(10, digits))).toString();
            }
            for (i = dig.length; i < digits; i++) {
                dig += "0";
            }
        }
        var num = _temp[0];
        var s = "",
            ii = 0;
        for (i = num.length - 1; i > -1; i--) {
            s = ((ii++ % 3 === 2) ? ((i > 0) ? thoSeperator : "") : "") + num.substr(i, 1) + s;
        }
        return s + decSeperator + dig;
    }
})
.filter('ageFilter', function() {
     function calculateAge(birthday) { // birthday is a date
		 console.log(birthday)
         var ageDifMs = Date.now() - birthday.getTime();
         var ageDate = new Date(ageDifMs); // miliseconds from epoch
         return Math.abs(ageDate.getUTCFullYear() - 1970);
     }

     return function(birthdate) { 
           return calculateAge(birthdate);
     }; 
});