import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserFavoriteObra } from './entities/user-favorite-obra.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserFavoriteObra]) 
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] 
})
export class UsersModule {}