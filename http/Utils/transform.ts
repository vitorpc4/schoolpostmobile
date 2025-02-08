import { AxiosResponse } from "axios";
import { ApiResponse } from "../Models/Responses/ApiResponse";

const TransformResponse = (
  response: AxiosResponse
): Promise<ApiResponse<any>> => {
  return new Promise((resolve: any) => {
    const result: ApiResponse<any> = {
      data: response.data,
      succeeded:
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204,
      errors: response.data.errors,
    };
    resolve(result);
  });
};

export default TransformResponse;
