export interface IVendor {
  _id?:string;
  name:string;
  email:string;
  mobile?:string;
  address:string;
  city:string;
  description:string;
  documents?:string;
  password:string;
  is_blocked?:boolean;
  is_Verified?:boolean;
}