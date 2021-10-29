const mongoose = require('mongoose')

async function connectDb() {
  try {
    const env =
      process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO_URI : process.env.LIVE_MONGO_URI
    const db = await mongoose.connect(env, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`${process.env.NODE_ENV} Mongodb connected`)
    return db.connection
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectDb
