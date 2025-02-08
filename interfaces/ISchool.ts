import IUserSchoolAssociation from "./IUserSchoolAssociation";

export default interface ISchool {
  id?: string;
  name: string;
  createdAt?: Date;
  status: boolean;
  updatedAt?: Date;
  userSchoolAssociation?: IUserSchoolAssociation[];
}
