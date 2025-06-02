import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const PORT = process.env.PORT || 4000;

// swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MERN NMC APIs',
      version: '1.0.0',
      description: 'API documentation for MERN NMC app',
    },
    servers: [
      {
        url: `https://e2425-wads-l4acg2-server.csbihub.id`,
      },
    ],
    components: {
      parameters: {
        date: {
          name: "date",
          in: "query",
          required: true,
          schema: {
            type: "string",
            format: "date",
          },
          description: "Reference date for the report",
        },
        compTypeId: {
          name: "compTypeId",
          in: "query",
          required: true,
          schema: {
            type: "string",
          },
          description: "Competition type ID",
        },
      },
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
