// 코드에 문제가 있음.
// 무조건 마지막 reqiure가 실행되도록 동작됨
// process.env.NODE_ENV는 현재 undefined 상태이며, Heroku를 연결하면 production 값을 갖게 됨

if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    console.log(process.env.NODE_ENV)
    module.exports = require('./dev');
}