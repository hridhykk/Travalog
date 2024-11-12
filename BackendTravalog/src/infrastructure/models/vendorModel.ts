import mongoose,{Schema} from "mongoose";
import { IVendor } from "../../domain/entities/vendorentities";

const vendorSchema = new Schema<IVendor>({
  name:{
    type:String,
    required:true,
  },
  email:{
  type:String,
  required:true
  },
  mobile:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  address:{
type:String
  },
  city:{
    type:String
  },
  description:{
tyep :String
  },
  is_blocked:{
    type:Boolean,
    default:false
  },
  is_Verified:{
    type:Boolean,
    default:false
  }
},{versionKey:false,timestamps:true})

export const VendorModel = mongoose.model<IVendor>('Vendor',vendorSchema)