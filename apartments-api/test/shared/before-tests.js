process.env.LOG_LEVEL = 'error';

// var old = console.log;

// console.log = function (message) {
//   try {
//     old.bind(console)(message);
//     throw new Error('who called me');
//   }
//   catch (ex) {
//     old.bind(console)(ex.stack);
//   }
// };


const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha); // patch mocha
