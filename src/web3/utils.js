/*
 This file is part of web3.js.

 web3.js is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 web3.js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @file utils.js
 * @author Marek Kotewicz <marek@parity.io>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */


import utils from '../utils';
import BigNumber from "bignumber.js";

var isAddress = function (address) {
    // check if it has the basic requirements of an address
    if (!/^(0x|41)?[0-9a-f]{40}$/i.test(address)) {
        return false;
        // If it's ALL lowercase or ALL upppercase
    } else if (/^(0x|0X|41)?[0-9a-f]{40}$/.test(address) || /^(0x|0X|41)?[0-9A-F]{40}$/.test(address)) {
        return true;
        // Otherwise check each case
    } else {
        return checkAddressChecksum(address)
    }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method checkAddressChecksum
 * @param {String} address the given HEX address
 * @return {Boolean}
 */
var checkAddressChecksum = function (address) {
    // Check each case
    address = address.replace(/^0x/i,'');
    if (address.length === 42) {
        address = address.replace(/^41/,'')
    }
    var addressHash = utils.sha3(address.toLowerCase()).replace(/^0x/i,'');

    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};

/**
 * Should be used to create full function/event name from json abi
 *
 * @method _jsonInterfaceMethodToString
 * @param {Object} json
 * @return {String} full function/event name
 */
var _jsonInterfaceMethodToString = function (json) {
    if (utils.isObject(json) && json.name && json.name.indexOf('(') !== -1) {
        return json.name;
    }

    var typeName = json.inputs.map(function(i){return i.type; }).join(',');
    return json.name + '(' + typeName + ')';
};

/**
 * Takes and input transforms it into BN and if it is negative value, into two's complement
 *
 * @method toTwosComplement
 * @param {Number|String|BN} number
 * @return {String}
 */
var toTwosComplement = function (number) {
    return '0x'+ toBigNumber(number).toTwos(256).toString(16, 64);
};


var isHexStrict = function (hex) {
    return ((utils.isString(hex) || utils.isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex));
};


/**
 * Should be called to pad string to expected length
 *
 * @method rightPad
 * @param {String} string to be padded
 * @param {Number} chars that result string should have
 * @param {String} sign, by default 0
 * @returns {String} right aligned string
 */
var rightPad = function (string, chars, sign) {
    var hasPrefix = /^0x/i.test(string) || typeof string === 'number';
    string = string.toString(16).replace(/^0x/i,'');

    var padding = (chars - string.length + 1 >= 0) ? chars - string.length + 1 : 0;

    return (hasPrefix ? '0x' : '') + string + (new Array(padding).join(sign ? sign : "0"));
};

function fromUtf8 (string) {
    return '0x' + Buffer.from(string, 'utf8').toString('hex');
}

function toUtf8(hex) {
    hex = hex.replace(/^0x/,'');
    return Buffer.from(hex, 'hex').toString('utf8');
}

function toBigNumber(amount = 0) {
    if(utils.isBigNumber(amount))
        return amount;

    if(utils.isString(amount) && (amount.indexOf('0x') === 0 || amount.indexOf('-0x') === 0))
        return new BigNumber(amount.replace('0x', ''), 16);

    return new BigNumber(amount.toString(10), 10);
}

export default {
    _jsonInterfaceMethodToString,
    isAddress,
    isNumber: utils.isNumber,
    isObject: utils.isObject,
    sha3: utils.sha3,
    isString: utils.isString,
    isArray: utils.isArray,
    isBigNumber: utils.isBigNumber,
    toTwosComplement,
    isHexStrict,
    rightPad,
    padRight: rightPad,
    utf8ToHex: fromUtf8,
    hexToUtf8: toUtf8
}

