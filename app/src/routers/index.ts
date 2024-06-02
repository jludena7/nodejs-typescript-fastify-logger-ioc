import { FastifyInstance } from "fastify";
import userRouter from "./user.router";
import productRouter from "./product.router";

const apiRoutes = async (fastify: FastifyInstance): Promise<void> => {
	fastify.register(userRouter);
	fastify.register(productRouter);
};

export default apiRoutes;
