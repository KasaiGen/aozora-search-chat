declare module 'axios' {
  export interface AxiosRequestConfig {
    params?: any;
    responseType?: string;
  }
  
  export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
  }
  
  export function get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  export function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  export function delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  
  const axios: {
    get: typeof get;
    post: typeof post;
    put: typeof put;
    delete: typeof delete;
  };
  
  export default axios;
}

