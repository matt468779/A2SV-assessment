import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { User } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { DataSource } from 'typeorm';
import { Post } from './entities/post.entity';
import { Logger } from '@nestjs/common';

describe('PostService', () => {
  let service: PostService;
  // let postRepository: PostRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService],
      imports: [],
    }).compile();

    service = module.get<PostService>(PostService);

    const testConnection = 'testConnection';
    const dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [User, Post],
      synchronize: true,
      logging: false,
      name: testConnection,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a post', () => {
      const user = new User();
      user.name = 'test';
      user.email = 'test@gmail.com';

      const createPostDto = new CreatePostDto();
      createPostDto.content = 'test content';
      createPostDto.title = 'test title';

      const res = service.create(createPostDto, user);
      Logger.log(res);
    });
  });
});
