const express = require("express");
const app = express();
const connectDatabase = require("./database");
const User = require("./models/DetailSchema");
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.get("/", async (req, res, next) => {
  try {
    let result = await User.find();
    res.json({
      result,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/post", async (req, res, next) => {
  try {
    let result = await User.create(req.body);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (err) {
    next(err);
  }
});
app.get("/d", async (req, res) => {
  let result = await User.deleteMany();
  res.json({
    result,
  });
});

const errorMiddleware = (err, req, res, next) => {
  console.log(err, "error");
  message = err.message;

  res.json({
    success: false,
    message: message,
  });
};
connectDatabase();
const PORT = 8000;

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
