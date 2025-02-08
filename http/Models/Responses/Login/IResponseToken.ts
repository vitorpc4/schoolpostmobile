import ILoginSchoolResponse from "./ILoginSchoolResponse";

export default interface IResponseToken {
  sub: number;
  userName: string;
  schools: ILoginSchoolResponse[];
}
