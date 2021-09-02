const faker = require("faker");
const User = require("../models/user");
const Car = require("../models/car");
const mongoose = require("mongoose");

// Read All
exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      //Set header to retrive json
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ users }));
    })
    .catch((err) => console.log(err));
};
exports.generateUsers = (req, res, next) => {
  //check if any user already generated
  User.find()
    .then((users) => {
      console.log(users);
      return users;
    })
    .then((users) => {
      //check if users array is not empty
      if (users.length > 0) {
        console.log("users already generated", users);
        return;
      } else {
        console.log("generating users");

        //Faker generate user
        for (let index = 0; index < 10; index++) {
          let car = new Car({
            _id: new mongoose.Types.ObjectId(),
            brand: faker.vehicle.manufacturer(),
            model: faker.vehicle.model(),
            year: Math.floor(Math.random() * 2021) + 1992,
            specs: {
              power: Math.floor(Math.random() * 180) + 70,
              fuel: faker.vehicle.fuel(),
            },
          });

          car.save((err, data) => {
            if (err) {
              console.log(err);
            }
          });

          let user_item = new User({
            name: faker.name.firstName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            gender: faker.name.gender(),
            age: Math.floor(Math.random() * 90) + 1,
            address: {
              street: faker.address.streetName(),
              city: faker.address.city(),
              country: faker.address.country(),
            },
            car: car,
          });

          //save users
          user_item.save((err, data) => {
            if (err) {
              console.log(err);
            }
          });
        }
      }
    })
    .catch((err) => console.log(err));

  res.redirect("/");
};

//Single read
exports.findUser = (req, res, next) => {
  var userName = req.params.userName;

  User.find({ username: userName })
    .populate({ path: "car", model: "Car" })
    .exec()
    .then((user) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ user }));
    });
};

//Create
exports.addUser = (req, res, next) => {
  //Set header JSON
  res.setHeader("Content-Type", "application/json");
  res.json({ requestBody: req.body });

  //Request body values
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const gender = req.body.gender;
  const age = req.body.age;
  const street = req.body.address.street;
  const city = req.body.address.city;
  const country = req.body.address.country;
  const carBrand = req.body.car.brand;
  const carModel = req.body.car.model;
  const carYear = req.body.car.year;
  const carPower = req.body.car.specs.power;
  const carFuel = req.body.car.specs.fuel;

  //create new car obj
  const car = new Car({
    brand: carBrand,
    model: carModel,
    year: carYear,
    specs: {
      power: carPower,
      fuel: carFuel,
    },
  });

  //save car in collection
  car
    .save()
    .then((res) => console.log("car added", res))
    .catch((err) => console.log(err));

  //create new user obj
  const user = new User({
    name: name,
    username: username,
    email: email,
    gender: gender,
    age: age,
    address: {
      street: street,
      city: city,
      country: country,
    },
    car: car,
  });

  //save user in collection
  user
    .save()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
};

//------ UPDATE --------//

exports.updateUser = (req, res, next) => {
  //Set header to json data input
  res.setHeader("Content-Type", "application/json");
  res.json({ requestBody: req.body });

  // Request body values user
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const gender = req.body.gender;
  const age = req.body.age;
  const newStreet = req.body.address.street;
  const newCity = req.body.address.city;
  const newCountry = req.body.address.country;

  const usernameParam = req.params.userName;
  const carBrand = req.body.car.brand;
  const carModel = req.body.car.model;
  const carYear = req.body.car.year;
  const carPower = req.body.car.specs.power;
  const carFuel = req.body.car.specs.fuel;

  //create new car obj
  const car = new Car({
    brand: carBrand,
    model: carModel,
    year: carYear,
    specs: {
      power: carPower,
      fuel: carFuel,
    },
  });

  //save car in collection
  car
    .save()
    .then((res) => console.log("car added", res))
    .catch((err) => console.log(err));

  // Find User and his car related
  User.findOne({ username: usernameParam })
    .populate({ path: "car", model: "Car" })
    .exec()
    .then((user) => {
      console.log("before", user);
      console.log("before car ", user.car);
      return user;
    })
    .then((user) => {
      //Assign new values to user update
      user.name = name;
      user.username = username;
      user.email = email;
      user.gender = gender;
      user.age = age;
      user.car = car;

      let { address } = user;
      address.street = newStreet;
      address.city = newCity;
      address.country = newCountry;

      //Save new updated user in collection
      user
        .save()
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

//--------  DELETE ----------//
exports.deleteUser = (req, res, next) => {
  //Set header for json response
  res.setHeader("Content-Type", "application/json");

  //Param query search
  const username = req.params.userName;

  //Find user
  User.findOne({ username: username })
    .populate({ path: "car", model: "Car" })
    .exec()
    .then((user) => {
      //check if user exists
      if (user) {
        //user remove
        user.remove();

        res.send(JSON.stringify({ message: "User deleted successfully" }));
        res.status(200).end();
      } else {
        res.send(JSON.stringify({ message: "Error, user not deleted!!" }));
        res.status(500).end();
      }
    })
    .catch((err) => console.log(err));
};
