import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';

@Module({
	imports: [UserModule],
	controllers: [AuthController],
	providers: [],
})
export class AuthModule {}
