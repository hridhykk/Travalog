import mongoose, { Schema } from "mongoose";
import { IUser } from "../../domain/entities/userentities";

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
   
    required: false  
  },
  password: {
    type: String,
   
    required: false  
  },
  is_blocked: {
    type: Boolean,
    default: false
  },
  is_googleuser: {
    type: Boolean,
    default: false
  },
  uid: {
    type: String
  },
  photoUrl: {
    type: String
  }
});

export const UserModel = mongoose.model<IUser>('User', userSchema);