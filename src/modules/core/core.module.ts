import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { GraphQLConfigService } from './graphql/graphql.config-service';
import { MongooseConfigService } from './mongoose/mongoose.config-service';
import { JwtConfigService } from './jwt/jwt.config-service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GraphQLConfigService,
    }),

    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
  ],
})
export class CoreModule {}
