const app = require("./index");

const connect=require("./configs/db");

app.listen(1234,async function(){
    await connect();
    console.log("Listening on 1234");
})