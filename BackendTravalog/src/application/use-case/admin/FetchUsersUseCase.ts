

import { IUserRepository } from "../../../domain/interfaces/repositories/iuserRepository";
import { IUser } from "../../../domain/entities/userentities";
import { IVendor } from "../../../domain/entities/vendorentities";
import { boolean } from "zod";
import { IVendorRepository } from "../../../domain/interfaces/repositories/iVendorRepository";
export interface FetchUsersResponse {
  status: string;
  message: string;
  users: IUser[];
}

export class FetchUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<FetchUsersResponse> {
    try {
      const users = await this.userRepository.findAllUsers();
      
      return {
        status: "success",
        message: "Users fetched successfully",
        users: users
      };
    } catch (error) {
      throw {
        status: "error",
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
}



interface EditUserResponse {
  status: string;
  message: string;
  user?:any
}
export class EditUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    name: string,
    userId: string,
    is_blocked: boolean
  ): Promise<EditUserResponse> {
    try {
      const updatedUser = await this.userRepository.updateUser(userId, {
        name,
        is_blocked
      });

      if (!updatedUser) {
        return {
          status: "error",
          message: "User not found"
        };
      }

      return {
        status: "success",
        message: "User updated successfully",
        user:updatedUser,
      };
    } catch (error) {
      throw {
        status: "error",
        message: "Failed to update user",
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
}



export interface FetchVendorsResponse {
  status: string;
  message: string;
  vendors: IVendor[];
}

export class FetchVendorsUseCase {
  constructor(private readonly vednorRepsository:IVendorRepository) {}

  async execute(): Promise<FetchVendorsResponse > {
    try {
      const Vendors = await this.vednorRepsository.findAllVendors();
      
      return {
        status: "success",
        message: "Users fetched successfully",
        vendors: Vendors
      };
    } catch (error) {
      throw {
        status: "error",
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
}



interface EditVendorResponse {
  status: string;
  message: string;
  vendor?:any
}
export class EditVendorUseCase {
  constructor(private readonly vednorRepsository:IVendorRepository) {}

  async execute(
    name: string,
    vendorId: string,
    is_blocked: boolean
  ): Promise<EditVendorResponse > {
    try {
      const updatedUser = await this.vednorRepsository.updateVendor(vendorId, {
        name,
        is_blocked
      });

      if (!updatedUser) {
        return {
          status: "error",
          message: "User not found"
        };
      }

      return {
        status: "success",
        message: "User updated successfully",
        vendor:updatedUser,
      };
    } catch (error) {
      throw {
        status: "error",
        message: "Failed to update user",
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
}

interface UpdateVendorResponse {
  status: string;
  message: string;
  
}

export class UpdateVendorUseCase {
  constructor(private readonly vednorRepository: IVendorRepository) {}

  async execute(vendorId: string, is_verified: boolean): Promise<UpdateVendorResponse> {
    try {
      const result = await this.vednorRepository.updateVendorVerification(vendorId, is_verified);
      return result;
    } catch (error) {
      throw {
        status: "error",
        message: "Failed to update vendor verification",
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
}