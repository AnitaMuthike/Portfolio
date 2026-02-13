const mongoose = require("mongoose");
const config = require("../config/env");

const mongoState = {
  connected: false,
};
let connectionPromise = null;

mongoose.connection.on("connected", () => {
  mongoState.connected = true;
  console.log("Connected to MongoDB");
});

mongoose.connection.on("disconnected", () => {
  mongoState.connected = false;
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  mongoState.connected = false;
  console.error("MongoDB error:", error.message);
});

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    mongoState.connected = true;
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(config.database.mongoUri)
    .then((connection) => {
      mongoState.connected = true;
      return connection;
    })
    .catch((error) => {
      mongoState.connected = false;
      console.error("MongoDB connection failed:", error.message);
      throw error;
    })
    .finally(() => {
      connectionPromise = null;
    });

  return connectionPromise;
}

function isDatabaseConnected() {
  return mongoState.connected;
}

module.exports = {
  connectToDatabase,
  isDatabaseConnected,
};
