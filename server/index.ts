import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import apiRoutes from './routes';
import { connectToMongoDB } from './mongodb';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

checkJwtSecret();

const CURRENT_VERSION = 'v0.1.1';

const app = initializeExpressApp();
startServer(app);

app.use(apiRoutes);
connectToMongoDB();

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
	app.use(helmet());
	app.use(express.json());
	app.use(cookieParser());
	app.use(cors({ credentials: true, origin: 'https://localhost:3000' }));
	app.get('/', (req, res) => {
		res.status(403).send(CURRENT_VERSION);
	});

	return app;
}

// Function to start the server
function startServer(app: any) {
	app.listen(8000, () => {
		console.log('Server is running on port 8000');
	});
}
