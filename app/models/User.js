const Sequelize = require('sequelize')
const db = require('../../config/db')
const bcrypt = require('bcryptjs')
const UserSchema = db.sequelize.define('User', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        mobile: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        userName: {
            type: Sequelize.STRING
        },
    }
    , {
        instanceMethods: {
            validPassword: function (password) {
              console.log(password, this.password)
              return bcrypt.compareSync(password, this.password);
            }
          }    
    }
)

UserSchema.sync()
  .then(() => console.log("‘Oh yeah! User table created successfully’"))
  .catch(err => console.log("‘BTW, did you enter wrong database credentials?’"));

UserSchema.beforeCreate((user, options) => {

    return bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
        })
        .catch(err => {
            throw new Error();
        });
});


module.exports = UserSchema