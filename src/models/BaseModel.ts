import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type PropertyType = 'string' | 'number' | 'boolean' | 'date';

export interface Property {
  name: string;
  type: PropertyType;
  isOptional?: boolean;
  isUnique?: boolean;
  default?: any;
}

export interface Relation {
  name: string;
  type: 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';
  model: string;
  foreignKey?: string;
}

type PrismaDelegate = {
  findUnique: Function;
  findMany: Function;
  create: Function;
  update: Function;
  delete: Function;
  // Add other methods as needed
};

export abstract class BaseModel {
  protected static prisma = prisma;
  static modelName: string;
  static properties: Property[] = [];
  static relations: Relation[] = [];

  static getSchemaDefinition(): string {
    let schema = `model ${this.modelName} {\n`;
    
    this.properties.forEach(prop => {
      let propDef = `  ${prop.name} ${this.getPrismaType(prop.type)}`;
  
      // Set default values for primary key and creation date
      if (prop.name === 'id') {
        propDef += ' @id @default(autoincrement())';
      } else if (prop.name === 'createdAt' && prop.type === 'date') {
        propDef += ' @default(now())';
      } else if (!prop.isOptional) {
        propDef += '';
      }
  
      // Set unique constraint if applicable
      if (prop.isUnique) {
        propDef += ' @unique';
      }
  
      // Set default values for non-id fields if provided
      if (prop.default !== undefined && prop.name !== 'id' && prop.name !== 'createdAt') {
        propDef += ` @default(${prop.default})`;
      }
  
      schema += propDef + '\n';
    });
  
    this.relations.forEach(relation => {
      if (relation.type === 'hasMany') {
        schema += `  ${relation.name} ${relation.model}[]\n`;
      } else if (relation.type === 'belongsTo') {
        schema += `  ${relation.name} ${relation.model} @relation(fields: [${relation.foreignKey}], references: [id])\n`;
        //check if we have the field else add it
        if (!this.properties.find(prop => prop.name === relation.foreignKey)) {
          schema += `  ${relation.foreignKey} Int\n`;
        }
      } else {
        schema += `  ${relation.name} ${relation.model}?\n`;
      }
    });

    //if we have double exact fields remove the duplicates
  
    schema += '}\n';
    return schema;
  }
  

  private static getPrismaType(type: PropertyType): string {
    switch (type) {
      case 'string': return 'String';
      case 'number': return 'Int';
      case 'boolean': return 'Boolean';
      case 'date': return 'DateTime';
      default: return 'String';
    }
  }

  protected static get prismaModel(): PrismaDelegate {
    return this.prisma[this.modelName.toLowerCase() as keyof typeof prisma] as unknown as PrismaDelegate;
  }

  static async findById(id: number): Promise<any | null> {
    return await this.prismaModel.findUnique({
      where: { id },
    });
  }

  static async create(data: any): Promise<any> {
    return await this.prismaModel.create({
      data,
    });
  }

  static async findAll(): Promise<any[]> {
    return await this.prismaModel.findMany();
  }

  static async update(id: number, data: any): Promise<any> {
    return await this.prismaModel.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number): Promise<void> {
    await this.prismaModel.delete({
      where: { id },
    });
  }
}