import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    definition: {
        openapi: '3.0.0',    // OpenAPI specification version
        info: {
            title: 'Swing Notes API',
            version: '1.0.0',
            description: 'Ett enkelt API för att hantera anteckningar',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Lokal utvecklingsserver',
            },
        ],
        // Components for reusable schemas and security definitions
        components: {
            securitySchemes: {
                // Defines a security scheme for JWT bearer token
                bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                },
            },
            schemas: {
                // Schema for user signup request body
                UserSignup: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            description: 'Användarnamn',
                            example: 'testuser',
                        },
                        password: {
                            type: 'string',
                            description: 'Lösenord',
                            example: 'password123',
                        },
                    },
                },
                // Schema for user login request body
                UserLogin: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            description: 'Användarnamn',
                            example: 'testuser',
                        },
                        password: {
                            type: 'string',
                            description: 'Lösenord',
                            example: 'password123',
                        },
                    },
                },
                // Schema for a Note object (used for response and request body)
                Note: {
                    type: 'object',
                    required: ['title', 'text'],
                    properties: {
                        _id: {      // MongoDB's unique identifier for the document
                            type: 'string',
                            description: 'Genererat ID för anteckningen (MongoDB _id)',
                            readOnly: true,     // Indicates this field is read-only
                        },
                        title: {
                            type: 'string',
                            description: 'Titeln på anteckningen (max 50 tecken)',
                            example: 'Min första anteckning',
                        },
                        text: {
                            type: 'string',
                            description: 'Själva anteckningstexten (max 300 tecken)',
                            example: 'Detta är en testanteckning.',
                        },
                        userId: {
                            type: 'string',
                            description: 'ID för användaren som äger anteckningen',
                            readOnly: true,
                        },
                        createdAt: {    // Mongoose automatically adds this timestamp
                            type: 'string',
                            format: 'date-time',
                            description: 'När anteckningen skapades',
                            readOnly: true,
                        },
                        updatedAt: {    // Mongoose automatically updates this timestamp on modification
                            type: 'string',
                            format: 'date-time',
                            description: 'När anteckningen senast uppdaterades',
                            readOnly: true,
                        },
                    },
                },
            },
        },
    },
    // Paths to files containing OpenAPI annotations (JSDoc comments)
    apis: [path.join(__dirname, '../routes/*.js')],     // Look for JSDoc in all .js files in the routes directory
};

// Generate the Swagger specification
const specs = swaggerJsdoc(options);

export default specs;
