import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UserModule,
    PostModule
  ],
  providers: [],
})
export class AppModule { }
