/**
 * Created by dimenthy on 2017/8/14.
 */
// db.js

// var Sequelize = require('sequelize');

/*
 // new Sequelize(database, [username=null], [password=null], [options={}])
 // class Sequelize 接收 4 个参数，后三个参数是可选的

 // 没有密码和 options
 var sequelize = new Sequelize('database', 'username')

 // 没有 options
 var sequelize = new Sequelize('database', 'username', 'password')

 // 没有密码有 options
 var sequelize = new Sequelize('database', 'username', null, {})

 // 都有
 var sequelize = new Sequelize('my_database', 'john', 'doe', {})

 // new Sequelize(uri, [options={}])
 // 通过 uri 连接数据库
 var sequelize = new Sequelize('mysql://localhost:3306/database', {})
 */

// module.exports = new Sequelize('ayiot', 'root', '', {
//     host: 'localhost', // 数据库地址
//     dialect: 'mysql', // 指定连接的数据库类型
//     pool: {
//         max: 5, // 连接池中最大连接数量
//         min: 0, // 连接池中最小连接数量
//         idle: 10000 // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
//     }
// });