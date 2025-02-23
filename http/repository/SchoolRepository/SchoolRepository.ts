import HttpClient from "@/http/client/HttpClient";
import { ISchoolCreateRequest } from "@/http/Models/Requests/School/ISchoolCreateRequest";
import { ApiResponse } from "@/http/Models/Responses/ApiResponse";
import { ISchoolCreateResponse } from "@/http/Models/Responses/School/ISchoolCreateResponse";
import TransformResponse from "@/http/Utils/transform";

export class SchoolRepository extends HttpClient {
  apiUrl: string;

  constructor() {
    super();
    this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
  }

  public async createSchool(
    item: ISchoolCreateRequest
  ): Promise<ApiResponse<ISchoolCreateResponse>> {
    const instance = await this.createInstance();
    const result = await instance
      .post(`${this.apiUrl}/school/`, item)
      .then(TransformResponse);

    return result as ApiResponse<ISchoolCreateResponse>;
  }
}
