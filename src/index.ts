import express from 'express';
import { generatePrismaSchema } from './utils/schemaGenerator';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';

async function startServer() {
  console.log('Generating Prisma schema...');
  generatePrismaSchema();

  const app = express();
  app.use(express.json());

  // Use routes
  app.use('/users', userRoutes);
  app.use('/posts', postRoutes);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch(console.error);