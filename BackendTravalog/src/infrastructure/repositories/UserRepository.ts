import { IUserRepository } from "../../domain/interfaces/repositories/iuserRepository";
import { IUser } from "../../domain/entities/userentities";
import { UserModel } from "../models/userModel";


export class UserRepository implements IUserRepository {
  async FindByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async create(user: IUser): Promise<IUser> {
    return UserModel.create(user);
  }

  async findAllUsers(): Promise<IUser[]> {
    return UserModel.find().lean();  // Using lean() for better performance
  }

  
  async updateUser(userId: string, userData: { name: string; is_blocked: boolean }): Promise<IUser | null> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            name: userData.name,
            is_blocked: userData.is_blocked
          }
        },
        { 
          new: true,
          runValidators: true 
        }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
  async updatePasswordByEmail(email: string, newPassword: string): Promise<IUser | null> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email },
        {
          $set: {
            password: newPassword
          }
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}