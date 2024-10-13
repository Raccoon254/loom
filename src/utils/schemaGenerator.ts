import fs from 'fs';
import path from 'path';
import { BaseModel } from '../models/BaseModel'; // Import BaseModel
import env from 'dotenv';

export function generatePrismaSchema() {
  console.log('Starting Prisma schema generation...');
  const modelsDir = path.join(__dirname, '..', 'models');
  console.log(`Looking for models in: ${modelsDir}`);
  env.config();
  const databaseFilePath = process.env.DATABASE_URL;

  if (!databaseFilePath) {
    console.log('DATABASE_URL environment variable is not set');
    return;
  }

  if (databaseFilePath.startsWith('file:')) {
    let dbPath = databaseFilePath.slice(5); // Removes 'file:'
    if (!path.isAbsolute(dbPath)) {
      dbPath = path.resolve(path.join(__dirname, '..', dbPath));
    }
    if (!fs.existsSync(dbPath)) {
      const dbDir = path.dirname(dbPath);
      console.log('Creating database file at :', dbPath);
      fs.mkdirSync(dbDir, { recursive: true });
      fs.writeFileSync(dbPath, '');
      console.log('Database file created at :', dbPath);
    } else {
      console.log('Database file already exists at :', dbPath);
    }
  }

  let schemaContent = `
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

`;

  fs.readdirSync(modelsDir).forEach(file => {
    console.log(`Processing file: ${file}`);
    if (file.endsWith('.ts') && file !== 'BaseModel.ts') {
      const modelPath = path.join(modelsDir, file);
      const modelModule = require(modelPath);

      console.log(`Model module keys: ${Object.keys(modelModule)}`);

      // Each model file should export a class as default
      const modelClass = Object.values(modelModule)[0] as typeof BaseModel;

      if (typeof modelClass.getSchemaDefinition === 'function') {
        console.log(`Adding schema for model: ${modelClass.modelName}`);
        schemaContent += modelClass.getSchemaDefinition() + '\n';
      } else {
        console.log(`Warning: ${file} does not have a getSchemaDefinition method`);
      }
    }
  });

  const schemaPath = path.join(__dirname, '..', '..', 'prisma', 'schema.prisma');
  fs.writeFileSync(schemaPath, schemaContent);
  console.log(`Prisma schema updated successfully at: ${schemaPath}`);
  console.log('Schema content:');
  console.log(schemaContent);
}