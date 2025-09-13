import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({ imports: [SharedModule, DatabaseModule, HealthModule, UserModule, AuthModule] })
export class AppModule {}
