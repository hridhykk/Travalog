import { IVendor } from "../../entities/vendorentities";

export interface IVendorRepository{
  FindByEmail(email:string): Promise <IVendor|null>;
  create(user:IVendor):Promise<IVendor>;
  findAllVendors(): Promise<IVendor[]>;
  updateVendor(userId: string, userData: Partial<IVendor>): Promise<IVendor | null>;
  updateVendorVerification(vendorId: string, is_Verified: boolean): Promise<{ status: string; message: string; vendor?: IVendor }>;
}

