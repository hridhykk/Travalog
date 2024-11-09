import { Request,Response,NextFunction } from "express";
import {UserRepository} from '../../../infrastructure/repositories/UserRepository'
import {FetchUsersUseCase,EditUserUseCase ,FetchVendorsUseCase ,EditVendorUseCase,UpdateVendorUseCase} from '../../../application/use-case/admin/FetchUsersUseCase'
import { VendorRepository } from "../../../infrastructure/repositories/VendorRepository";


export class AdminUserController{

  private fetchUsersUseCase :FetchUsersUseCase ;
  private editUserUseCase:EditUserUseCase 

  private fetchVendorsUseCase :FetchVendorsUseCase ;;
  private editVendorUseCase:EditVendorUseCase
  private updatevendorusecase:UpdateVendorUseCase
  constructor(){
    const userRepository = new UserRepository();
    const vendorRepository = new VendorRepository()
    this.fetchUsersUseCase  = new FetchUsersUseCase (userRepository );
   this.editUserUseCase = new EditUserUseCase(userRepository);

  this.fetchVendorsUseCase   = new FetchVendorsUseCase  (vendorRepository);
   this.editVendorUseCase = new EditVendorUseCase(vendorRepository);
   this.updatevendorusecase = new UpdateVendorUseCase(vendorRepository)
  }

  fetchUser = async(req:Request,res:Response):Promise<void>=>{
    try{

      const result = await this.fetchUsersUseCase .execute();
      console.log(result)
      res.status(result.status === 'success' ? 200 : 404).json({
        status: result.status,
        message: result.message,
        users: result.status === 'success' ? result.users : undefined,
       
      });
    }catch(error){

      res.status(500).json({ 
        status: "error", 
        message: error instanceof Error ? error.message : "An unexpected error occurred" 
      });

}  
}

editUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, is_blocked, userId } = req.body;
    console.log(req.body)
    const result = await this.editUserUseCase.execute(
      name,
      userId,
      is_blocked
    );

    res.status(200).json({
      status: result.status,
      message: result.message,
      user:result.user
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    });
  }
};

fetchVendor = async(req:Request,res:Response):Promise<void>=>{
  try{

    const result = await this.fetchVendorsUseCase .execute()
    console.log(result)
    res.status(result.status === 'success' ? 200 : 404).json({
      status: result.status,
      message: result.message,
      vendors: result.status === 'success' ? result.vendors : undefined,
     
    });
  }catch(error){

    res.status(500).json({ 
      status: "error", 
      message: error instanceof Error ? error.message : "An unexpected error occurred" 
    });

}  
}


editVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, is_blocked, vendorId } = req.body;

    console.log(req.body.is_blocked,req.body.vendorId);

    const result = await this.editVendorUseCase.execute(
      name,
      vendorId,
      is_blocked
    );
console.log(result)
    res.status(200).json({
      status: result.status,
      message: result.message,
      vendor:result.vendor
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    });
  }
};


updateVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vendorId, is_Verified } = req.body;
    console.log(req.body)
    const result = await this.updatevendorusecase.execute(vendorId, is_Verified);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    });
  }
};
 }