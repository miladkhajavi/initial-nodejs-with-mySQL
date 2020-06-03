var Sequelize = require("sequelize");
const db = {}

const sequelize = new Sequelize("node_js_test", 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})


db.sequelize = sequelize
db.Sequelize = Sequelize


sequelize
.authenticate()
.then(function (err) {
    console.log('Connection has been established successfully.');
})
.catch(function (err) {
    console.log('Unable to connect to the database:', err);
});

 

module.exports = db