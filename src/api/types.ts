import type {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  Method,
} from "axios";

type Primitive = string | number | boolean | null | undefined;

export type QueryValue = Primitive | Primitive[];

export type FormDataValue = Primitive | Blob;

export type QueryParams = Record<string, QueryValue>;

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message?: string;
  msg?: string;
}

export interface RequestConfig extends Omit<
  AxiosRequestConfig,
  "params" | "data" | "url" | "method"
> {
  method?: Method;
  baseURL?: string;
  query?: QueryParams;
  data?: unknown;
  silentError?: boolean;
  withToken?: boolean;
}

export interface RequestRuntimeConfig<
  D = unknown,
> extends AxiosRequestConfig<D> {
  silentError?: boolean;
  withToken?: boolean;
}

export interface InternalRequestRuntimeConfig<
  D = unknown,
> extends InternalAxiosRequestConfig<D> {
  silentError?: boolean;
  withToken?: boolean;
}
