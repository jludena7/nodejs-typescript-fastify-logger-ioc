import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Container } from "inversify";
import productContainerModule from "../container/product.container";
import ProductController from "../controllers/product/product.controller";
import APP_TYPES from "../common/types/app.types";

const container: Container = new Container();
container.load(productContainerModule);

const productController: ProductController = container.get<ProductController>(
	APP_TYPES.ProductController
);

async function productRoutes(fastify: FastifyInstance): Promise<void> {
	fastify.post("/product", productController.create.bind(productController));
}

export default fp(productRoutes);
