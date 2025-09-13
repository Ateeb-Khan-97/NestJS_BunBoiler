import type { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, type INestApplication } from '@nestjs/common';
import { env, isProduction } from './config/env.config';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig, SwaggerOptions } from './config/swagger.config';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { LoggerInterceptor } from './shared/interceptors/logger.interceptor';

async function bootstrap() {
	const logger = new Logger('NestFactory');
	const app = await NestFactory.create<INestApplication<ExpressAdapter>>(AppModule);

	app.enableCors();
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new ResponseInterceptor(), new LoggerInterceptor());

	app.use(helmet());

	// add swagger api docs for all envs except production
	if (!isProduction) {
		const SwaggerFactory = SwaggerModule.createDocument(app, SwaggerConfig);
		SwaggerModule.setup('/api/docs', app, SwaggerFactory, SwaggerOptions);
	}

	await app.listen(env.PORT);
	logger.log(`Application is running on: [http://localhost:${env.PORT}]`);
	if (!isProduction) logger.log(`Swagger docs available at [http://localhost:${env.PORT}/api/docs]`);
}

bootstrap();
