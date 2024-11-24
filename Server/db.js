const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

// MongoDB URI template from the environment variables
const MONGO_URI_TEMPLATE = process.env.MONGO_URI || 
  "mongodb+srv://test:test@atlascluster.qrtksmu.mongodb.net/{{DB_NAME}}?retryWrites=true&w=majority";

/**
 * Generate a MongoDB URI dynamically for the given database name.
 * @param {string} databaseName - The name of the database.
 * @returns {string} The full MongoDB connection URI.
 * @throws Will throw an error if the database name is missing.
 */
const getDatabaseURI = (databaseName) => {
  if (!databaseName) {
    throw new Error("Database name is required to generate the URI.");
  }
  const dbName = encodeURIComponent(databaseName.trim());
  return MONGO_URI_TEMPLATE.replace("{{DB_NAME}}", dbName);
};

/**
 * Connect to a MongoDB database dynamically.
 * Closes the current connection if it exists to avoid conflicts.
 * @param {string} databaseName - The name of the database to connect to.
 * @returns {Promise<void>} Resolves when the connection is established.
 * @throws Will throw an error if the connection fails.
 */
const connectToDatabase = async (databaseName) => {
  try {
    const uri = getDatabaseURI(databaseName);

    // Disconnect any existing connection
    if (mongoose.connection.readyState !== 0) {
      console.log("Closing existing database connection...");
      await mongoose.disconnect();
    }

    // Establish a new connection
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Successfully connected to the database: ${databaseName}`);
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    throw error; // Rethrow to handle in the calling code
  }
};

// Export the utility functions
module.exports = { getDatabaseURI, connectToDatabase };
