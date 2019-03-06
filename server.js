const path = require("path");

const express = require("express");
const graphqlHttp = require("express-graphql");
const bodyParser = require("body-parser");

/*
import mongoose from 'mongoose';
import bluebirdPromise from 'bluebird';
// -------------MongoDB setups-------------
mongoose.Promise = bluebirdPromise; // overwrite default mongoose promise library into bluebird promise library
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => console.log(err));
mongoose.set('useCreateIndex', true);

// -----------------------------------------
*/

const graphqlSchema = require("./graphql/schema");

//const graphqlResolver = require('./graphql/resolvers');

//const auth = require('./middleware/auth');
const app = express();

//app.use(bodyParser.urlencoded()); //x-www-form-urlencoded <form>
app.use(bodyParser.json()); //application/json


// install npm package cors();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type",
    "Authorization"
  );
  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});

// app.use(auth); //authorization midleware

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    //rootValue:graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) return err;

      const data = err.originalError.data;
      const message = err.message || "An error occured";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    }
  })
);

/*
app.use(express.static('public'));
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'public',index.html));
});
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
