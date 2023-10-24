import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import user from "./routes/user";
import auth from "./routes/auth";
import site from "./routes/LandingPages/site";
import forms from "./routes/LandingPages/forms";
import upload from "./routes/Storage/upload";
import products from "./routes/ecommerce/products";
import klarnaV3 from "./routes/ecommerce/klarnaV3";
import store from "./routes/ecommerce/stores/stores";
import categories from "./routes/ecommerce/stores/categories";
import review from "./routes/ecommerce/stores/reviews";
import subPages from "./routes/ecommerce/stores/subPages";
import { API_ROUTES } from "@mediapartners/shared-types/types/Routes";

checkJwtSecret();

const app = initializeExpressApp();
startServer(app);

/* Api controllers */
// Panel Routes
app.use(`/${API_ROUTES.PANEL_USERS}`, user);
app.use(`/${API_ROUTES.AUTH}`, auth);
app.use(`/${API_ROUTES.UPLOAD}`, upload);

// Landing Page routes
app.use(`/${API_ROUTES.LANDING_PAGE_SITES}`, site);
app.use(`/${API_ROUTES.LANDING_PAGE_FORMS}`, forms);

// E-Commerce Routes
app.use(`/${API_ROUTES.ECOMMERCE_PRODUCTS}`, products);
app.use(`/${API_ROUTES.KLARNA}`, klarnaV3);
app.use(`/${API_ROUTES.ECOMMERCE_SITES}`, store);
app.use(`/${API_ROUTES.ECOMMERCE_CATEGORIES}`, categories);
app.use(`/${API_ROUTES.ECOMMERCE_REVIEWS}`, review);
app.use(`/${API_ROUTES.ECOMMERCE_SUB_PAGES}`, subPages);

/* MongoDB */
const MONGODB = getMongoDBConfig();
connectToMongoDB(MONGODB);

// Function to check if JWT Secret is set
function checkJwtSecret() {
  if (!process.env.JWT_SECRET) {
    console.error("ERROR: JWT Secret not set");
    process.exit(1);
  }
}

// Function to initialize Express App
function initializeExpressApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get("/", (req, res) => {
    res.status(403).send("hello world");
  });
  return app;
}

// Function to start the server
function startServer(app: any) {
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
}

// Function to get MongoDB configuration
export function getMongoDBConfig() {
  return {
    user: process.env.MONGODB_USER,
    password: encodeURIComponent(process.env.MONGODB_PASSWORD!!),
    ip: process.env.MONGODB_IP,
    port: process.env.MONGODB_PORT,
    db: process.env.MONGODB_DB,
  };
}

// Function to connect to MongoDB
function connectToMongoDB(MONGODB: any) {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(
      `mongodb://${MONGODB.user}:${MONGODB.password}@${MONGODB.ip}:${MONGODB.port}/${MONGODB.db}?authSource=${MONGODB.db}&authMechanism=DEFAULT`
    )
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => {
      console.log("Could not connect to MongoDB...", err), process.exit(1);
    });
}
