import express, { Request, Response } from 'express';
import { errorMiddleware } from './middlewares/error.middleware';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import https from 'https';
import http from 'http';
import { loadCertificate } from './middlewares/certificat.middleware';
import { config } from './config/config';
import session from 'express-session';
import fs from "fs/promises";
import { IProduct } from './interfaces/v1/product.interface.ts';
import { Product } from './models/v1/product.model.ts';
import { randomInt } from 'crypto';
import v1ProductRoutes from './routes/v1/product.route.ts';
import v1AuthRoutes from './routes/v1/auth.route.ts'
import v1UserRoutes from './routes/v1/user.route.ts'
import { User } from './interfaces/v1/user.interface.ts';
import { UserModel } from './models/v1/user.model.ts';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import v2ProductRoutes from './routes/v2/product.route.ts';
import v2UserRoutes from './routes/v2/user.route.ts';
import v2AuthRoutes from './routes/v2/auth.route.ts';

const app = express();
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

// Définir les options de Swagger pour API V2
const swaggerOptionsV2 = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TP3 - Products and User Auth API with MongoDB Atlas',
      version: '2.0.0',
      description: 'Un API pour gérer les produits avec authentification JWT et utilisant MongoDB',
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
  apis: ['./src/routes/v2/*.route.ts'], // Fichier où les routes de l'API sont définies
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
const swaggerDocsV2 = swaggerJsdoc(swaggerOptionsV2);

const swaggerUiV1 = swaggerUi.serveFiles(swaggerDocs);
const swaggerUiV2 = swaggerUi.serveFiles(swaggerDocsV2);

// Charger les certificats
let certificatOptions = loadCertificate();

app.use(errorMiddleware);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express! Connexion sécurisée.');
});

// ----- v1 -----
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

app.use('/v1', v1ProductRoutes);
app.use('/v1', v1AuthRoutes);
app.use('/v1', v1UserRoutes);
app.use('/v1/api-docs', swaggerUiV1, swaggerUi.setup(swaggerDocs));

// ----- v2  -----
// Use env database
const DB_URI : string = config.isProduction ? config.databaseUrl : config.testDatabaseUrl;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);

    mongoose.connection.on('connected', () => {
      console.log("v2 - Mongoose connected to MongoDB Atlas.");
    });

    mongoose.connection.on('error', (err) => {
      console.error("v2 - Mongoose connection error:", err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn("v2 - Mongoose disconnected from MongoDB Atlas.");
    });

    console.log("v2 - MongoDB connected to Atlas successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1);
  }
};
connectDB();

// Database has an admin user with role "gestionnaire", it was stored manually with this hash
// async function adminHashForTesting() {
//   const hashedmdp = await bcrypt.hash("abc-123", 2)
//   console.log(hashedmdp);
// }
// adminHashForTesting();

app.use('/v2', v2ProductRoutes);
app.use('/v2', v2UserRoutes);
app.use('/v2', v2AuthRoutes);
app.use('/v2/api-docs', swaggerUiV2, swaggerUi.setup(swaggerDocsV2));

// http/https depending on env
let envApp : any

if (config.nodeEnv == "prod") {
  envApp = http.createServer(app);
  console.log("Launching on HTTP for PROD - Should be using Render certificates")
} else {
  envApp = https.createServer(certificatOptions, app);
  console.log("Launching on HTTPS for DEV or TEST - Using self-signed certificates")
}

export default envApp


