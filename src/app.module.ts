import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/entities/role.entity';
import { UserRoles } from './intermediary-tables/user-roles.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { FilesModule } from './files/files.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/entities/post.entity';
import { DoctorModule } from './doctor/doctor.module';
import { Doctor } from './doctor/entities/doctor.entity';
import { PatientModule } from './patient/patient.module';
import { Patient } from './patient/entities/patient.entity';
import { StudyModule } from './study/study.module';
import { Study } from './study/entities/study.entity';
import { SeriesModule } from './series/series.module';
import { Series } from './series/entities/series.entity';
import { PredictionRunModule } from './prediction-run/prediction-run.module';
import { PredictionRun } from './prediction-run/entities/prediction-run.entity';
import { PredictionModule } from './prediction/prediction.module';
import { Prediction } from './prediction/entities/prediction.entity';
import { InstanceImageModule } from './instance-image/instance-image.module';
import { InstanceImage } from './instance-image/entities/instance-image.entity';
import { IngestionModule } from './ingestion/ingestion.module';
import { InferenceModule } from './inference/inference.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User, 
        Role, 
        UserRoles, 
        Post,
        Doctor,
        Patient,
        Study,
        Series,
        PredictionRun,
        Prediction,
        InstanceImage,
      ],
      autoLoadModels: true,
    }),
    ServeStaticModule.forRoot(
      {
        rootPath: path.join(__dirname, '..', 'static', 'document'),
        serveRoot: '/document',
      },
      {
        rootPath: path.join(__dirname, '..', 'static', 'image'),
        serveRoot: '/image',
      },
      {
        rootPath: path.join(__dirname, '..', 'storage'),
        serveRoot: '/storage',
      },
    ),
    UsersModule,
    RolesModule,
    AuthModule,
    FilesModule,
    PostsModule,
    DoctorModule,
    PatientModule,
    StudyModule,
    SeriesModule,
    PredictionRunModule,
    PredictionModule,
    InstanceImageModule,
    IngestionModule,
    InferenceModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
