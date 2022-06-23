const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client')
var bodyParser  =require('body-parser');
var multer = require('multer');
var upload = multer();
const colors = require('colors')


const prisma = new PrismaClient()
require('dotenv').config();

async function main() {
  // Connect the client
  await prisma.$connect()
  // ... you will write your Prisma Client queries here
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    // await prisma.$disconnect()
  })


const app = express();
// app.use(express.json());
// app.use(express.urlencoded({type: ""}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(upload.array()); 

app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
  res.setHeader('Content-Type', 'text/plain');
});

app.use('/api', require('./routes/api.route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 💥 `+` @ http://localhost:${PORT}`.rainbow));
