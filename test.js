const path = require('path');

let strPath = "e:\study\Applet\test\dist\pages\index\index.scss";
let str = "a-b-b-b"
str = str.replace(/(-)/g, "_");
console.log(str)

const dirname = path.dirname(path.normalize(strPath));

console.log(dirname)