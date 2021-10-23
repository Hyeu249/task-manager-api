const express = require("express");
const router = express.Router();
const Task = require("../model/task");
const auth = require("../middleware/auth");

//RESTfull API endPoint

//Create task
router.post("/task", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    await task.save();

    res.send(task);
  } catch (err) {
    res.status(401).send(err);
  }
});

//Read task
router.get("/task", auth, async (req, res) => {
  try {
    await req.user.populate("tasks");

    res.send(req.user.tasks);
  } catch (err) {
    res.status(401).send(err);
  }
});

//Update user
router.patch("/task/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["description", "completed"];

  const verify = updates.every((update) => allowUpdates.includes(update));
  if (!verify) return res.status(400).send({ error: "invalid keys" });

  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
  updates.forEach((update) => (task[update] = req.body[update]));
  if (!task) return res.status(400).send("Invalid ID...try another one💥");

  await task.save();

  res.send(task);
});

module.exports = router;
