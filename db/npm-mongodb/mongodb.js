const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useUnifiedTopology: true },
  (error, client) => {
    //Handle Error
    if (error) console.log(error);

    //Connect to Dababase
    const db = client.db(databaseName);

    //Test CRUD
    db.collection("Users").updateOne(
      { birdYear: 1998 },
      {
        $set: {
          birdYear: 2000,
        },
      }
    );
  }
);

//    /Users/admin/mongodb/bin/mongod.exe --dbpath=/Users/admin/mongodb-data
