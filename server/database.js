const mongoose = require("mongoose");
// const dbURI = "mongodb+srv://himanshu15:himanshu15@cluster0.4cour.mongodb.net/joasg?retryWrites=true&w=majority";
const dbURI = "mongodb+srv://Kanhaiya:Kanhaiya@cluster0.ox2esaw.mongodb.net/?retryWrites=true&w=majority"

// mongoose.connect(dbURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => {
//   console.log("Connected to MongoDB");

// });

async function connectDatabase() {
  let result = await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  if (result) {
    console.log("connected");
  } else {
    console.log("not connected");
  }
}

// function connectDatabase() {
//   mongoose
//     .connect(dbURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() =>
//       console.log(
//         "==============Mongodb Database Connected Successfully=============="
//       )
//     )
//     .catch((err) => console.log(err, "Database Not Connected !!!"));
// }
module.exports = connectDatabase;
