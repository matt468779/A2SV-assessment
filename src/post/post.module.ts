import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
  imports: [TypeOrmModule.forFeature([Post]), UserModule],
})
export class PostModule {}
