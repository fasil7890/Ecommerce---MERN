const app = require('./app');
const path = require('path');
const connectDatabase = require('./config/database');

connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(
    `server running on ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});
