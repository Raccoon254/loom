# Loom

**Loom** is a TypeScript full-stack framework built with simplicity and flexibility in mind. Inspired by Laravel’s elegance, Loom integrates **Prisma ORM** for seamless database management, **Express** for handling requests, and a clear structure to make building web applications smooth and intuitive.

## Features

- **TypeScript-first**: Leverage the power of TypeScript for type safety and modern JavaScript features.
- **Express-powered**: Built on Express, making it fast and familiar to Node.js developers.
- **Prisma ORM**: Manage your database schema, migrations, and models with Prisma for powerful and intuitive data access.
- **MVC Pattern**: Provides a clean, organized structure for building and maintaining applications.
- **Modular Design**: Models, routes, and controllers are easy to manage and extend.
- **Extensible**: Add custom middleware, routes, and services to suit your application's needs.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [pnpm](https://pnpm.io/) or npm/yarn as a package manager
- [Prisma CLI](https://www.prisma.io/docs/getting-started)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Raccoon254/loom.git
   cd loom
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up your `.env` file for database configuration (SQLite, PostgreSQL, etc.):

   ```env
   DATABASE_URL="file:./database/dev.db"  # For SQLite (or use your preferred DB)
   ```

4. Initialize Prisma:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Run the development server:

   ```bash
   pnpm run dev
   ```

6. Access the application at `http://localhost:3000`.

### Project Structure

```
.
├── prisma             # Prisma schema and migrations
│   └── schema.prisma  # Database models and configuration
├── src
│   ├── models         # TypeScript models (mapped to Prisma)
│   ├── routes         # Express route definitions
│   ├── controllers    # Business logic for your routes
│   ├── views          # Frontend views (optional)
│   └── index.ts       # Entry point for the application
├── .env               # Environment variables (DB connection)
├── package.json       # Project metadata and scripts
└── tsconfig.json      # TypeScript configuration
```

### Example Models

Here’s a sample of how you can structure your models in Loom:

**`src/models/User.ts`**:
```typescript
import { PrismaClient, User as PrismaUser } from '@prisma/client';

const prisma = new PrismaClient();

export class User {
  id: number;
  name: string;
  email: string;

  constructor(user: PrismaUser) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }

  static async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? new User(user) : null;
  }
}
```

### Example Routes

You can define routes using Express to handle requests and interact with your models.

**`src/routes/userRoutes.ts`**:
```typescript
import express from 'express';
import { User } from '../models/User';

const router = express.Router();

router.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const user = await User.create({ name, email });
  res.json(user);
});

export default router;
```

### Running the Application

To start the Loom framework, run the following command:

```bash
pnpm run dev
```

The server will be available on `http://localhost:3000`.

### Contributing

We welcome contributions! Feel free to fork the repository and submit pull requests. If you find any bugs or have suggestions, please open an issue.

### License

Loom is open-source software licensed under the [MIT license](LICENSE).