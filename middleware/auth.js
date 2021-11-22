const jwt = require("jsonwebtoken");
const User = require("../model/user");

const auth = async function (req, res, next) {
  try {
    const token = req.header("Authentication").replace("Bearer ", "");
    console.log("auth: ", token);

    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: verify._id, "tokens.token": token });
    if (!user) throw new Error();

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Failer to authentication💥");
  }
};

module.exports = auth;
