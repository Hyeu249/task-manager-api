const express = require("express");
const multer = require("multer");
const router = express.Router();
const User = require("../model/user");
const auth = require("../middleware/auth");

//RESTfull API endPoint

//Login user
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findMyCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (err) {
    res.status(400).send("Enable login...Try another account💥");
  }
});

//LogOut user
router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Logout All user
router.post("/user/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Create user
router.post("/users", async (req, res) => {
  try {
    const user = await User(req.body);

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Read user
router.get("/user/me", auth, async (req, res) => {
  res.send(req.user);
});

//Update user

router.patch("/user/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email", "password", "_avatar"];
  const verify = updates.every((update) => allowUpdates.includes(update));
  if (!verify) return res.status(400).send({ error: "invalid keys" });

  const user = await User.findById(req.params.id);
  updates.forEach((update) => (user[update] = req.body[update]));
  if (!user) return res.status(400).send("Invalid ID...try another one💥");

  await user.save();

  res.send(user);
});

//Delete user
router.delete("/user", auth, async (req, res) => {
  const user = await User.findOne(req.body);
  await user.remove();

  res.send(user);
});

//Upload avatar picture

//multer
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png)$/)) {
      return cb(new Error("please provide JPG or PNG file"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/user/me/avatar",
  auth,
  upload.single("upload"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;

    await req.user.save();

    res.send();
  },
  async (err, req, res, next) => {
    console.log(err);
    res.send(err.message);
  }
);

//load avatar by id
router.get("/user/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
