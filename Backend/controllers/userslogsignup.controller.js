//import the user model here as such
const userModel = require("../Model/users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// backend email verification
const backendEmailVerification = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

const loginFunction = async (req, res) => {
  // get the data from the frontend to the backend here as such
  try {
    const { email, password } = req.body;

    // basic checks here as such
    if (!email || email.trim() === "" || !backendEmailVerification(email)) {
      return res.status(400).json({
        Error: "Invalid email type",
      });
    }

    // check password as well
    if (!password || password.length < 8) {
      return res.status(400).json({
        Error: "Invalid Password",
      });
    }

    // now if valid im going to go ahead and search database
    const founduser = await userModel.findOne({ email });
    if (!founduser) {
      return res.status(401).json({
        Error: "Invalid password or email",
      });
    }

    // now i need to comapre the passwords as such
    const validPass = await bcrypt.compare(password, founduser.password);
    if (!validPass) {
      return res.status(401).json({
        Error: "Invalid password or email",
      });
    }

    // if the login is valid now we can create a token using the jwt sign
    const token = jwt.sign({ userId: founduser._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    return res.status(200).json({
      token,
      message: "login successful",
    });
  } catch (error) {
    console.error("Error handling user login details", error);
    return res.status(500).json({
      Error: "Error logging user in with given credentials",
    });
  }
};

const signUpFunction = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        Error: "Please enter your name",
      });
    }

    // do validation here as such for each of them
    if (!email || email.trim() === "" || !backendEmailVerification(email)) {
      return res.status(400).json({
        Error: "Invalid email type",
      });
    }

    // check password as well
    if (!password || password.length < 8) {
      return res.status(400).json({
        Error: "Invalid Password",
      });
    }

    // now we can search the database using the findOne function as such here
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        Error: "User already exists",
      });
    }

    // now i can hash the given pass word as such
    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      // here we are just following the schema.
      name: name,
      email: email,
      password: hashedPass,
    });

    await newUser.save();

    // need to generate token for the newly signed up user.
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    return res.status(201).json({
      token,
      message: "User registered Successfully",
    });
  } catch (error) {
    console.error("Error registering User", error);
    return res.status(500).json({
      Error: error,
    });
  }
};

module.exports = { loginFunction, signUpFunction };
