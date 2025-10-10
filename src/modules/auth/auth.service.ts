import { Injectable } from '@nestjs/common';
import { JwtService, type JwtSignOptions, type JwtVerifyOptions } from '@nestjs/jwt';
import { TokenType } from '@/shared/enums/auth.enum';
import { env } from '@/config/env.config';

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) {}
	private readonly JWT_SECRET: Record<TokenType, string> = {
		[TokenType.ACCESS]: env.JWT_ACCESS_SECRET,
		[TokenType.REFRESH]: env.JWT_REFRESH_SECRET,
	};
	private readonly JWT_EXP: Record<TokenType, number> = {
		[TokenType.ACCESS]: env.JWT_ACCESS_EXP,
		[TokenType.REFRESH]: env.JWT_REFRESH_EXP,
	};

	public async generateAuthTokens(userId: number) {
		const tokenId = Bun.randomUUIDv7();
		return Promise.all([
			this.signPayload({ userId, tokenId }, TokenType.ACCESS),
			this.signPayload({ userId, tokenId }, TokenType.REFRESH),
		]);
	}

	public async signPayload(payload: { userId: number; tokenId: string }, type: TokenType): Promise<string> {
		const options = { secret: this.JWT_SECRET[type], expiresIn: this.JWT_EXP[type] } satisfies JwtSignOptions;
		return this.jwtService.signAsync(payload, options);
	}

	public async verifyToken(token: string, type: TokenType) {
		try {
			const options = { secret: this.JWT_SECRET[type] } satisfies JwtVerifyOptions;
			return (await this.jwtService.verifyAsync(token, options)) as { userId: number; tokenId: string };
		} catch {
			return undefined;
		}
	}
}
