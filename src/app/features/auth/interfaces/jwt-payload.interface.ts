export interface JwtPayload {
  id: number;
  email: string;
  role: string;
  exp: number;
  iat: number;
}
