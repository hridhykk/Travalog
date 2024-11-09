import bcrypt from'bcrypt';

export const hashPassword = async(password:string):Promise<string>=>{
return bcrypt.hash(password,10)
}

export const comprePassword= async(plainPassword:string,hashPassword:string):Promise<boolean>=>{
  return bcrypt.compare(plainPassword,hashPassword)
}