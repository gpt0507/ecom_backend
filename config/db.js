const mongoose = require('mongoose')
const DBURL = process.env.DATABASE

mongoose.connect(DBURL)
  .then(() => console.log('mongodb connected successfully. . .'))
  .catch((error) => console.log('error in database connection', error))