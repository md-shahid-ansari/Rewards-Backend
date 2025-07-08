import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model, Document, Types } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { RewardsService } from '../rewards/rewards.service';

type UserDocument = Document<unknown, any, User> & User & { _id: Types.ObjectId };

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly rewardsService: RewardsService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
    });

    if (dto.points && dto.points > 0) {
      await this.rewardsService.addPoints(user._id.toString(), dto.points);
    }

    return {
      user,
      totalPoints: await this.rewardsService.getUserPoints(user._id.toString()),
    };
  }

  async getAllUsers() {
    return this.userModel.find();
  }
}
