const express = require("express"),
      app = express(),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      cookieParser = require('cookie-parser'),
      config = require("./config/key"),
      server = require("http").createServer(app),
      io = require("socket.io")(server);

const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const { Chat } = require('./models/chat');

app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));

app.use('/uploads', express.static('uploads'));

io.on("connection", socket => {
  socket.on("Input", msg => {
    connect.then(db => {
      try {
        let chat = new Chat({message: msg.chatMessage, sender: msg.userId, type: msg.type})
        chat.save((err, doc) => {
          if(err) return res.json({success: false, err})

          Chat.find({"_id": doc._id})
            .populate("sender")
            .exec((err, doc) => {
              return io.emit("Output", doc)
            })
        })
      } catch (error) {
        console.log(error)
      }
    })
  })
})

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server is runnig on port ${PORT}`);
});