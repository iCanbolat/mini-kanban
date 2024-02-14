export type ApiResponseType<T = void> = {
  success: boolean;
  message?: string;
  error?: any;
  data?: T | undefined;
  boardId?:string
};
