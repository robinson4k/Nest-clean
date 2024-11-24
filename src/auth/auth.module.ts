import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthenticateController } from "src/controllers/authenticate.controller";
import { Env } from "src/env";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService<Env, true>) {
        const privateKey = config.get('JWT_PRIVATE_KEY', {infer: true})
        const publicKey = config.get('JWT_PUBLIC_KEY', {infer: true})
        return {
          signOptions: {
            algorithm: 'RS256'
          },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64')
        }
      }
    })
  ],
  providers: [JwtStrategy],
  controllers: [AuthenticateController], // Registre o AuthenticateController aqui
  exports: [JwtModule],
})
export class AuthModule {}