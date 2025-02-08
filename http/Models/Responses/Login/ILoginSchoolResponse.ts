import { TypeUser } from "@/Enum/TypeUser";

export default interface ILoginSchoolResponse {
  IUserAssociationId: number;
  admin: boolean;
  name: string;
  schoolId: string;
  typeUser: TypeUser;
}
