export interface IUser {
  _id?:string;
  name:string;
  email:string;
  uid?:string;
  mobile?:string;
  password?:string;
  is_blocked?:boolean;
  is_googleuser?:boolean,
  is_verified?:boolean,
  photoUrl?:string;

}