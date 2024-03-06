import { pathToFileURL } from "node:url";
import UserServices , {creteUserPayload} from "../../services/user";

const queries = {
  getUserToken : async (_:any, payload : {email :string , password:string}) =>{

    const token = await UserServices.getUserToken({email : payload.email , password : payload.password})

    return token
  }
};



const mutations = {
  createUser: async (_: any, payload:creteUserPayload) => {
    const user  = await UserServices.createUsers(payload)
    return user.id
    
    
  },
};

export const resolvers = { queries, mutations };
