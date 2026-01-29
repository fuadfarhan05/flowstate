const mongoose = require("mongoose");
const URI = process.env.URI;

const DbConnection = async () => {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB successfully connected");
    return true;
  } catch (error) {
    console.log("There was an error connecting to MongoDb", error);
    return false;
  }
};

module.exports = DbConnection;
