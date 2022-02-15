/**
 * 封装log函数
 */

 const chalk = require('chalk');

 /**
  * 
  * @param {string} text 文本
  * @param {string} color 字体颜色
  */
 function log(text, color) {
    if (color) {
        return console.log(chalk[color](text))
    } 

    console.log(text)
 }

 module.exports = {
     log
 }

