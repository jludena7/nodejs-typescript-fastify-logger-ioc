import "reflect-metadata";
import { FastifyReply, FastifyRequest } from "fastify";
import { ProductService } from "../../../app/src/services/product.service";
import ProductController from "../../../app/src/controllers/product/product.controller";
import ProductCreateDto from "../../../app/src/controllers/product/dto/product-create.dto";
import { HTTP } from "../../../app/src/common/constants/app.constants";
import {
	ERROR_400,
	ERROR_500,
} from "../../../app/src/common/messages/common.errors";

describe("ProductController", () => {
	let productService: jest.Mocked<ProductService>;
	let productController: ProductController;
	let request: FastifyRequest;
	let reply: FastifyReply;

	beforeEach(() => {
		productService = {
			create: jest.fn().mockReturnValue({ id: 1 }),
		} as jest.Mocked<ProductService>;

		productController = new ProductController(productService);

		request = {
			body: { code: "10001", name: "Product Name", price: 100 },
		} as FastifyRequest;

		reply = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis(),
		} as unknown as FastifyReply;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should create a new product and return 201 status", async () => {
		await productController.create(request, reply);

		expect(productService.create).toHaveBeenCalledWith(
			expect.any(ProductCreateDto)
		);
		expect(reply.status).toHaveBeenCalledWith(HTTP.STATUS_201);
		expect(reply.send).toHaveBeenCalledWith({ id: 1 });
	});

	it("should handle AppException IS_NOT_EMPTY code", async () => {
		const requestTemp = {
			body: { code: null, name: "Product Name", price: 100 },
		} as FastifyRequest;

		await productController.create(requestTemp, reply);

		expect(reply.status).toHaveBeenCalledWith(HTTP.STATUS_400);
		expect(reply.send).toHaveBeenCalledWith(ERROR_400.IS_NOT_EMPTY("code"));
	});

	it("should handle AppException IS_NOT_EMPTY price", async () => {
		const requestTemp = {
			body: { code: "10001", name: "Product Name", price: null },
		} as FastifyRequest;

		await productController.create(requestTemp, reply);

		expect(reply.status).toHaveBeenCalledWith(HTTP.STATUS_400);
		expect(reply.send).toHaveBeenCalledWith(ERROR_400.IS_NUMBER("price"));
	});

	it("should handle AppException IS_NOT_EMPTY name", async () => {
		const requestTemp = {
			body: { code: "10001", name: "", price: 100 },
		} as FastifyRequest;

		await productController.create(requestTemp, reply);

		expect(reply.status).toHaveBeenCalledWith(HTTP.STATUS_400);
		expect(reply.send).toHaveBeenCalledWith(ERROR_400.IS_NOT_EMPTY("name"));
	});

	it("should handle unknown errors and return 500 status", async () => {
		productService.create.mockRejectedValueOnce(new Error("Unknown Error"));

		await productController.create(request, reply);

		expect(reply.status).toHaveBeenCalledWith(ERROR_500.UNKNOWN.statusCode);
		expect(reply.send).toHaveBeenCalledWith(ERROR_500.UNKNOWN);
	});
});
