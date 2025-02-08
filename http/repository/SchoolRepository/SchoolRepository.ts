import HttpClient from "@/http/client/HttpClient";
import { ISchoolCreateRequest } from "@/http/Models/Requests/School/ISchoolCreateRequest";
import { ApiResponse } from "@/http/Models/Responses/ApiResponse";
import { ISchoolCreateResponse } from "@/http/Models/Responses/School/ISchoolCreateResponse";
import TransformResponse from "@/http/Utils/transform";

export class SchoolRepository extends HttpClient {
  public async createSchool(
    item: ISchoolCreateRequest
  ): Promise<ApiResponse<ISchoolCreateResponse>> {
    const instance = await this.createInstance();
    const result = await instance
      .post("http://10.0.2.2:3001/school/", item)
      .then(TransformResponse);

    return result as ApiResponse<ISchoolCreateResponse>;
  }
}
