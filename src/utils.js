export const allowedKeys = [8,9,16,38,40];
export const regexOnlyAlphabets = /^([a-zA-Z _-]+)$/;
export const regexOnlyNumber = /^([0-9]+)$/;

export const clearString = val => {return val.replace(/\s+/g, '')};

export const isEmpty = val => clearString(val).length === 0 ;

export function getCardType(number)
{
    // visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
        return "Visa";

    // Mastercard 
    // Updated for Mastercard 2017 BINs expansion
     if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)) 
        return "Mastercard";

    return "Unknown card";
}