import express, { Request, Response, NextFunction } from 'express';
import productRoutes from './routes/product.route';
import { errorMiddleware } from './middlewares/error.middleware';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import https from 'https';
import http from 'http';
import { loadCertificate } from './middlewares/certificat.middleware';
import { config } from './config/config';
import session from 'express-session';
import fs from "fs/promises";
import { IProduct } from './interfaces/product.interface';
import { Product } from './models/product.model';
import { randomInt } from 'crypto';
import authRoutes from './routes/auth.route'
import userRoutes from './routes/user.route'
import { User } from './interfaces/user.interface';
import { UserModel } from './models/user.model';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connect } from 'http2';

const app = express();
// Middleware de parsing du JSON
app.use(express.json());

// Définir les options de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TP1 - Products and User Auth API',
      version: '1.0.0',
      description: 'Un API pour gérer les produits avec authentification JWT',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
            },
            id: {
              type: 'number',
            },
            name: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
            role: {
              type: 'any',
            },
            username: {
              type: 'string',
            },
          },
          required: ['email', 'id', 'name', 'password', 'username'],
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            category: {
              type: 'string',
            },
            quantity: {
              type: 'number',
            },
            price: {
              type: 'number',
            },
          },
          required: ['id', 'name', 'description', 'category', 'quantity', 'price'],
        },
      },
    },
    security: [],
  },
  apis: ['./src/routes/*.route.ts'], // Fichier où les routes de l'API sont définies
};

// Middleware de session avec la clé secrète provenant des variables de configuration
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.isProduction, // Les cookies sécurisés ne sont activés qu'en production
  }
}));

// Générer la documentation à partir des options
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Charger les certificats
let certificatOptions = loadCertificate();

// Servir la documentation Swagger via '/api-docs'
app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Route de base
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express! Connexion sécurisée.');
});

app.use('/v1', productRoutes);
app.use('/v1', authRoutes);

// Only available on test
app.use('/v1', userRoutes)

app.use(errorMiddleware);

// Fetch les produits fictifs
async function populateProducts() {
  const url = "https://fakestoreapi.com/products/"
  const fileToPopulate = "json/products.json"
  let isFileEmpty = false

  // Check pour pas overwrite
  const data = await fs.readFile("json/products.json", "utf-8");
  if (data.length == 0) {
    isFileEmpty = true
  }

  // Mapping pour prendre seulement les données requis
  // Quantity est random pour chaque produit, le fakestoreapi ne contient pas de property pour quantity
  if (isFileEmpty) {
    try {
      const response = await fetch(url);
      const value = await response.json();
      const products: IProduct[] = value.map((item: any) => {
        return new Product(
            item.id,
            item.title,
            item.description,
            item.category,
            randomInt(100),
            item.price
          );
        });

      fs.writeFile(fileToPopulate, JSON.stringify(products, null, 2))
      console.log("v1 - Products.json populé!")
    } catch (error) {
      console.log(error) 
    }
  } else {
    console.log("v1 - Products.json déja populé")
  }
}
async function populateAndHashUsers() {
  const url = "https://fakestoreapi.com/users/"
  const fileToPopulate = "json/users.json"
  let isFileEmpty = false

  // Check pour pas overwrite
  const data = await fs.readFile("json/users.json", "utf-8");
  if (data.length == 0) {
    isFileEmpty = true
  }

  // Mapping pour prendre seulement les données requis
  // Quantity est random pour chaque produit, le fakestoreapi ne contient pas de property pour quantity
  if (isFileEmpty) {
    try {
      const response = await fetch(url);
      const value = await response.json();
      const users: User[] = await Promise.all(value.map(async (item: any) => {
        let password = await bcrypt.hash(item.password, 10)
        // Génére role aléatoirement
        const randomRole = () => {
          let role;
          randomInt(100) < 20 ? role = "gestionnaire" : role = "employee";
          return role;
        }

        return new UserModel(
            item.id,
            item.name.firstname + item.name.lastname,
            item.email,
            item.username,
            password,
            randomRole()
          );
        }));

      fs.writeFile(fileToPopulate, JSON.stringify(users, null, 2))
      console.log("v1 - Users.json populé!")
    } catch (error) {
      console.log(error) 
    }
  } else {
    console.log("v1 - Users.json déja populé")
  }
}
populateProducts();
populateAndHashUsers();

// ----- v2 Routes -----

const DATABASE_URL : any = process.env.NODE_ENV == "prod" ? process.env.DATABASE_URL : process.env.DATABASE_URL_DEV

async function connectToMongo() {
  await mongoose.connect(DATABASE_URL);
  console.log(`v2 - Connected to <${DATABASE_URL}>`);
}
connectToMongo();

let httpApp : any

if (process.env.NODE_ENV == "prod") {
  httpApp = http.createServer(app);
  console.log("Launching on HTTP for PROD - Should be using Render certificates")
} else if (process.env.NODE_ENV == "dev") {
  httpApp = https.createServer(certificatOptions, app);
  console.log("Launching on HTTPS for DEV - Using self-signed certificates")
}

export default httpApp


