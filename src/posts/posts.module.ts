import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { FilesModule } from 'src/files/files.module';
import { Post } from './entities/post.entity';

@Module({
  controllers: [PostsController],
  imports: [SequelizeModule.forFeature([Post, User]), FilesModule],
  providers: [PostsService],
})
export class PostsModule {}
