import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Swing Notes API',
            version: '1.0.0',
            description: 'A simple API for managing notes',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                // All schemas (e.g., UserSignup, UserLogin, Note)
                // are now defined directly within their respective model files (userModel.js, noteModel.js) using JSDoc comments.
                // This section can remain empty as swagger-jsdoc will discover them.
            },
        },
    },
    apis: [path.join(__dirname, '../routes/*.js'), path.join(__dirname, '../models/*.js')],
};

// Generate the Swagger specification
const specs = swaggerJsdoc(options);

export default specs;
