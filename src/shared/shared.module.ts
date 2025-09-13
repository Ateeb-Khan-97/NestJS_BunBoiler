import { Global, Module } from '@nestjs/common';
import { HttpService } from './services/http.service';
import { CommonService } from './services/common.service';

@Global()
@Module({
	providers: [CommonService, HttpService],
	exports: [CommonService, HttpService],
})
export class SharedModule {}
