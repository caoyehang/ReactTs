import { request } from "../request";

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  userId: string;
  username: string;
}

export function login(data: LoginParams) {
  return request<LoginResult>("/login", {
    method: "POST",
    data,
  });
}
