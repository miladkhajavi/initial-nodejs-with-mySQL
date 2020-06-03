var passport = require("passport");
var config = require("../../config");
require("../passport/passport")(passport);
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs')

// const Cart = require("../models/cart");

// register
router.post("/register", async (req, res) => {
  try {
    if (!req.body.mobile || !req.body.password) {
      res.json({
        success: false,
        msg: "لطفا موبایل یا پسورد را وارد کنید",
      });
    } else {
      let duplicateMobile = await User.findOne({
        where: {
          mobile: req.body.mobile
        }
      });
      if (duplicateMobile) {
        return res.json({
          success: false,
          msg: "با این شماره موبایل قبلا ثبت نام شده است",
        });
      }
      let duplicate = await User.findOne({
        where: {
          userName: req.body.userName,
        }
      });
      if (duplicate) {
        return res.json({
          success: false,
          msg: "نام کاربری موجود است",
        });
      }
      User.create({
        mobile: req.body.mobile,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName
      }).then(data => {
        res.json({
          success: true,
          data,
          msg: "شما با موفقیت ثبت نام کردید",
        });
      })
      // .save();
      // save the user
      // let Exist = await User.findOne({
      //   userName: req.body.userName
      // });
      // if (Exist) {
      //   await new Cart({
      //     user: Exist._id,
      //     order: []
      //   }).save();
      // }

    }
  } catch (error) {
    res.status(500).send({
      error: `An error has occured ${error}`,
    });
  }
});
// login
router.post("/logins", async (req, res) => {

  User.findOne({
      where: {
        userName: req.body.userName,
      }
    }, {
      __v: 0,
    },
    (err, user) => {
      if (err) {
        return res.status(500).send({
          success: false,
          msg: "server not response",
        });
      }
      if (!user) {
        res.status(401).send({
          success: false,
          msg: " نام کاربری یا پسورد اشتباه است.",
        });
      } else {
        // if (!user.block) {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            const token = jwt.sign(user.toJSON(), config.secret, {
              expiresIn: config.expireToken,
            });
            res.json({
              success: true,
              token: `Bearer ${token}`,
              user,
              msg: "شما با موفقیت وارد شدید.",
            });
          } else {
            return res.status(406).json({
              success: false,
              msg: " نام کاربری یا پسورد اشتباه است.",
            });
          }
        });
      }
      // else if (user.block) {
      //   res.status(403).send({
      //     success: false,
      //     msg: "جهت بررسی حساب کاربری خود با پشتیبانی تماس بگیرید",
      //   });
      // }
    }
  );
});

router.post('/login', async (req, res, next) => {
  const {
    userName,
    password
  } = req.body;
  if (userName && password) {
    // we get the user with the userName and save the resolved promise
    // returned
    let user = await User.findOne({
          where: {
            userName: req.body.userName,
          }
        })


    if (!user) {
      res.status(401).json({
        msg: "No such user found",
        user
      });
    }
    var passwordIsValid = bcrypt.compareSync(password,user.password)
    if (passwordIsValid) {
      // from now on we’ll identify the user by the id and the id is// the only personalized value that goes into our token
      
      // user.comparePassword(password, function (err, isMatch) {
      //   if (isMatch && !err) {
      //     let payload = {
      //         id: user.id
      //       };            
      //       const token = jwt.sign(payload, config.secret, {
      //         expiresIn: config.expireToken,
      //       });
      //       res.json({
      //         msg: "ok",
      //         token: `Bearer ${token}`
      //       });
      
      //   } else {
      //     res.status(401).json({
      //       msg: "Password is incorrect"
      //     });
      //   }
      // });
    
      
      let payload = {
        id: user.id
      };
      
      const token = jwt.sign(payload, config.secret, {
        expiresIn: config.expireToken,
      });
      res.json({
        msg: "ok",
        token: `Bearer ${token}`,
        user,
      });


      
    } else {
      res.status(401).json({
        msg: "خطا در ورود"
      });
    }
  }
})
// router.post('/login', async (req, res) => {
//   await User.findOne({
//     where: {
//       userName: req.body.userName,
//     }
//   }).then(data => {
//     return data.toJSON()
//   }).then(user => {

//     user.comparePassword(req.body.password, function (err, isMatch) {
//       if (isMatch && !err) {
//         const token = jwt.sign(user.toJSON(), config.secret, {
//           expiresIn: config.expireToken,
//         });
//         res.json({
//           success: true,
//           token: `Bearer ${token}`,
//           user,
//           msg: "شما با موفقیت وارد شدید.",
//         });
//       } else {
//         return res.status(406).json({
//           success: false,
//           msg: " نام کاربری یا پسورد اشتباه است.",
//         });
//       }
//     });


//   })

// })

// //authorization
// router.use(
//   passport.authenticate("jwt", {
//     session: false,
//   })
// );

// router.get("/logout", async (req, res) => {
//   try {
//     res.json({
//       success: true,
//       msg: "Logout successfull.",
//     });
//   } catch (error) {
//     res.status(400).json({
//       Error: `Something went wrong. ${error}`,
//     });
//   }
// });

// router.get("/profile", async (req, res) => {
//   try {
//     let item = await User.findOne({
//       _id: req.user._id,
//     });
//     res.json({
//       success: true,
//       item,
//       msg: "user",
//     });
//   } catch (error) {
//     res.status(400).json({
//       Error: `Something went wrong. ${error}`,
//     });
//   }
// });
module.exports = router;