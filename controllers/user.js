// Import
const faker = require("faker");
const User = require("../models/user");
const Car = require("../models/car");
const mongoose = require("mongoose");

//------- READ ALL USERS--------//
exports.getUsers = async (req, res, next) => {
  //Set header to retrive json
  res.setHeader("Content-Type", "application/json");

  try {
    //find all Users
    const users = await User.find();

    //response with users json
    res.send(JSON.stringify({ users }));
  } catch (err) {
    res.send(JSON.stringify({ error: error }));
  }
};

//---- FAKE GENERATE RANDOM USERS AND CARS --------//
exports.generateUsers = async (req, res, next) => {
  try {
    //find all users if present
    const users = await User.find();

    //check if any user already generated
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
          year: Math.floor(Math.random() * (2021 - 1992 + 1) + 1992),
          specs: {
            power: Math.floor(Math.random() * 180) + 70,
            fuel: faker.vehicle.fuel(),
          },
        });

        //save car in collection
        await car.save();

        //create new users
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
        await user_item.save();
      }
    }
  } catch (error) {
    res.send(JSON.stringify({ error: error }));
  }

  res.redirect("/");
};

//----- READ SINGLE USER ------//
exports.findUser = async (req, res, next) => {
  //Set header JSON
  res.setHeader("Content-Type", "application/json");

  //param
  var userName = req.params.userName;

  //read user
  try {
    const user = await User.find({ username: userName })
      .populate({ path: "car", model: "Car" })
      .exec();

    //response json user
    res.send(JSON.stringify({ user }));
  } catch (error) {
    res.send(JSON.stringify({ error: error }));
  }
};

//-------- CREATE USER----------//
exports.addUser = async (req, res, next) => {
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

  try {
    //save car in collection
    await car.save();

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
    await user.save();
  } catch (error) {
    res.send(JSON.stringify({ error: error }));
  }
};

//------ UPDATE USER--------//
exports.updateUser = async (req, res, next) => {
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

  try {
    //save car in collection
    let carUpdated = await car.save();

    // Find User and his car related
    const user = await User.findOne({ username: usernameParam })
      .populate({ path: "car", model: "Car" })
      .exec();

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
    let userUpdated = await user.save();

    res.send(JSON.stringify({ userUpdated }));
  } catch (error) {
    res.send(JSON.stringify({ error: error }));
  }
};

//--------  DELETE USER ----------//
exports.deleteUser = async (req, res, next) => {
  //Set header for json response
  res.setHeader("Content-Type", "application/json");

  //Param query search
  const username = req.params.userName;

  try {
    //Find user
    const user = await User.findOne({ username: username })
      .populate({ path: "car", model: "Car" })
      .exec();

    if (user) {
      //user remove
      await user.remove();

      res.send(JSON.stringify({ message: "User deleted successfully" }));
      res.status(200).end();
    } else {
      res.send(JSON.stringify({ message: "Error, user not deleted!!" }));
      res.status(500).end();
    }
  } catch (error) {
    res.send(JSON.stringify({ error: error }));
  }
};
