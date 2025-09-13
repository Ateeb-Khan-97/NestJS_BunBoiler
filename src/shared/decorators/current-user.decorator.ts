import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const CurrentUser = createParamDecorator((_, context: ExecutionContext): number | undefined => {
	return context.switchToHttp().getRequest<Request>().user?.id;
});
