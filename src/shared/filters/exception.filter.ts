import type { Response } from 'express';
import { Catch, HttpException, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';
import { ResponseMapper } from '../mappers/response.map';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse() as Response;

		let response: ResponseMapper;
		if (exception instanceof HttpException) {
			response = ResponseMapper.map({ message: exception.message, status: exception.getStatus() });
		} else {
			response = ResponseMapper.map({ message: 'INTERNAL_SERVER_ERROR', status: 500 });
		}

		return res.status(response.status).json(response.toJSON());
	}
}
