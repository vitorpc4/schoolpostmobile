import { IPostResponse } from "@/http/Models/Responses/Posts/IPostResponse";
import HttpClient from "../../client/HttpClient";
import { ApiResponse } from "../../Models/Responses/ApiResponse";
import TransformResponse from "../../Utils/transform";
import { IPostCreateRequest } from "@/http/Models/Requests/Posts/IPostCreateRequest";
import IPost from "@/interfaces/IPost";

class PostRepository extends HttpClient {
  apiUrl: string;

  constructor() {
    super();
    this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
  }

  public async GetPosts(
    page: number,
    limit: number,
    schoolId: string
  ): Promise<ApiResponse<IPostResponse>> {
    const instance = await this.createInstance();

    const result = await instance
      .get(`${this.apiUrl}/posts/?page=${page}&limit=${limit}`, {
        headers: {
          schoolId: schoolId,
        },
      })
      .then(TransformResponse);

    const castResult = result as ApiResponse<IPostResponse>;

    if (castResult.data != null || castResult.data != undefined) {
      castResult.data!.hasMore = page < castResult.data?.totalPages!;
    }

    return castResult;
  }

  public async GetPublishedPostsAndDrafts(
    page: number,
    limit: number,
    schoolId: string
  ): Promise<ApiResponse<IPostResponse>> {
    const instance = await this.createInstance();

    const result = await instance
      .get(`${this.apiUrl}/posts/allposts/?page=${page}&limit=${limit}`, {
        headers: {
          schoolId: schoolId,
        },
      })
      .then(TransformResponse);

    const castResult = result as ApiResponse<IPostResponse>;

    if (castResult.data != null || castResult.data != undefined) {
      castResult.data!.hasMore = page < castResult.data?.totalPages!;
    }

    return castResult;
  }

  public async CreatePost(
    post: IPostCreateRequest,
    schoolId: string
  ): Promise<ApiResponse<IPost>> {
    const instance = await this.createInstance();

    const result = await instance
      .post(`${this.apiUrl}/posts`, post, {
        headers: {
          schoolId: schoolId,
        },
      })
      .then(TransformResponse);

    return result as ApiResponse<IPost>;
  }

  public async UpdatePost(
    post: IPost,
    schoolId: string
  ): Promise<ApiResponse<IPost>> {
    const instance = await this.createInstance();

    const result = await instance
      .put(`${this.apiUrl}/posts/${post.id}`, post, {
        headers: {
          schoolId: schoolId,
        },
      })
      .then(TransformResponse);

    return result as ApiResponse<IPost>;
  }

  public async DeletePost(
    id: number,
    schoolId: string
  ): Promise<ApiResponse<IPost>> {
    const instance = await this.createInstance();

    const result = await instance
      .delete(`${this.apiUrl}/posts/${id}`, {
        headers: {
          schoolId: schoolId,
        },
      })
      .then(TransformResponse);

    return result as ApiResponse<IPost>;
  }
}

export default PostRepository;
