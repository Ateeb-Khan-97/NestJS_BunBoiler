import type { Response } from 'express';
import {
	BadRequestException,
	Catch,
	HttpException,
	HttpStatus,
	type ArgumentsHost,
	type ExceptionFilter,
} from '@nestjs/common';
import { ResponseMapper } from '../mappers/response.map';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse() as Response;

		let response = ResponseMapper.map({ message: 'INTERNAL_SERVER_ERROR', status: 500 });
		if (exception instanceof HttpException) {
			response = ResponseMapper.map({ message: exception.message, status: exception.getStatus() });
		}
		if (exception instanceof BadRequestException) {
			const res = exception.getResponse() as string | { message: string | string[] };
			if (typeof res === 'string') {
				response = ResponseMapper.map({ message: res, status: HttpStatus.BAD_REQUEST });
			} else {
				if (Array.isArray(res.message)) {
					response = ResponseMapper.map({ message: res.message[0], status: HttpStatus.BAD_REQUEST });
				} else {
					response = ResponseMapper.map({ message: res.message, status: HttpStatus.BAD_REQUEST });
				}
			}
		}

		return res.status(response.status).json(response.toJSON());
	}
}
