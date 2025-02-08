import { IRegisterResponse } from "@/http/Models/Responses/Login/IRegisterResponse";
import HttpClient from "../../client/HttpClient";
import { ILoginPost } from "../../Models/Requests/Login/ILoginPost";
import { ApiResponse } from "../../Models/Responses/ApiResponse";
import { IloginResponse } from "../../Models/Responses/Login/ILoginResponse";
import TransformResponse from "../../Utils/transform";
import IRegisterPost from "@/http/Models/Requests/Login/IRegisterPost";

class LoginRepository extends HttpClient {
  public async Login(data: ILoginPost): Promise<any> {
    const instance = await this.createInstance();

    const result = await instance
      .post(`http://10.0.2.2:3001/auth/login/`, data)
      .then(TransformResponse);

    return result as ApiResponse<IloginResponse>;
  }

  public async register(data: IRegisterPost): Promise<any> {
    const instance = await this.createInstance();
    const result = await instance
      .post(`http://10.0.2.2:3001/auth/register/`, data)
      .then(TransformResponse);
    return result as ApiResponse<IRegisterResponse>;
  }
}

export default LoginRepository;
