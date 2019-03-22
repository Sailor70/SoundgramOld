var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:sailordb@localhost/soundgram_database', { 
    //'postgres://postgres:sailordb@host:5432/soundgram_database?ssl=true'
    dialect: 'postgres'
    // dialectOptions:{
    //     ssl: {
    //         require: true
    //     }
    // }
});

module.exports = sequelize;