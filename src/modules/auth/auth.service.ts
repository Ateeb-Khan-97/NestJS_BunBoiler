import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from '@/shared/enums/auth.enum';
import { env } from '@/config/env.config';

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) {}

	public async generateAuthTokens(userId: number) {
		const tokenId = Bun.randomUUIDv7();
		return Promise.all([
			this.signPayload({ userId, tokenId }, TokenType.ACCESS),
			this.signPayload({ userId, tokenId }, TokenType.REFRESH),
		]);
	}

	public async signPayload(payload: { userId: number; tokenId: string }, type: TokenType) {
		let secret: string;
		let expiresIn: number;
		switch (type) {
			case TokenType.ACCESS: {
				secret = env.JWT_ACCESS_SECRET;
				expiresIn = env.JWT_ACCESS_EXP;
				break;
			}
			case TokenType.REFRESH: {
				secret = env.JWT_REFRESH_SECRET;
				expiresIn = env.JWT_REFRESH_EXP;
				break;
			}
		}

		const token = await this.jwtService.signAsync(payload, { secret, expiresIn });
		return token;
	}

	public async verifyToken(token: string, type: TokenType) {
		let secret: string;
		switch (type) {
			case TokenType.ACCESS: {
				secret = env.JWT_ACCESS_SECRET;
				break;
			}
			case TokenType.REFRESH: {
				secret = env.JWT_REFRESH_SECRET;
				break;
			}
		}

		try {
			const payload = (await this.jwtService.verifyAsync(token, { secret })) as {
				userId: number;
				tokenId: string;
			};
			return payload;
		} catch {
			return undefined;
		}
	}
}
