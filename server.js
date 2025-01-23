const app = require('./app');
require('dotenv').config();
const db = require('./src/config/database');


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
