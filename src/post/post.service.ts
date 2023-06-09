import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    const newPost = await this.postRepository.create({
      ...createPostDto,
      user: user,
    });
    await this.postRepository.save(newPost);
    return newPost;
  }

  async findAll() {
    try {
      return await this.postRepository
        .createQueryBuilder('post')
        .leftJoin('post.user', 'user')
        .addSelect('user.id')
        .addSelect('user.name')
        .addSelect('user.email')
        .getMany();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  findOne(id: number) {
    // return this.postRepository.findOne({ where: { id: id } });

    return this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .addSelect('user.id')
      .addSelect('user.name')
      .addSelect('user.email')
      .where('post.id = :id', { id: id })
      .getOne();
  }

  async findUserPosts(user: User) {
    if (!user) {
      return new BadRequestException("email doesn't exist");
    }

    try {
      return await this.postRepository.find({ where: { user: user } });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postRepository.update(id, updatePostDto);
  }

  remove(id: number) {
    return this.postRepository.delete(id);
  }
}
