import mongoose from 'mongoose';

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
export function connectToMongoDB() {
	const MONGODB = getMongoDBConfig();
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
