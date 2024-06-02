import { inject, injectable } from "inversify";
import { FastifyReply, FastifyRequest } from "fastify";
import { ProductService } from "../../services/product.service";
import APP_TYPES from "../../common/types/app.types";
import appLogger from "../../common/logger";
import { HTTP } from "../../common/constants/app.constants";
import ProductCreateDto, {
	ProductCreateDtoProps,
} from "./dto/product-create.dto";
import ValidatorRequest from "../../common/validator.request";
import AppException from "../../common/exceptions/app.exception";
import { ERROR_500 } from "../../common/messages/common.errors";

@injectable()
export default class ProductController {
	constructor(
		@inject(APP_TYPES.ProductService)
		private readonly productService: ProductService
	) {}

	async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		appLogger.debug("ProductController | create | request: ", request.body);

		try {
			const productCreateDto = new ProductCreateDto(
				request.body as ProductCreateDtoProps
			);
			await ValidatorRequest.run(productCreateDto);

			const response = await this.productService.create(productCreateDto);
			reply.status(HTTP.STATUS_201);
			reply.send(response);
		} catch (error) {
			appLogger.debug("ProductController | create | error: ", error);
			if (error instanceof AppException) {
				reply.status(error.errorBody.statusCode);
				reply.send(error.errorBody);
			} else {
				reply.status(ERROR_500.UNKNOWN.statusCode);
				reply.send(ERROR_500.UNKNOWN);
			}
		}
	}
}
