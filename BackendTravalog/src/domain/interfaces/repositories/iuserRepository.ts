import { IUser } from "../../entities/userentities";


export interface IUserRepository {
  FindByEmail(email: string): Promise<IUser | null>;
  create(user: IUser): Promise<IUser>;
  findAllUsers(): Promise<IUser[]>;
  updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null>;
  updatePasswordByEmail(email: string, newPassword: string): Promise<IUser | null>;
}

