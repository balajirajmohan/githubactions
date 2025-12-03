import { MongoClient } from 'mongodb';

const clusterAddress = process.env.MONGODB_CLUSTER_ADDRESS;
const dbUser = process.env.MONGODB_USERNAME;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DB_NAME;

// Debug: Log what we have (mask password)
console.log('MongoDB Config Check:');
console.log('  Cluster:', clusterAddress || 'MISSING');
console.log('  User:', dbUser || 'MISSING');
console.log('  Password:', dbPassword ? '***' + dbPassword.slice(-4) : 'MISSING');
console.log('  Database:', dbName || 'MISSING');

// URL encode password to handle special characters
const encodedPassword = encodeURIComponent(dbPassword);
const uri = `mongodb+srv://${dbUser}:${encodedPassword}@${clusterAddress}/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
});

console.log('Trying to connect to db');

try {
  await client.connect();
  await client.db(dbName).command({ ping: 1 });
  console.log('Connected successfully to server');
} catch (error) {
  console.log('Connection failed. Error:', error.message);
  // Don't close - keep client for potential retry
  console.log('Continuing with potentially disconnected client');
}

const database = client.db(dbName);

export default database;
