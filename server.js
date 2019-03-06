const path = require("path");

const express = require("express");
const graphqlHttp = require("express-graphql");
const bodyParser = require("body-parser");
const cors = require("cors");

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

const app = express();

//app.use(bodyParser.urlencoded()); //x-www-form-urlencoded <form>
app.use(bodyParser.json()); //application/json
app.use(cors());

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    graphiql: true
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
