import { Injectable } from '@nestjs/common';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Injectable()
export class GraphQLConfigService {
  createGqlOptions(): ApolloDriverConfig {
    return {
      autoSchemaFile: true,
      sortSchema: true,
      playground: false,
      context: ({ req }) => ({ req }),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    };
  }
}