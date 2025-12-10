import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  app.use(
    graphqlUploadExpress({
      maxFileSize: 1000000,
      maxFiles: 5,
      overrideSendResponse: false,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
