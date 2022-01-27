// var cluster = require('cluster');
// var numCPUs = require('os').cpus().length;

// if (cluster.isMaster) {
//   console.log(numCPUs)
//     for (var i = 0; i < numCPUs; i++) {
//         // Create a worker
//         cluster.fork();
//     }
// } else {
  
  const express = require('express');
  const mongoose = require('mongoose');
  const bodyParser = require('body-parser');
  const config = require('../db');
  const cors = require('cors');
  const app = express();
  const server = require('http').Server( app);
  const io  = require('socket.io').listen(server);
  const SocketServer = require("../socket");
  const db = require("./db.json");
  const adminRouter = require("../router");
  const path = require("path");
  
  app.use(cors());
  app.use(express.static('../clients'));
  app.use(express.static('../clients/builds'));
  app.use(express.static('../clients/uploads'));
  app.use(bodyParser.json({limit: "15360mb", type:'application/json'}));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set("socketio", io);
  app.use('/admin',(req,res,next)=> {
    console.log(req.headers['host'])
    console.log(req.headers['x-real-ip'])
    console.log(req.url)
    adminRouter(req,res,next)
  });
  
  SocketServer(io);
  
  // app.get('/robots.txt', (req, res) => { res.sendFile(path.join(config.BASEURL, 'clients/robots/robots.txt')); });  
  app.get('*', (req, res) => {
    res.sendFile(path.join(config.DIR, 'clients/builds/index.html'));  
  });
  //    start server
  
  mongoose.connect(db.DBCONNECT, { useNewUrlParser: true ,useFindAndModify: false,useUnifiedTopology: true,useCreateIndex : true}).then(() => {
    console.log('Database is connected');
    server.listen(db.ServerPort, () => {
      console.log(`Started server on => http://localhost:${db.ServerPort}`);
    });
    },
    err => { console.log('Can not connect to the database'+ err)}
  );

// }

