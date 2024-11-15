export default interface JwtPayloadDto {
  username: string;
  id: number;
  iat: number;
  exp: number;
}
