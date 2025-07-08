import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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

  async createUser(dto: CreateUserDto): Promise<{
    message: string;
    data: {
      user: User;
      totalPoints: number;
    };
  }> {
    try {
      const existing = await this.userModel.findOne({ email: dto.email });
      if (existing) {
        throw new ConflictException({
          message: 'User with this email already exists',
        });
      }

      const user = await this.userModel.create({
        name: dto.name,
        email: dto.email,
      });

      if (dto.points && dto.points > 0) {
        await this.rewardsService.addPoints(user._id.toString(), dto.points);
      }

      const { points: totalPoints } = await this.rewardsService.getUserPoints(user._id.toString());

      return {
        message: 'User created successfully',
        data: {
          user,
          totalPoints,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to create user',
        error: error.message,
      });
    }
  }

  async getAllUsers(): Promise<{ message: string; data: User[] }> {
    try {
      const users = await this.userModel.find();
      return {
        message: 'User list fetched successfully',
        data: users,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to fetch users',
        error: error.message,
      });
    }
  }

  async addPointsToUser(
    userId: string,
    points: number,
  ): Promise<{ message: string; data: { userId: string; newPoints: number } }> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException({
          message: `User not found for ID: ${userId}`,
        });
      }

      const { data: updated } = await this.rewardsService.addPoints(userId, points);

      await this.transactionsService.logTransaction({
        userId,
        category: 'admin',
        pointsEarned: points,
      });

      return {
        message: `Added ${points} points to user ${user.name}`,
        data: {
          userId,
          newPoints: updated.totalPoints,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new BadRequestException({
        message: 'Failed to add points to user',
        error: error.message,
      });
    }
  }
}
