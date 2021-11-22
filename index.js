const { ObjectID } = require("bson");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;
require("./db/mongoose");
const taskRouter = require("./router/task");
const userRouter = require("./router/user");

//use CORS
app.use(cors());

//parse imcoming JSON
app.use(express.json());

//Use router
app.use(taskRouter);
app.use(userRouter);

app.use("", (req, res) => {
  res.status(200).send("auth.status(405)💎");
});

//Start up server
app.listen(port, () => console.log(`http://localhost:${port}`));
