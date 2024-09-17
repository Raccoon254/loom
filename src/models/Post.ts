import { BaseModel, Property, Relation } from './BaseModel';
import { User } from './User';

export class Post extends BaseModel {
  static modelName = 'Post';
  static properties: Property[] = [
    { name: 'id', type: 'number', isUnique: true },
    { name: 'title', type: 'string' },
    { name: 'content', type: 'string' },
    { name: 'published', type: 'boolean', default: false },
    { name: 'authorId', type: 'number' }
  ];
  static relations: Relation[] = [
    { name: 'author', type: 'belongsTo', model: 'User', foreignKey: 'authorId' }
  ];

  id!: number;
  title!: string;
  content!: string;
  published!: boolean;
  authorId!: number;
  author?: User;

  static async createPost(data: { title: string; content: string; authorId: number }): Promise<Post> {
    const post = await this.prismaModel.create({
      data,
    });
    return Object.assign(new Post(), post);
  }

  static async getPublishedPosts(): Promise<Post[]> {
    const posts = await this.prismaModel.findMany({
      where: { published: true },
    });
    return posts.map((post: any) => Object.assign(new Post(), post));
  }

  static async publishPost(id: number): Promise<Post> {
    const post = await this.prismaModel.update({
      where: { id },
      data: { published: true },
    });
    return Object.assign(new Post(), post);
  }

  static async getPostWithAuthor(id: number): Promise<Post | null> {
    const post = await this.prismaModel.findUnique({
      where: { id },
      include: { author: true },
    });
    return post ? Object.assign(new Post(), post) : null;
  }
}