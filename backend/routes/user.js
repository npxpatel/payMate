const express = require("express");
const app = express();
const { Router } = require("express");
const router = Router();
const { signupBody, signinBody, updateBody } = require("../types");
const { User, Account } = require("../db/index");
const jwt = require("jsonwebtoken");
const { zod } = require("zod");
const jwtKey = require("../config");

const { userMiddleware } = require("../middleware/user");

app.use(express.json());

router.post("/signup", async (req, res) => {
//   const { success } = signupBody.safeParse(req.body);
//   console.log(success);
//   if (!success) {
//    return res.status(411).json({
//       msg: "Wrong inputs baby",
//     });
//   }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  //username taken as their email..
  if (existingUser) {
   return res.status(411).json({
      msg: "username already taken",
    });
   
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstName,
    lastname: req.body.lastName,
  });

  //initializing with some Money bro

  const user_id = user._id;

  await Account.create({
    userId: user_id,
    balance: 1 + Math.random() * 1000,
  });

  const token = jwt.sign(
    {
      user_id,
    },
    jwtKey
  );

 return res.json({
    msg: "User created successfully",
    token,
    urlId : user_id
  });
});

router.get("/signin", async (req, res) => {
//   const { success } = signinBody.safeParse(req.body);
//   if (!success) {
//     res.status(411).json({
//       msg: "Wrong inputs baby",
//     });
//   }

  const existingUser = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (!existingUser) {
    res.status(411).json({
      msg: "Error while logging in",
    });
    return;
  }

  // const user_id=existingUser._id;

  const token = jwt.sign(
    {
      user_id: existingUser._id,
    },
    jwtKey
  );

  res.status(200).json({
    msg: "Successful",
    token,
  });

  return;
});

router.put("/", userMiddleware, async (req, res) => {
//   const { success } = updateBody.safeParse(req.body);
//   if (!success) {
//     res.status(411).json({
//       msg: "Error while updating the information",
//     });
//   }

  const { firstName, lastName } = req.body;
  const result = await User.updateOne(
    {
      _id: req.user_id,
    },
    {
      $set: {
        firstname: firstName,
        lastname: lastName,
      },
    }
  );

  if (result) {
    res.status(200).json({
      msg: "Updated the info",
      firstname: req.user_id.firstname,
    });
    return;
  }

  res.status(404).json({
    msg: "Try after some time..",
  });
});

router.get("/users",async(req,res)=>{
    const users=await User.find({});

    res.json({
        users:users.map(user=>({
            username:user.username,
            firstname:user.firstname,
            lastname:user.lastname,
            _id:user._id
        }))
    })
})

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  // http://example.com/bulk?filter=John
  //http://localhost:3000/api/v1/user/bulk?filter=Niraj

  const users = await User.find({
    $or: [
      {
        firstname: {
          $regex: filter,
        },
      },
      {
        lastname: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      _id: user._id,
      //not the password... :)
    })),
  });
});


router.get("/:id", async (req, res) => {
   const user = await Account.findOne({
    userId: req.params.id,
   })
    
  if (!user) {
    res.status(404).json({
      msg: "User not found",
    });
    return;
  }
  
  return res.json({ user });
});


module.exports = router;
