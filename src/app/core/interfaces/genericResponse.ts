export interface GenericResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
  errors: string[];
  timestamp: string;
}