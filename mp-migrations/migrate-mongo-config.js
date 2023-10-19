// In this file you can configure migrate-mongo
import dotenv from "dotenv";

dotenv.config();

const MONGODB = {
  user: process.env.MONGODB_USER,
  password: encodeURIComponent(process.env.MONGODB_PASSWORD),
  ip: process.env.MONGODB_IP,
  port: process.env.MONGODB_PORT,
  db: process.env.MONGODB_DB,
};

const config = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: `mongodb://${MONGODB.user}:${MONGODB.password}@${MONGODB.ip}:${MONGODB.port}/${MONGODB.db}?authSource=${MONGODB.db}&authMechanism=DEFAULT`,

    // TODO Change this to your database name:
    // databaseName: "YOURDATABASENAME",

    options: {
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    },
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations",

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog",

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: ".js",

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: true,

  // Don't change this, unless you know what you're doing
  moduleSystem: "esm",
};

export default config;
