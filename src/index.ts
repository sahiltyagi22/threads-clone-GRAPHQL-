import express from 'express'
import { ApolloServer } from '@apollo/server'
import{expressMiddleware} from '@apollo/server/express4'


async function init() {
const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(express.json())

// graphql server 
const server= new ApolloServer({
    typeDefs : `
    type Query {
        hello : String,
        say(name : String) : String
    }
    `,
    resolvers : {
        Query : {
            hello : ()=> "hello there i am graphql",
            say:(_ , {name}) =>  `my name is ${name}`
        }
    }
})

// starting the graphql server
await server.start()

app.get('/',(req,res)=>{
res.json({
    message : 'this is the homepage'
})
})

app.use('/graphql' , expressMiddleware(server))

app.listen(PORT , ()=>{
    console.log(`server is started at port ${PORT}`);
    
})
}

init()