import mongoose from 'mongoose';

let connectionPromise;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    connectionPromise ||= mongoose.connect(uri);
    const conn = await connectionPromise;
    const dbName = conn.connection.name;
    console.log(`MongoDB Connected: ${conn.connection.host} (${dbName})`);
    return conn;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err.message);
});

export default connectDB;
