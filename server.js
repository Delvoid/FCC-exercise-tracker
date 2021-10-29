const connectDb = require('./utils/connectDb')
const app = require('./app')

//connect to db
connectDb()

const listener = app.listen(process.env.PORT || 5000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
