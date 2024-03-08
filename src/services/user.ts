import exp from "node:constants";
import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";
import { error } from "node:console";
import jwt from 'jsonwebtoken'

export interface creteUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface getUserPyload {
   email : string ,
   password : string
}

const JWTSECRET = "thisisasecret"

class UserServices {

  public static async createUsers(payload: creteUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString('hex');
    const hashPassword = UserServices.generateHashPassword(password, salt)

    console.log(hashPassword);
    

    const user = prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashPassword,
      },
    });
    return user
  }

  public static getUserById(id: string) {
    return prismaClient.user.findUnique({ where: { id } });
  }

  public static decodeUser(token:string){
    console.log(token , JWTSECRET);
    
    return jwt.verify(token , JWTSECRET)
  }

  private static getUserByEmail(email:string){
    return prismaClient.user.findUnique({where : {email}})
  }

  private static generateHashPassword(password:string , salt:string){
    const hashPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

      return hashPassword
  }

  public static async getUserToken(payload : getUserPyload){
    const {email , password} = payload

    const user  = await UserServices.getUserByEmail(email)

    if(!user){
      throw new Error('no user found with this email')
    }

    const salt = user.salt
    const hashPassword = UserServices.generateHashPassword(password, salt)

    console.log(user.salt);
    console.log(user.password);
    console.log(hashPassword);
    
    

    if(hashPassword !== user.password){
      throw new Error('incorrect password')
    }
    
    const token  = jwt.sign({id:user.id , email:user.email} , JWTSECRET  )
    return token
    
  }
}

export default UserServices