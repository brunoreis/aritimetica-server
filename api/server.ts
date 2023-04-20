import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { createContext } from './createContext'
export const server = new ApolloServer({ 
    schema, 
    context: createContext, 
    introspection: true
 })