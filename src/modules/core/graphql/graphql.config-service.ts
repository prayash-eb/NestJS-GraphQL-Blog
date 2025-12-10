import { Injectable } from '@nestjs/common';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import graphqlUploadExpress from 'graphql-upload-ts';

@Injectable()
export class GraphQLConfigService {
  createGqlOptions(): ApolloDriverConfig {
    return {
      autoSchemaFile: true,
      sortSchema: true,
      playground: false,
      context: ({ req }) => ({ req }),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      formatError: (error) => {
        const originalError = error.extensions
          ?.originalError as any;

        if (!originalError) {
          return {
            message: error.message,
            code: error.extensions?.code,
          };
        }
        return {
          message: originalError.message,
          code: error.extensions?.code,
        };
      },
    };
  }
}