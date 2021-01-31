const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors")
const socketApi = require("./socket");
const path=require("path")
socketApi.io.attach(server);

app.use(cors());
app.use(express.static(path.join("./public")));

const port = process.env.PORT || 3000;
const host=process.env.HOST || '0.0.0.0'
server.listen(port,host, (err) => {
    if (err)
        return err;

    console.log("Listening on port "+port)
})