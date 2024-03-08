import { pathToFileURL } from "node:url";
import UserServices , {creteUserPayload} from "../../services/user";

const queries = {
  getUserToken : async (_:any, payload : {email :string , password:string}) =>{

    const token = await UserServices.getUserToken({email : payload.email , password : payload.password})

    return token
  },

  getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
    if (await context && await context.user) {
      const id = context.user.id;
      const user = await UserServices.getUserById(id);
      return user;
    }
    console.log(context);
    
    throw new Error("I dont know who are you");
  },
};



const mutations = {
  createUser: async (_: any, payload:creteUserPayload) => {
    const user  = await UserServices.createUsers(payload)
    return user.id
    
    
  },
};

export const resolvers = { queries, mutations };
