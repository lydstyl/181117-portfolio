const fs = require('fs')
const path = require('path')

console.log('tester ici !');
console.log('1', __filename);
console.log('2', __dirname);


let t1 = fs.unlinkSync( path.join(__dirname , 'data' , 'id' + '.json') );
console.log(t1);
