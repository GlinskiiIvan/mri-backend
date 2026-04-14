import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './entities/post.entity';
import { FilesService } from 'src/files/files.service';
import { FileTypesEnum } from 'src/enums/file-types.enum';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private fileService: FilesService,
  ) {}

  async create(req, createPostDto: CreatePostDto, image) {
    const { user } = req;
    const fileName = await this.fileService.createStatic(image, FileTypesEnum.image);
    const post = await this.postRepository.create({
      ...createPostDto,
      userId: user.id,
      image: fileName,
    });
    return post;
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
