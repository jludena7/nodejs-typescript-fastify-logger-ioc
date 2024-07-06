import "reflect-metadata";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../../../app/src/services/user.service";
import UserController from "../../../app/src/controllers/user/user.controller";
import UserCreateDto from "../../../app/src/controllers/user/dto/user-create.dto";
import UserUpdateDto from "../../../app/src/controllers/user/dto/user-update.dto";
import UserAllDto from "../../../app/src/controllers/user/dto/user-all.dto";
import { HTTP } from "../../../app/src/common/constants/app.constants";
import { ERROR_500 } from "../../../app/src/common/messages/common.errors";
import AppException from "../../../app/src/common/exceptions/app.exception";
import BodyExceptionInterface from "../../../app/src/common/exceptions/interfaces/body-exception.interface";

describe("UserController", () => {
	let userService: jest.Mocked<UserService>;
	let userController: UserController;
	let requestCreate: FastifyRequest;
	let requestUpdate: FastifyRequest;
	let requestGet: FastifyRequest;
	let requestDelete: FastifyRequest;
	let requestAll: FastifyRequest;
	let reply: FastifyReply;

	beforeEach(() => {
		userService = {
			create: jest.fn().mockResolvedValue({ id: 1 }),
			update: jest.fn().mockResolvedValue({ id: 1 }),
			getById: jest.fn().mockResolvedValue({}),
			all: jest.fn().mockResolvedValue([]),
			delete: jest.fn().mockResolvedValue({ id: 1 }),
		} as jest.Mocked<UserService>;

		userController = new UserController(userService);

		requestCreate = {
			body: {
				email: "demo@hotmail.com",
				password: "password",
				full_name: "Pedro Perez",
				activate: 1,
			},
			params: {},
			query: {},
		} as unknown as FastifyRequest;

		requestUpdate = {
			body: {
				email: "demo@hotmail.com",
				password: "password",
				full_name: "Pedro Perez",
				activate: 1,
			},
			params: { id: "1" },
			query: {},
		} as unknown as FastifyRequest;

		requestGet = {
			body: {},
			params: { id: "1" },
			query: {},
		} as unknown as FastifyRequest;

		requestDelete = {
			body: {},
			params: { id: "1" },
			query: {},
		} as unknown as FastifyRequest;

		requestAll = {
			body: {},
			params: { id: "1" },
			query: { before: "1", after: "10", limit: "10" },
		} as unknown as FastifyRequest;

		reply = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis(),
		} as unknown as FastifyReply;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("Create", () => {
		it("should create a new user and return 201 status", async () => {
			await userController.create(requestCreate, reply);

			expect(userService.create).toHaveBeenCalledWith(
				expect.any(UserCreateDto)
			);
			expect(reply.status).toHaveBeenCalledWith(HTTP.STATUS_201);
			expect(reply.send).toHaveBeenCalledWith({ id: 1 });
		});
		it("should handle unknown errors and return 500 status", async () => {
			userService.create.mockRejectedValueOnce(new Error("Unknown Error"));

			await userController.create(requestCreate, reply);

			expect(reply.status).toHaveBeenCalledWith(ERROR_500.UNKNOWN.statusCode);
			expect(reply.send).toHaveBeenCalledWith(ERROR_500.UNKNOWN);
		});
		it("should handle AppException errors", async () => {
			const errorTemp = {
				statusCode: HTTP.STATUS_403,
				error: "EMULATE_ERROR",
				message: "Emulate error",
			} as BodyExceptionInterface;

			userService.create.mockRejectedValueOnce(new AppException(errorTemp));

			await userController.create(requestCreate, reply);

			expect(reply.status).toHaveBeenCalledWith(errorTemp.statusCode);
			expect(reply.send).toHaveBeenCalledWith(errorTemp);
		});
	});

	describe("Update", () => {
		it("should update a user and return 200 status", async () => {
			await userController.update(requestUpdate, reply);

			expect(userService.update).toHaveBeenCalledWith(
				"1",
				expect.any(UserUpdateDto)
			);
			expect(reply.status).toHaveBeenCalledWith(HTTP.STATUS_200);
			expect(reply.send).toHaveBeenCalled();
		});
		it("should handle unknown errors and return 500 status", async () => {
			userService.update.mockRejectedValueOnce(new Error("Unknown Error"));

			await userController.update(requestUpdate, reply);

			expect(reply.status).toHaveBeenCalledWith(ERROR_500.UNKNOWN.statusCode);
			expect(reply.send).toHaveBeenCalledWith(ERROR_500.UNKNOWN);
		});
		it("should handle AppException errors", async () => {
			const errorTemp = {
				statusCode: HTTP.STATUS_403,
				error: "EMULATE_ERROR",
				message: "Emulate error",
			} as BodyExceptionInterface;

			userService.update.mockRejectedValueOnce(new AppException(errorTemp));

			await userController.update(requestUpdate, reply);

			expect(reply.status).toHaveBeenCalledWith(errorTemp.statusCode);
			expect(reply.send).toHaveBeenCalledWith(errorTemp);
		});
	});

	describe("Get", () => {
		it("should get a user by id and return 200 status", async () => {
			await userController.get(requestGet, reply);

			expect(userService.getById).toHaveBeenCalledWith("1");
			expect(reply.status).toHaveBeenCalledWith(HTTP.STATUS_200);
			expect(reply.send).toHaveBeenCalled();
		});
		it("should handle unknown errors and return 500 status", async () => {
			userService.getById.mockRejectedValueOnce(new Error("Unknown Error"));

			await userController.get(requestUpdate, reply);

			expect(reply.status).toHaveBeenCalledWith(ERROR_500.UNKNOWN.statusCode);
			expect(reply.send).toHaveBeenCalledWith(ERROR_500.UNKNOWN);
		});
		it("should handle AppException errors", async () => {
			const errorTemp = {
				statusCode: HTTP.STATUS_403,
				error: "EMULATE_ERROR",
				message: "Emulate error",
			} as BodyExceptionInterface;

			userService.getById.mockRejectedValueOnce(new AppException(errorTemp));

			await userController.get(requestUpdate, reply);

			expect(reply.status).toHaveBeenCalledWith(errorTemp.statusCode);
			expect(reply.send).toHaveBeenCalledWith(errorTemp);
		});
	});

	describe("All", () => {
		it("should get all users and return 200 status", async () => {
			await userController.all(requestAll, reply);

			expect(userService.all).toHaveBeenCalledWith(expect.any(UserAllDto));
			expect(reply.status).toHaveBeenCalledWith(HTTP.STATUS_200);
			expect(reply.send).toHaveBeenCalled();
		});
		it("should handle unknown errors and return 500 status", async () => {
			userService.all.mockRejectedValueOnce(new Error("Unknown Error"));

			await userController.all(requestAll, reply);

			expect(reply.status).toHaveBeenCalledWith(ERROR_500.UNKNOWN.statusCode);
			expect(reply.send).toHaveBeenCalledWith(ERROR_500.UNKNOWN);
		});
		it("should handle AppException errors", async () => {
			const errorTemp = {
				statusCode: HTTP.STATUS_403,
				error: "EMULATE_ERROR",
				message: "Emulate error",
			} as BodyExceptionInterface;

			userService.all.mockRejectedValueOnce(new AppException(errorTemp));

			await userController.all(requestAll, reply);

			expect(reply.status).toHaveBeenCalledWith(errorTemp.statusCode);
			expect(reply.send).toHaveBeenCalledWith(errorTemp);
		});
	});

	describe("Delete", () => {
		it("should delete a user and return 200 status", async () => {
			await userController.delete(requestDelete, reply);

			expect(userService.delete).toHaveBeenCalledWith("1");
			expect(reply.status).toHaveBeenCalledWith(HTTP.STATUS_200);
			expect(reply.send).toHaveBeenCalled();
		});
		it("should handle unknown errors and return 500 status", async () => {
			userService.delete.mockRejectedValueOnce(new Error("Unknown Error"));

			await userController.delete(requestDelete, reply);

			expect(reply.status).toHaveBeenCalledWith(ERROR_500.UNKNOWN.statusCode);
			expect(reply.send).toHaveBeenCalledWith(ERROR_500.UNKNOWN);
		});
		it("should handle AppException errors", async () => {
			const errorTemp = {
				statusCode: HTTP.STATUS_403,
				error: "EMULATE_ERROR",
				message: "Emulate error",
			} as BodyExceptionInterface;

			userService.delete.mockRejectedValueOnce(new AppException(errorTemp));

			await userController.delete(requestDelete, reply);

			expect(reply.status).toHaveBeenCalledWith(errorTemp.statusCode);
			expect(reply.send).toHaveBeenCalledWith(errorTemp);
		});
	});
});
