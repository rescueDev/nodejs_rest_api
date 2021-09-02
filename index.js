//Express import and instance
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const csrf = require("csurf");
require("dotenv").config();

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.phggk.mongodb.net/restApi?retryWrites=true&w=majority`;

require("dotenv");

const app = express();
const csrfProtect = csrf();

//Routes
const userRoutes = require("./routes/user");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
  res.send("Heello this is Index, please use Postman to test this REST_API !!");
});

app.use(userRoutes);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("connected");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
