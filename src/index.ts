// src/index.ts
import express from 'express';
import { generatePrismaSchema } from './utils/schemaGenerator';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';

const app = express();
app.use(express.json());

// Generate Prisma schema on startup
generatePrismaSchema();

// Use routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
