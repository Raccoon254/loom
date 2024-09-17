import { BaseModel, Property, Relation } from './BaseModel';
import { Post } from './Post';

export class User extends BaseModel {
  static modelName = 'User';
  static properties: Property[] = [
    { name: 'id', type: 'number', isUnique: true },
    { name: 'name', type: 'string' },
    { name: 'email', type: 'string', isUnique: true },
    { name: 'createdAt', type: 'date', default: 'now()' }
  ];
  static relations: Relation[] = [
    { name: 'posts', type: 'hasMany', model: 'Post' }
  ];

  id!: number;
  name!: string;
  email!: string;
  nickName!: string;
  createdAt!: Date;
  posts?: Post[];

  static async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaModel.findUnique({
      where: { email },
    });
    return user ? Object.assign(new User(), user) : null;
  }

  static async createUser(data: { name: string; email: string }): Promise<User> {
    const user = await this.prismaModel.create({
      data,
    });
    return Object.assign(new User(), user);
  }

  static async getUserWithPosts(id: number): Promise<User | null> {
    const user = await this.prismaModel.findUnique({
      where: { id },
      include: { posts: true },
    });
    return user ? Object.assign(new User(), user) : null;
  }
}