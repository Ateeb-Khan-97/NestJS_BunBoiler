import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
	public async promise<T>(pms: Promise<T>) {
		try {
			return [null, await pms] as const;
		} catch (error) {
			return [error, null] as const;
		}
	}

	public omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
		const result = { ...obj };
		keys.forEach((key) => {
			delete result[key];
		});
		return result;
	}

	public uuid() {
		return Bun.randomUUIDv7().replaceAll('-', '');
	}

	public isEmptyObject(obj: Record<string, unknown>): boolean {
		return Object.keys(obj).length === 0;
	}

	public sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
