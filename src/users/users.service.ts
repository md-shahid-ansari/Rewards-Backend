import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model, Document, Types } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { RewardsService } from '../rewards/rewards.service';
import { TransactionsService } from '../transactions/transactions.service';

type UserDocument = Document<unknown, any, User> & User & { _id: Types.ObjectId };

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly rewardsService: RewardsService,
    private readonly transactionsService: TransactionsService,
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

  async addPointsToUser(userId: string, points: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await this.rewardsService.addPoints(userId, points);

    await this.transactionsService.logTransaction({
      userId,
      category: 'admin',
      pointsEarned: points,
    });

    return {
      message: `Added ${points} points to user ${user.name}`,
    };
  }
}
