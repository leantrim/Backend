"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const site_1 = __importDefault(require("./routes/site"));
const forms_1 = __importDefault(require("./routes/forms"));
dotenv_1.default.config();
checkJwtSecret();
const app = initializeExpressApp();
startServer(app);
/* Api controllers */
app.use("/api/user", user_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/sites", site_1.default);
app.use("/api/forms", forms_1.default);
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
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.get("/", (req, res) => {
        res.send("Hello World! ");
    });
    return app;
}
// Function to start the server
function startServer(app) {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}
// Function to get MongoDB configuration
function getMongoDBConfig() {
    return {
        user: process.env.MONGODB_USER,
        password: encodeURIComponent(process.env.MONGODB_PASSWORD),
        ip: process.env.MONGODB_IP,
        port: process.env.MONGODB_PORT,
        db: process.env.MONGODB_DB,
    };
}
// Function to connect to MongoDB
function connectToMongoDB(MONGODB) {
    mongoose_1.default.set("strictQuery", false);
    mongoose_1.default
        .connect(`mongodb://${MONGODB.user}:${MONGODB.password}@${MONGODB.ip}:${MONGODB.port}/${MONGODB.db}?authSource=${MONGODB.db}&authMechanism=DEFAULT`)
        .then(() => console.log("Connected to MongoDB..."))
        .catch((err) => console.log("Could not connect to MongoDB...", err));
}
