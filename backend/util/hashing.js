const {hash, compare} = require('bcryptjs');
const {createHmac} = require('crypto')
const dohash = (value, saltValue) =>{
    const result = hash(value, saltValue);
    return result;
}
const dohashvalidation =(value, hashedvalue) =>{
    const result = compare(value,hashedvalue);
    return result;
}
const hmacprocess = (value, key) =>{
   const result = createHmac('sha256', key).update(value).digest('hex');
   return result;
}
module.exports = {dohash , dohashvalidation, hmacprocess}