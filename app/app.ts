import "reflect-metadata";
import fastify, {FastifyError, FastifyReply, FastifyRequest} from 'fastify';
import fastifyCors from "@fastify/cors";
import {ERROR_404, ERROR_500} from "./src/common/messages/common.errors";
import apiRoutes from "./src/routers";
import {API, CORS} from "./src/common/constants/app.constants";
import appLogger from "./src/common/logger";

const app = fastify();

app.register(fastifyCors, {
    origin: CORS.ALLOW,
    methods: CORS.METHODS,
});

app.register(apiRoutes, {prefix: API.VERSION_V1});

app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply): void => {
    appLogger.info("setNotFoundHandler | url: ", request.url);
    reply.status(ERROR_404.ROUTER_NOT_FOUND.statusCode).send(ERROR_404.ROUTER_NOT_FOUND);
});

app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply): void => {
    appLogger.info("setErrorHandler | url: ", request.url);
    appLogger.error("setErrorHandler | error: ", error);
    reply.status(ERROR_500.UNKNOWN.statusCode).send(ERROR_500.UNKNOWN);
});

export default app;
