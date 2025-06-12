import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/secrets';

export const checkUser = (token: string) : string | null =>{
  try{
    const decodedToken = jwt.verify(token, JWT_SECRET);
  
  if(typeof decodedToken == "string"){
    return null;
  }
  if(!decodedToken || !decodedToken.userId){
    return null;
  }
  return decodedToken.userId;

  } catch (err){
    return null;
  }
  return null;
}