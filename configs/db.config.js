const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost/clean-closet";

exports.connectDB = () =>
mongoose.connect(process.env.MONGO_ATLAS_URI || mongoURI, {


  useCreateIndex:true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then((x) => {
  console.log(
    `✅✅✅ Connected to Mongo! Database name: "${x.connections[0].name}"`
  );
})
.catch((err) => {
  console.error("Error connecting to mongo", err);
});
 