import fs from 'fs';
import path from 'path';
import { BaseModel } from '../models/BaseModel'; // Import BaseModel

export function generatePrismaSchema() {
  const modelsDir = path.join(__dirname, '..', 'models');
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
    if (file.endsWith('.ts') && file !== 'BaseModel.ts') {
      const modelPath = path.join(modelsDir, file);
      const modelModule = require(modelPath);

      // Each model file should export a class a default
      const modelClass = Object.values(modelModule)[0] as typeof BaseModel;

      if (typeof modelClass.getSchemaDefinition === 'function') {
        schemaContent += modelClass.getSchemaDefinition() + '\n';
      }
    }
  });

  fs.writeFileSync(path.join(__dirname, '..', '..', 'prisma', 'schema.prisma'), schemaContent);
  console.log('Prisma schema updated successfully.');
}
