import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import apiRoutes from './routes';
import { connectToMongoDB } from './mongodb';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

checkJwtSecret();

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
	app.use(cors());
	app.use(express.json());
	app.use(cookieParser());
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
