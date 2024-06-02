import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Container } from "inversify";
import APP_TYPES from "../common/types/app.types";
import userContainerModule from "../container/user.container";
import UserController from "../controllers/user/user.controller";

const container: Container = new Container();
container.load(userContainerModule);

const userController: UserController = container.get<UserController>(
	APP_TYPES.UserController
);

async function userRoutes(fastify: FastifyInstance): Promise<void> {
	fastify.post("/user", userController.create.bind(userController));
	fastify.patch("/user/:id", userController.update.bind(userController));
	fastify.get("/user/:id", userController.get.bind(userController));
	fastify.get("/user", userController.all.bind(userController));
	fastify.delete("/user/:id", userController.delete.bind(userController));
}

export default fp(userRoutes);
