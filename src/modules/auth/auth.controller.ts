import {
	BadRequestException,
	ConflictException,
	Controller,
	HttpStatus,
	Logger,
	Body,
	Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@/shared/decorators/public.decorator';
import { SigninDto, SignupDto } from './dto/auth.dto';
import { RefreshAccessDto } from './dto/refresh.dto';
import { ResponseMapper } from '@/shared/mappers/response.map';
import { UserService } from '../users/user.service';
import { CommonService } from '@/shared/services/common.service';

@ApiTags('Auth')
@Controller('/api/auth')
export class AuthController {
	private readonly logger = new Logger(AuthController.name);
	constructor(
		private readonly userService: UserService,
		private readonly commonService: CommonService,
	) {}

	@Public()
	@Post('sign-in')
	async signinHandler(@Body() body: SigninDto) {
		const user = await this.userService.findOneBy({ email: body.email });
		if (!user) throw new BadRequestException('Invalid credentials');
		if (!(await Bun.password.verify(body.password, user.password)))
			throw new BadRequestException('Invalid credentials');

		const userWithoutPass = this.commonService.omit(user, ['password']);
		return ResponseMapper.map({ data: userWithoutPass });
	}

	@Public()
	@Post('sign-up')
	async signupHandler(@Body() body: SignupDto) {
		const emailCheck = await this.userService.findOneBy({ email: body.email });
		if (emailCheck) throw new ConflictException('Email already registered');

		body.password = await Bun.password.hash(body.password);
		const user = this.userService.create(body);
		const [error] = await this.userService.save(user);
		if (error) {
			this.logger.error(error.message);
			throw new BadRequestException('Failed to register, Please try later');
		}

		return ResponseMapper.map({
			message: 'User registered successfully',
			status: HttpStatus.CREATED,
		});
	}

	@Public()
	@Post('refresh-access')
	async refreshAccessHandler(@Body() body: RefreshAccessDto) {
		return ResponseMapper.map({ data: body });
	}

	@Post('sign-out')
	@ApiBearerAuth('access-token')
	async signoutHandler() {
		return ResponseMapper.map({ message: 'Successfully signed out' });
	}
}
