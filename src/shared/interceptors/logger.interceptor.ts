import {
	Injectable,
	Logger,
	type CallHandler,
	type ExecutionContext,
	type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { tap, type Observable } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	private readonly logger = new Logger(LoggerInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const startTime = Date.now();
		const request = context.switchToHttp().getRequest<Request>();
		const response = context.switchToHttp().getResponse<Response>();

		const { method, url, ip } = request;
		const userAgent = request.get('User-Agent') || '';

		return next.handle().pipe(
			tap({
				next: () => {
					const endTime = Date.now();
					const duration = endTime - startTime;
					const statusCode = response.statusCode;

					this.logger.log(`${method} ${url} - ${statusCode} - ${duration}ms - ${ip} - ${userAgent}`);
				},
				error: (error) => {
					const endTime = Date.now();
					const duration = endTime - startTime;
					const statusCode = error.status || response.statusCode || 500;

					this.logger.error(
						`${method} ${url} - ${statusCode} - ${duration}ms - ${ip} - ${userAgent} - Error: ${error.message}`,
					);
				},
			}),
		);
	}
}
