const axios = require("axios");

var mysql = require("mysql2");

var dbSurvey;

//product cPanel db_config
var db_config = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "survey",
};

function handleDisconnect() {
  dbSurvey = mysql.createConnection(db_config);
  console.log("restart");
  dbSurvey.connect(function (err) {
    console.log("Connection OK");
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  dbSurvey.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

handleDisconnect();

async function query(query, params = []) {
  let result = await dbSurvey
    .promise()
    .query(query, params, function (error, results, fields) {
      if (error) throw error;
    });
  return result[0];
}

axios
  .get(
    "https://sheets.googleapis.com/v4/spreadsheets/1Na16KETL87c1xbvn9PJMsQRy1bvce0i9ZUixuQmxCiQ/values:batchGet?ranges=Uni_major&majorDimension=ROWS&key=AIzaSyByXzekuWCb4pI-ZTD7yEAGVYV0224Mc6Q"
  )
  .then(async (res) => {
    const data = res.data.valueRanges[0].values;
    console.log("data: ", data);
    let newData = await query(
      "INSERT INTO uni_major (id_university, id_major, major, block, id_type) values ?",
      [data.map((item) => [item[0], item[1], item[2], item[3], item[4]])]
    );
  });
