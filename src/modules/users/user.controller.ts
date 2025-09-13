import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { CommonService } from '@/shared/services/common.service';
import { ResponseMapper } from '@/shared/mappers/response.map';

@ApiTags('Users')
@Controller('/api/users')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly commonService: CommonService,
	) {}

	@ApiBearerAuth('access-token')
	@Get('/profile')
	public async getProfileHandler(@CurrentUser() userId: number) {
		const user = await this.userService.findOneBy({ id: userId });
		if (!user || user.deletedAt) throw new NotFoundException('User not found');

		const userWithoutPassword = this.commonService.omit(user, ['password']);
		return ResponseMapper.map({ data: userWithoutPassword });
	}
}
