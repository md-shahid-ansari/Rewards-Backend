import { Controller, Post, Get, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Param, ParseIntPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post(':id/points')
  async addPoints(
    @Param('id') userId: string,
    @Body('points', ParseIntPipe) points: number,
  ) {
    return this.usersService.addPointsToUser(userId, points);
  }
}
