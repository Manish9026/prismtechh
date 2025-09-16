import mongoose from 'mongoose';

export async function connectDatabase(): Promise<typeof mongoose> {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prism_tech';
  mongoose.set('strictQuery', true);
  return mongoose.connect(mongoUri, {
    autoIndex: true,
  });
}

