import { DocumentBuilder, type SwaggerCustomOptions } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
	.setTitle('API Documentation')
	.setDescription('API description')
	.setVersion('1.0')
	.addBearerAuth(
		{
			description: `Please enter token in following format: Bearer <JWT>`,
			name: 'Authorization',
			bearerFormat: 'Bearer',
			scheme: 'Bearer',
			type: 'http',
			in: 'Header',
		},
		'access-token',
	)
	.build();

export const SwaggerOptions: SwaggerCustomOptions = {
	swaggerOptions: { defaultModelsExpandDepth: -1 },
};
