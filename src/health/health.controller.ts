import { Controller, Get, HttpStatus } from '@nestjs/common';
import { HealthCheckService } from '@nestjs/terminus';
import { MemoryHealthIndicator } from './indicators/memory.health';
import { DatabaseHealthIndicator } from './indicators/database.health';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseMapper } from '@/shared/mappers/response.map';
import { CommonService } from '@/shared/services/common.service';

@ApiTags('Health')
@Controller('/api/health')
export class HealthController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly memoryIndicator: MemoryHealthIndicator,
		private readonly databaseIndicator: DatabaseHealthIndicator,
		private readonly commonService: CommonService,
	) {}

	@Get()
	@ApiBearerAuth('access-token')
	async checkHealthHandler() {
		const response = await this.health.check([
			() => this.memoryIndicator.isHealthy('memory'),
			() => this.databaseIndicator.isHealthy('database'),
		]);
		if (!this.commonService.isEmptyObject(response.error || {}))
			return ResponseMapper.map({ data: response.error, status: HttpStatus.SERVICE_UNAVAILABLE });
		return ResponseMapper.map({ data: response.details });
	}
}
