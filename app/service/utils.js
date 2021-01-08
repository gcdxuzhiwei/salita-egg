'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

class UtilsService extends Service {
  encrypt(data) {
    const cipher = crypto.createCipher('aes192', 'xuzhiwei');
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }
  decrypt(encrypted) {
    const decipher = crypto.createDecipher('aes192', 'xuzhiwei');
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      // eslint-disable-next-line no-bitwise
      const r = Math.random() * 16 | 0;
      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

module.exports = UtilsService;
