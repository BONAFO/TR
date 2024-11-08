const utils = require("util");
const {mkdir ,readdir , stat, copyFile , writeFile, unlink, rmdir , readFile} = require("fs");

const promisify =(mod)=> utils.promisify(mod)
module.exports ={
    mkdir_pro : promisify(mkdir),
    readdir_pro :  promisify(readdir),
    stat_pro :  promisify(stat),
    copyFile_pro :  promisify(copyFile),
    writeFile_pro : promisify(writeFile),
    unlink_pro : promisify(unlink),
    rmdir_pro : promisify(rmdir),
    readFile_pro : promisify(readFile),
};