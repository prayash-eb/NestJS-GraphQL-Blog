import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt"

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(private readonly configService: ConfigService) { }

    createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
        return {
            secret: this.configService.getOrThrow("JWT_SECRET"),
            signOptions: {
                expiresIn: this.configService.getOrThrow("JWT_SECRET_EXPIRY_MS")
            }
        }
    }
}