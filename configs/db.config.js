const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost/clean-closet";


// mongoose
//   .connect('mongodb://localhost/clean-closet', { 
//     useCreateIndex: true,  
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
//   })
//   .then(x => {
//     console.log(`✅✅✅ Connected to Mongo! Database name: "${x.connections[0].name}"`)
//   })
//   .catch(err => {
//     console.error('Error connecting to mongo', err)
//   });

exports.connectDB = () =>
mongoose.connect(process.env.MONGO_ATLAS_URI || mongoURI, {
  useCreateIndex:true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then((x) => {
  console.log(
    `Connected to Mongo! Database name: "${x.connections[0].name}"`
  );
})
.catch((err) => {
  console.error("Error connecting to mongo", err);
});
 
