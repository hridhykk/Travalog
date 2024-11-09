import { IVendorRepository } from "../../../domain/interfaces/repositories/iVendorRepository";

import { hashPassword } from "../../../utils/passwordutils";





export class RegisterUseCase{
  constructor(private vendorRepository:IVendorRepository){

  }
  async execute(name:string,email:string,mobile:string,password:string){
    //const validation = userSchema.parse({name,email,mobile,password})
   

    const existingUser = await this.vendorRepository.FindByEmail(email);
    
    if (existingUser) {
     return {
      status:'false', message :"user already exists."
    }
      
    }

    const hasedpassword = await hashPassword(password)
    const user = await this.vendorRepository.create({name,email,password:hasedpassword,mobile});
    if(user){
      return {
        status:'success', message :"user Register successfully,Login Now"
       }
    }
  }
}



