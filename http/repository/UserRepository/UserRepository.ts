import HttpClient from "@/http/client/HttpClient";
import { ICreateUserRequest } from "@/http/Models/Requests/User/ICreateUserRequest";
import { IUpdateUserRequest } from "@/http/Models/Requests/User/IUpdateUserRequest";
import { ApiResponse } from "@/http/Models/Responses/ApiResponse";
import { IGetUserAssocationResponse } from "@/http/Models/Responses/Users/GetUserAssociationResponse";
import TransformResponse from "@/http/Utils/transform";

class UserRepository extends HttpClient {
  apiUrl: string;

  constructor() {
    super();
    this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
  }

  public async GetUsersBySchoolId(
    schoolId: string,
    page: number,
    limit: number
  ) {
    const instance = await this.createInstance();

    const result = await instance
      .get(
        `${this.apiUrl}/association/user/school/${schoolId}?page=${page}&limit=${limit}`
      )
      .then(TransformResponse);

    const castResult = result as ApiResponse<IGetUserAssocationResponse>;

    if (castResult.data != null || castResult.data != undefined) {
      castResult.data!.hasMore = page < castResult.data?.totalPages!;
    }

    return castResult;
  }

  public async CreateUserAssociation(data: ICreateUserRequest) {
    const instance = await this.createInstance();

    const result = await instance
      .post(`${this.apiUrl}/user/createUserAndAssociation`, data)
      .then(TransformResponse);

    return result as ApiResponse<any>;
  }

  public async UpdateUser(id: string, data: IUpdateUserRequest) {
    const instance = await this.createInstance();

    const result = await instance
      .put(`${this.apiUrl}/user/${id}`, data)
      .then(TransformResponse);

    return result as ApiResponse<any>;
  }

  public async DeleteUser(id: string) {
    const instance = await this.createInstance();

    const result = await instance
      .delete(`${this.apiUrl}/association/${id}`)
      .then(TransformResponse);

    return result as ApiResponse<any>;
  }
}

export default UserRepository;
