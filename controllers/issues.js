const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;

const { DATABASE = 'mongodb://localhost:27017/projects_issues' } = process.env;

let client;

async function connectDB() {
  if (!client)
    client = await MongoClient.connect(DATABASE, { useNewUrlParser: true });
  return {
    db: client.db(),
    client: client
  };
}
module.exports.close = async function close() {
  if (client) client.close();
  client = undefined;
};
//CRUD: Create issue
async function create(projectName, req = {}) {
  const date = new Date();
  const issue = { ...req, created_on: date, updated_on: date, open: true };
  const { db, client } = await connectDB();
  const collection = db.collection(projectName);
  const result = await collection.insertOne(issue);
  return result.ops[0];
}
module.exports.create = create;

//CRUD: find
async function find(projectName, filter={}) {
 if( filter.open) filter.open = filter.open === 'true' ? true: false;
  const { db, client } = await connectDB();
  const collection = db.collection(projectName);
  const cursor = await collection.find(filter);
 
  return cursor;
}
module.exports.find = find;

//CRUD: Update
async function update(projectName, update_issue) {
  if( update_issue.open) update_issue.open = update_issue.open === 'true' ? true: false;
  for (const key of Object.keys(update_issue)) {
    if(update_issue[key] ===''){
      delete update_issue[key]
    }
  }
  const {_id,...issue} = update_issue
  issue.updated_on = new Date();
  const { db, client } = await connectDB();
  const collection = db.collection(projectName);
  let result = await collection.updateOne(
    { _id : new objectId(_id)},
    { $set: {...issue}  }
  );
  return result.result;
}
module.exports.update = update;

//CRUD: Delete
async function deleteById(projectName, id) {
  const { db, client } = await connectDB();
  const collection = db.collection(projectName);
  const result = await collection.findOneAndDelete({ _id: objectId(id) });
  return result;
}


module.exports.deleteById = deleteById;
