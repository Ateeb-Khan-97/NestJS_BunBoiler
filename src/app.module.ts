import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './shared/guards/auth.guard';

@Module({
	providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
	imports: [SharedModule, DatabaseModule, HealthModule, UserModule, AuthModule],
})
export class AppModule {}
