import { inject, injectable } from "inversify";
import { FastifyReply, FastifyRequest } from "fastify";
import APP_TYPES from "../../common/types/app.types";
import { UserService } from "../../services/user.service";
import appLogger from "../../common/logger";
import UserGetDto, { UserGetDtoProps } from "./dto/user-get.dto";
import { HTTP } from "../../common/constants/app.constants";
import UserCreateDto, { UserCreateDtoProps } from "./dto/user-create.dto";
import UserUpdateDto, { UserUpdateDtoProps } from "./dto/user-update.dto";
import ValidatorRequest from "../../common/validator.request";
import AppException from "../../common/exceptions/app.exception";
import { ERROR_500 } from "../../common/messages/common.errors";
import UserAllDto, { UserAllDtoProps } from "./dto/user-all.dto";

@injectable()
export default class UserController {
	constructor(
		@inject(APP_TYPES.UserService)
		private readonly userService: UserService
	) {}

	async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		appLogger.debug("UserController | create | request: ", request.body);

		try {
			const userCreateDto = new UserCreateDto(
				request.body as UserCreateDtoProps
			);
			await ValidatorRequest.run(userCreateDto);

			const response = await this.userService.create(userCreateDto);
			reply.status(HTTP.STATUS_201);
			reply.send(response);
		} catch (error) {
			appLogger.debug("UserController | create | error: ", error);
			if (error instanceof AppException) {
				reply.status(error.errorBody.statusCode);
				reply.send(error.errorBody);
			} else {
				reply.status(ERROR_500.UNKNOWN.statusCode);
				reply.send(ERROR_500.UNKNOWN);
			}
		}
	}

	async update(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		appLogger.debug(
			"UserController | update | request: ",
			request.params,
			request.body
		);

		try {
			const userGetDto = new UserGetDto(request.params as UserGetDtoProps);
			await ValidatorRequest.run(userGetDto);

			const userUpdateDto = new UserUpdateDto(
				request.body as UserUpdateDtoProps
			);
			await ValidatorRequest.run(userUpdateDto);

			const response = await this.userService.update(
				userGetDto.id,
				userUpdateDto
			);
			reply.status(HTTP.STATUS_200);
			reply.send(response);
		} catch (error) {
			appLogger.debug("UserController | update | error: ", error);
			if (error instanceof AppException) {
				reply.status(error.errorBody.statusCode);
				reply.send(error.errorBody);
			} else {
				reply.status(ERROR_500.UNKNOWN.statusCode);
				reply.send(ERROR_500.UNKNOWN);
			}
		}
	}

	async get(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		appLogger.debug("UserController | get | request: ", request.params);

		try {
			const userGetDto = new UserGetDto(request.params as UserGetDtoProps);
			await ValidatorRequest.run(userGetDto);

			const response = await this.userService.getById(userGetDto.id);
			reply.status(HTTP.STATUS_200);
			reply.send(response);
		} catch (error) {
			appLogger.debug("UserController | get | error: ", error);
			if (error instanceof AppException) {
				reply.status(error.errorBody.statusCode);
				reply.send(error.errorBody);
			} else {
				reply.status(ERROR_500.UNKNOWN.statusCode);
				reply.send(ERROR_500.UNKNOWN);
			}
		}
	}

	async all(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		appLogger.debug("UserController | all | request: ", request.query);

		try {
			const userAllDto = new UserAllDto(request.query as UserAllDtoProps);
			await ValidatorRequest.run(userAllDto);

			const response = await this.userService.all(userAllDto);
			reply.status(HTTP.STATUS_200);
			reply.send(response);
		} catch (error) {
			appLogger.debug("UserController | all | error: ", error);
			if (error instanceof AppException) {
				reply.status(error.errorBody.statusCode);
				reply.send(error.errorBody);
			} else {
				reply.status(ERROR_500.UNKNOWN.statusCode);
				reply.send(ERROR_500.UNKNOWN);
			}
		}
	}

	async delete(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		appLogger.debug("UserController | delete | request: ", request.params);

		try {
			const userGetDto = new UserGetDto(request.params as UserGetDtoProps);
			await ValidatorRequest.run(userGetDto);

			const response = await this.userService.delete(userGetDto.id);
			reply.status(HTTP.STATUS_200);
			reply.send(response);
		} catch (error) {
			appLogger.debug("UserController | delete | error: ", error);
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
