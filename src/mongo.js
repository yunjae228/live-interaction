const { MongoClient } = require('mongodb')
const uri = 'mongodb+srv://yun:gkswls3614@cluster0.uxmqg.mongodb.net/'
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

module.exports = client
