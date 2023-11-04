import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import apiRoutes from './routes';

checkJwtSecret();

const app = initializeExpressApp();
startServer(app);

app.use(apiRoutes);

/* MongoDB */
const MONGODB = getMongoDBConfig();
connectToMongoDB(MONGODB);

// Function to check if JWT Secret is set
function checkJwtSecret() {
	if (!process.env.JWT_SECRET) {
		console.error('ERROR: JWT Secret not set');
		process.exit(1);
	}
}

// Function to initialize Express App
function initializeExpressApp() {
	const app = express();
	app.disable('x-powered-by');
	app.use(cors());
	app.use(express.json());

	app.get('/', (req, res) => {
		res.status(403).send('hello world');
	});

	return app;
}

// Function to start the server
function startServer(app: any) {
	app.listen(8000, () => {
		console.log('Server is running on port 8000');
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
	mongoose.set('strictQuery', false);
	mongoose
		.connect(
			`mongodb://${MONGODB.user}:${MONGODB.password}@${MONGODB.ip}:${MONGODB.port}/${MONGODB.db}?authSource=${MONGODB.db}&authMechanism=DEFAULT`
		)
		.then(() => console.log('Connected to MongoDB...'))
		.catch((err) => {
			console.log('Could not connect to MongoDB...', err), process.exit(1);
		});
}
