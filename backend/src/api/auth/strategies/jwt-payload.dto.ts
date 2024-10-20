export default interface JwtPayloadDto {
  email: string;
  user_id: number;
  iat: number;
  exp: number;
}
