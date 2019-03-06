const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');


// temporary hard coded data
/*
const customers = [
    {id:'1',name:'John Doe',age:35},
    {id:'2',name:'Steve Smith',age:25},
    {id:'3',name:'Sara Williams',age:32},
];
*/


const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields:()=>({
        id:{type:GraphQLString},
        name:{type:GraphQLString},        
        age:{type:GraphQLInt}        
    })
});

//Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        customer:{
            type:CustomerType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parent,args){
                return axios.get(`http://localhost:3000/customers/${args.id}`)
                    .then(res=>res.data)
                    .catch(err=>console.log(err));
            }
        },
        customers:{
            type: new GraphQLList(CustomerType),
            resolve(parent,args){
                return axios.get('http://localhost:3000/customers')
                    .then(res=>res.data)
                    .catch(err=>console.log(err));
            }
        }
    }

});


const mutationCustomer = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addCustomer:{
            type:CustomerType,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent,args){
                return axios.post('http://localhost:3000/customers',{
                    name:args.name,
                    age:args.age
                })
                .then(res=>res.data)
                .catch(err=>console.log(err));
            }
        },
        deleteCustomer:{
            type:CustomerType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}     
            },
            resolve(parent,args){
                return axios.delete(`http://localhost:3000/customers/${args.id}`)
                .then(res=>res.data)
            }
        },
        editCustomer:{
            type:CustomerType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}, 
                name:{type: GraphQLString},     
                age:{type: GraphQLInt}   
            },
            resolve(parent,args){
                return axios.patch(`http://localhost:3000/customers/${args.id}`,args)
                .then(res=>res.data)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutationCustomer
});