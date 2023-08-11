var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql2");
var cors = require("cors");
const { default: axios } = require("axios");
var XLSX = require("xlsx");
var workbook = XLSX.readFile("Data_Uni.xlsx");
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
console.log(xlData);
const fs = require("fs");

var isProduct = false;

//dev

var whitelist = ["http://85.239.242.39:5555", "http://85.239.242.39"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(isProduct ? corsOptions : { origin: "http://localhost:3000" }));

app.use(bodyParser.json({ type: "application/json" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.all("*", function (req, res, next) {
  /**
   * Response settings
   * @type {Object}
   */
  var responseSettings = {
    AccessControlAllowOrigin: req.headers.origin,
    AccessControlAllowHeaders:
      "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
    AccessControlAllowMethods: "POST, GET, PUT, DELETE, OPTIONS",
    AccessControlAllowCredentials: true,
  };

  /**
   * Headers
   */
  res.header(
    "Access-Control-Allow-Credentials",
    responseSettings.AccessControlAllowCredentials
  );
  res.header(
    "Access-Control-Allow-Origin",
    responseSettings.AccessControlAllowOrigin
  );
  res.header(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"]
      ? req.headers["access-control-request-headers"]
      : "x-requested-with"
  );
  res.header(
    "Access-Control-Allow-Methods",
    req.headers["access-control-request-method"]
      ? req.headers["access-control-request-method"]
      : responseSettings.AccessControlAllowMethods
  );

  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
});

app.get("/", function (req, res) {
  return res.send({ error: false, message: "Hello from Linh Ken" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log("Node app is running on port 5000");
});

var dbSurvey;

//product cPanel db_config
var db_config = isProduct
  ? {
      host: "localhost",
      user: "khiem",
      password: "123456",
      database: "survey",
    }
  : {
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

/*------------------DATA---------------------*/
// Retrieve all data
app.get("/survey", function (req, res) {
  dbSurvey.query("SELECT * FROM data", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: "data list." });
  });
});

// Retrieve list university
app.get("/university", function (req, res) {
  dbSurvey.query("SELECT * FROM university", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: "data list." });
  });
});

// Retrieve list major
app.get("/major", function (req, res) {
  dbSurvey.query("SELECT * FROM uni_major", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: "data list." });
  });
});

// Retrieve major with university id
app.get("/major/:id", function (req, res) {
  let data_id = req.params.id;
  console.log("data_id: ", data_id);
  if (!data_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide data_id" });
  }
  if (data_id == -1) {
    dbSurvey.query(
      "SELECT * FROM uni_major",
      function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: "data list." });
      }
    );
  } else {
    dbSurvey.query(
      "SELECT * FROM uni_major where id_university=?",
      data_id,
      function (error, results, fields) {
        if (error) throw error;
        console.log("results: ", results);
        return res.send({ error: false, data: results, message: "data list." });
      }
    );
  }
});

// Retrieve block with major id
app.get("/block/:id", function (req, res) {
  let data_id = req.params.id;
  console.log("data_id: ", data_id);
  if (!data_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide data_id" });
  }
  if (data_id == -1) {
    dbSurvey.query(
      "SELECT * FROM uni_major",
      function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: "data list." });
      }
    );
  } else {
    dbSurvey.query(
      "SELECT * FROM uni_major where id_major=?",
      data_id,
      function (error, results, fields) {
        if (error) throw error;
        console.log("results: ", results);
        return res.send({ error: false, data: results, message: "data list." });
      }
    );
  }
});

// Retrieve data with id
app.get("/survey/:id", function (req, res) {
  let data_id = req.params.id;
  if (!data_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide data_id" });
  }
  dbSurvey.query(
    "SELECT * FROM data where id=?",
    data_id,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results[0],
        message: "data list.",
      });
    }
  );
});

// Add a new data
app.post("/survey/add", async function (req, res) {
  let data = req.body.data;
  console.log("data", data);
  if (!data) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide data" });
  }
  let newData = await query(
    "INSERT INTO data (name, academic, personality) values (?, ?, ?)",
    [data.name, data.academic, data.personality]
  );
  for (let i = 0; i < data.listAspiration.length; i++) {
    const aspiration = data.listAspiration[i];
    await query(
      "INSERT INTO aspiration (id_data, university, major, block, isLike) values (?, ?, ?, ?, ?)",
      [
        newData.insertId,
        aspiration.university,
        aspiration.major,
        aspiration.block,
        aspiration.isLike,
      ]
    );
  }
  return res.send({
    error: false,
    message: "New data has been created successfully.",
  });
});

app.get("/predict/:id", async function (req, res) {
  let data_id = req.params.id;
  if (!data_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide data_id" });
  }
  let data_input = await query(
    "SELECT * FROM aspiration_input where id_user=?",
    [data_id]
  );
  let data_output = await query(
    "SELECT * FROM aspiration_output where id_user=?",
    [data_id]
  );
  return res.send({
    error: false,
    data: {
      data_input,
      data_output,
    },
    message: "data list.",
  });
});

app.post("/predict", async function (req, res) {
  let data = req.body.data;
  if (!data) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide data" });
  }
  let user = data?.user || null;
  console.log("user: ", user);
  let info_person = data?.info_person || null;
  let nv = data?.nv || null;
  let percentType1 = data?.percentType1 || null;
  let percentType2 = data?.percentType2 || null;
  let percentType3 = data?.percentType3 || null;
  let percentType4 = data?.percentType4 || null;
  let percentType5 = data?.percentType5 || null;
  if (user) {
    console.log("aaaaaaaaaaaaa");
    //add new rating if not exist
    dbSurvey.query(
      "SELECT * FROM rating where id_user=?",
      [user.id],
      function (error, results, fields) {
        console.log("bbbbbbbbbbbbb");
        if (error) throw error;
        console.log("resultsssssssssssssss: ", results);
        if (results.length === 0) {
          dbSurvey.query("INSERT INTO rating (id_user, star) values (?, ?)", [
            user.id,
            0,
          ]);
        }
      }
    );
    await query(
      "UPDATE users SET academic = ?, personality =?, percentType1 =?, percentType2 = ?, percentType3 = ?, percentType4 = ?, percentType5 = ?  where id=?",
      [
        info_person.hocluc,
        info_person.tinhcach,
        percentType1,
        percentType2,
        percentType3,
        percentType4,
        percentType5,
        user.id,
      ]
    );
    //delete old aspiration
    if (nv.length > 0) {
      await query("DELETE FROM aspiration_input where id_user=?", [user.id]);
      for (let i = 0; i < nv.length; i++) {
        const aspiration = nv[i];
        let isLikeValue = null;
        if (aspiration.islike == "Rất thích") {
          isLikeValue = 4;
        } else if (aspiration.islike == "Thích") {
          isLikeValue = 3;
        } else if (aspiration.islike == "Bình thường") {
          isLikeValue = 2;
        } else {
          isLikeValue = 1;
        }
        console.log("isLikeValue: ", isLikeValue);
        let id_major = xlData.find((item) => item.Major === aspiration.major);
        //insert new aspiration
        await query(
          "INSERT INTO aspiration_input (id_user, university, major, block, isLike, id_major) values (?, ?, ?, ?, ?, ?)",
          [
            user.id,
            aspiration.uni,
            aspiration.major,
            aspiration.block,
            isLikeValue,
            id_major?.ID_major || null,
          ]
        );
      }
    }
    const url = "http://127.0.0.1:8080/predict";
    const body = {
      info_person: data?.info_person || {
        hovaten: "test",
        hocluc: "Giỏi",
        tinhcach: "ESFJ-T",
      },
      nv: data?.nv || [
        {
          uni: "Học viện Âm nhạc Quốc gia Việt Nam",
          major: "Âm nhạc học",
          block: "N",
          islike: "Rất thích",
        },
      ],
    };

    axios
      .post(url, body)
      .then(async (res1) => {
        let aspirationOutput = res1.data;

        aspirationOutput = Object.keys(res1.data.Uni).map((key) => {
          let id_major = xlData.find(
            (item) => item.Major === aspirationOutput.Major[key]
          );
          console.log("id_major: ", id_major.ID_major);
          return {
            uni: aspirationOutput.Uni[key],
            major: aspirationOutput.Major[key],
            block: aspirationOutput.block[key],
            score: aspirationOutput.score[key],
            id_major: id_major?.ID_major || null,
          };
        });
        //delete old aspiration_output
        await query("DELETE FROM aspiration_output where id_user=?", [user.id]);
        //insert new aspiration_output
        for (let i = 0; i < aspirationOutput.length; i++) {
          const aspiration = aspirationOutput[i];
          await query(
            "INSERT INTO aspiration_output (id_user, university, major, block, score, id_major) values (?, ?, ?, ?, ?,?)",
            [
              user.id,
              aspiration.uni,
              aspiration.major,
              aspiration.block,
              aspiration.score,
              aspiration.id_major,
            ]
          );
        }

        return res.send({
          error: false,
          data: res1.data,
          message: "Success",
        });
        // setPersonality(res.data);
        // setPage("dsnv");
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  }
});

//  Update data with id
app.put("/survey", function (req, res) {
  let data_id = req.body.data_id;
  let data = req.body.data;
  // console.log("data_id", data_id);
  // console.log("data", data[22]);
  if (!data_id || !data) {
    return res
      .status(400)
      .send({ error: data, message: "Please provide data and data_id" });
  }
  dbSurvey.query(
    "UPDATE data SET id_data = ?, university = ?, major = ?, block =?, isLike = ?  WHERE id = ?",
    [...data, data_id],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data has been updated successfully.",
      });
    }
  );
});

//login
app.post("/login", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  dbSurvey.query(
    "SELECT * FROM users where email=? and password=? or username=? and password_username=?",
    [username, password, username, password],
    function (error, results, fields) {
      if (error) throw error;
      console.log("results: ", results);
      if (results.length > 0) {
        //update online status to 1
        dbSurvey.query(
          "UPDATE users SET online = ? WHERE id = ?",
          [1, results[0].id],
          function (error, results, fields) {
            if (error) throw error;
          }
        );

        return res.send({
          error: false,
          data: results[0],
          message: "data list.",
        });
      } else {
        return res.send({
          error: true,
          data: null,
          message: "data list.",
        });
      }
    }
  );
});

//logout
app.post("/logout", function (req, res) {
  let user_id = req.body.user_id;
  console.log("user_id logout: ", user_id);
  if (!user_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide user_id" });
  }
  dbSurvey.query(
    "UPDATE users SET online = ? WHERE id = ?",
    [0, user_id],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data list.",
      });
    }
  );
});

//get personality
app.get("/personality/:id", function (req, res) {
  let user_id = req.params.id;
  console.log("user_id: ", user_id);
  if (!user_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide data_id" });
  }
  dbSurvey.query(
    "SELECT personality, percentType1, percentType2, percentType3, percentType4, percentType5  FROM users where id =  ?",
    user_id,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data list.",
      });
    }
  );
});

//signUp
app.post("/signUp", function (req, res) {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let name = `${req.body.lastName} ${req.body.firstName}`;
  let image =
    "https://res.cloudinary.com/dw5j6ht9n/image/upload/v1689904975/rectangle-485_2x_omnwc7.png";
  let dateCreate = new Date();
  let dateUpdate = new Date();
  let permission = 0;
  let status = 1;
  let password_username = req.body.password_username;
  dbSurvey.query(
    "SELECT * FROM users where email=?",
    [username],
    function (error, results, fields) {
      if (error) throw error;
      console.log("results: ", results);
      if (results.length > 0) {
        return res.send({
          error: true,
          data: null,
          message: "data list.",
        });
      } else {
        dbSurvey.query(
          "INSERT INTO users (email,username, password, name,  image, date_create, date_update, permission, status, password_username) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            email,
            username,
            password,
            name,
            image,
            dateCreate,
            dateUpdate,
            permission,
            status,
            password_username,
          ],
          function (error, results, fields) {
            if (error) throw error;
            return res.send({
              error: false,
              data: results,
              message: "data has been updated successfully.",
            });
          }
        );
      }
    }
  );
});

//delete user
app.post("/delete_user", function (req, res) {
  //id is an array of id to update status to 0
  let id = req.body.id;
  console.log("id: ", id);
  if (!id) {
    return res.status(400).send({ error: true, message: "Please provide id" });
  }
  //update status to 0
  dbSurvey.query(
    "UPDATE users SET status = ? WHERE id in (?)",
    [0, id],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data has been updated successfully.",
      });
    }
  );
});

//update role status in users
app.post("/update_role", function (req, res) {
  let id = req.body.id;
  let permission = req.body.permission;
  console.log("id: ", id);
  if (!id) {
    return res.status(400).send({ error: true, message: "Please provide id" });
  }
  //update status to 0
  dbSurvey.query(
    "UPDATE users SET permission = ? WHERE id = ?",
    [permission, id],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data has been updated successfully.",
      });
    }
  );
});

//get list tinh_cach
app.get("/tinh_cach", function (req, res) {
  dbSurvey.query("SELECT * FROM tinh_cach", function (error, results, fields) {
    if (error) throw error;
    return res.send({
      error: false,
      data: results,
      message: "data list.",
    });
  });
});

//  Delete data
app.delete("/survey", function (req, res) {
  // console.log("req.body", req.body);
  let data_id = req.body.data_id;
  // console.log("data_id", data_id);
  if (!data_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide data_id" });
  }
  dbSurvey.query(
    "DELETE FROM data WHERE id in (?)",
    [data_id],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "Data has been delete successfully.",
      });
    }
  );
});

//get list rating
app.get("/rating", async function (req, res) {
  // dbSurvey.query("SELECT * FROM rating", function (error, results, fields) {
  //   if (error) throw error;
  //   return res.send({
  //     error: false,
  //     data: results,
  //     message: "data list.",
  //   });
  // });
  const listRating = await query("SELECT * FROM rating");
  console.log("listRating: ", listRating);
  const listCountUp = await query(
    `SELECT *, COUNT(type) as count_up FROM rating INNER JOIN user_rating on rating.id = user_rating.id_rating where type="up" group by id_rating `
  );
  console.log("listCountUp: ", listCountUp);
  const listCountDown = await query(
    `SELECT *, COUNT(type) as count_down FROM rating INNER JOIN user_rating on rating.id = user_rating.id_rating where type="down" group by id_rating `
  );
  console.log("listCountDown: ", listCountDown);
  let listMerge = [];
  let mapListRating = listRating.map((item, index) => {
    let itemUp = listCountUp.find((e) => +e.id_rating === item.id);
    let itemDown = listCountDown.find((e) => +e.id_rating === item.id);
    let countUp = itemUp ? itemUp.count_up : 0;
    let countDown = itemDown ? itemDown.count_down : 0;
    return {
      ...item,
      countUp,
      countDown,
    };
  });
  console.log("mapListRating: ", mapListRating);
  res.send({
    error: false,
    data: mapListRating,
    message: "data list.",
  });
});

//get user
app.get("/user/:id", function (req, res) {
  let user_id = req.params.id;
  console.log("user_id: ", user_id);
  if (!user_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide data_id" });
  }
  dbSurvey.query(
    "SELECT id, name, image, email, permission, status, academic, personality, percentType1, percentType2, percentType3, percentType4, percentType5, online, request_admin, username  FROM users where id =  ?",
    user_id,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data list.",
      });
    }
  );
});

//get list users
app.get("/list_user", function (req, res) {
  console.log("get list user");
  dbSurvey.query(
    "SELECT id, name, email, image, permission, status, online, request_admin, academic, personality FROM users",
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data list.",
      });
    }
  );
});

//update aspiration_input
app.post("/update_aspiration_input", function (req, res) {
  let id = req.body.id;
  let aspiration_input = req.body.aspiration_input;
  console.log("id: ", id);
  if (!id) {
    return res.status(400).send({ error: true, message: "Please provide id" });
  }
  //update aspiration_input
  let query = `UPDATE aspiration_input SET university = ?, major = ?, block = ?, isLike = ?, id_major = ? where id = ?`;
  let params = [
    aspiration_input.university,
    aspiration_input.major,
    aspiration_input.block,
    aspiration_input.isLike,
    aspiration_input.id_major,
    id,
  ];
  dbSurvey.query(query, params, function (error, results, fields) {
    if (error) throw error;
    return res.send({
      error: false,
      data: results,
      message: "aspiration_input has been updated successfully.",
    });
  });
});

//update_user
app.post("/update_user", function (req, res) {
  let id = req.body.id;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let image = req.body.image;
  let academic = req.body.academic;
  let personality = req.body.personality;
  let password = req.body.password;

  console.log("id: ", id);
  if (!id) {
    return res.status(400).send({ error: true, message: "Please provide id" });
  }
  //update user data
  let query = `UPDATE users SET name = ?, email = ?, image = ?, academic = ?, personality = ?`;
  let params = [
    lastName + " " + firstName,
    email,
    image,
    academic,
    personality,
  ];
  if (!!password) {
    query += ", password = ?";
    params = [...params, password];
  }
  params = [...params, id];
  query += `WHERE id = ?`;
  dbSurvey.query(query, params, function (error, results, fields) {
    if (error) throw error;
    return res.send({
      error: false,
      data: results,
      message: "data has been updated successfully.",
    });
  });
});

//request admin
app.post("/request_admin", function (req, res) {
  let id = req.body.id;
  console.log("id: ", id);
  if (!id) {
    return res.status(400).send({ error: true, message: "Please provide id" });
  }
  //update status to 0
  dbSurvey.query(
    "UPDATE users SET request_admin = 1 WHERE id = ?",
    [id],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data has been updated successfully.",
      });
    }
  );
});

//get list_nguyen_vong
app.get("/list_nguyen_vong", function (req, res) {
  //get  aspiration_input  inner join users
  dbSurvey.query(
    "SELECT block, aspiration_input.id, id_major, id_user, image, isLike, major, name, university, online, academic, personality, percentType1, percentType2, percentType3, percentType4, percentType5  FROM aspiration_input INNER JOIN users ON aspiration_input.id_user = users.id",
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data list.",
      });
    }
  );
});

//delete_nguyen_vong
app.post("/delete_nguyen_vong", function (req, res) {
  let id = req.body.id;
  console.log("id: ", id);
  if (!id) {
    return res.status(400).send({ error: true, message: "Please provide id" });
  }
  //delete nguyen_vong
  dbSurvey.query(
    "DELETE FROM aspiration_input WHERE id in (?)",
    [id],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data has been delete successfully.",
      });
    }
  );
});

//get list uni
app.get("/list_uni", function (req, res) {
  const listUni = fs.readFileSync("./listUniversityInformation.json");
  const listUniJson = JSON.parse(listUni);
  return res.send({
    error: false,
    data: listUniJson,
    message: "data list.",
  });
});

//delete uni
app.post("/delete_uni", function (req, res) {
  let id = req.body.id;
  console.log("id: ", id);
  if (!id) {
    return res.status(400).send({ error: true, message: "Please provide id" });
  }
  //delete uni from json file
  const listUni = fs.readFileSync("./listUniversityInformation.json");
  const listUniJson = JSON.parse(listUni);
  const newListUni = listUniJson.filter((item) => +item.id !== +id);
  fs.writeFileSync(
    "./listUniversityInformation.json",
    JSON.stringify(newListUni)
  );
  return res.send({
    error: false,
    data: newListUni,
    message: "data has been delete successfully.",
  });
});

//create uni
app.post("/create_uni", function (req, res) {
  let universityName = req.body.universityName;
  let image = req.body.image;
  fs.readFile("./listUniversityInformation.json", function (err, data) {
    if (err) throw err;
    let listUniJson = JSON.parse(data);
    let id = listUniJson.length;
    let newUni = {
      id: id,
      universityName: universityName,
      image: image,
      content: [],
      daoTao: [],
    };
    listUniJson.push(newUni);
    fs.writeFileSync(
      "./listUniversityInformation.json",
      JSON.stringify(listUniJson)
    );
    return res.send({
      error: false,
      data: listUniJson,
      message: "data has been create successfully.",
    });
  });
});

//update uni
app.post("/update_uni", function (req, res) {
  let id = req.body.id;
  let universityName = req.body.universityName;
  let image = req.body.image;
  let content = req.body.content;
  let daoTao = req.body.daoTao;
  console.log("id: ", id);
  if (!id) {
    return res.status(400).send({ error: true, message: "Please provide id" });
  }
  //update uni from json file
  const listUni = fs.readFileSync("./listUniversityInformation.json");
  const listUniJson = JSON.parse(listUni);
  const newListUni = listUniJson.map((item) => {
    if (+item.id === +id) {
      return {
        id: id,
        universityName: universityName,
        image: image,
        content: content,
        daoTao: daoTao,
      };
    }
    return item;
  });
  fs.writeFileSync(
    "./listUniversityInformation.json",
    JSON.stringify(newListUni)
  );
  return res.send({
    error: false,
    data: newListUni,
    message: "data has been update successfully.",
  });
});

//get list user_rating
app.get("/user_rating/:id_rating", function (req, res) {
  let id_rating = req.params.id_rating;
  console.log("id_rating: ", id_rating);
  if (!id_rating) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide data_id" });
  }
  dbSurvey.query(
    "SELECT * FROM user_rating where id_rating =  ?",
    id_rating,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data list.",
      });
    }
  );
});

//update user_rating
app.post("/user_rating", function (req, res) {
  let id_rating = req.body.id_rating;
  console.log("id_rating: ", id_rating);
  let id_user = req.body.id_user;
  console.log("id_user: ", id_user);
  let type = req.body.type;
  console.log("type: ", type);
  dbSurvey.query(
    "SELECT * FROM user_rating where id_rating = ? AND id_user = ?",
    [id_rating, id_user],
    function (error, results, fields) {
      if (error) throw error;
      console.log("results: ", results);
      if (results.length > 0) {
        dbSurvey.query(
          "UPDATE user_rating SET type = ? WHERE id_rating = ? AND id_user = ?",
          [type, id_rating, id_user],
          function (error, results, fields) {
            if (error) throw error;
            return res.send({
              error: false,
              data: results,
              message: "data has been updated successfully.",
            });
          }
        );
      } else {
        dbSurvey.query(
          "INSERT INTO user_rating (id_rating, id_user, type) values (?, ?, ?)",
          [id_rating, id_user, type],
          function (error, results, fields) {
            if (error) throw error;
            return res.send({
              error: false,
              data: results,
              message: "data has been updated successfully.",
            });
          }
        );
      }
    }
  );
});

//update rating
app.post("/rating", function (req, res) {
  let star = req.body.star;
  let id_user = req.body.id_user;
  dbSurvey.query(
    "UPDATE rating SET star = ? WHERE id_user = ?",
    [star, id_user],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data has been updated successfully.",
      });
    }
  );
});

//create new comment
app.post("/comment", function (req, res) {
  let id_user = req.body.id_user;
  let id_rating = req.body.id_rating;
  let content = req.body.content;
  dbSurvey.query(
    "INSERT INTO comment (id_user, id_rating, content) values (?, ?, ?)",
    [id_user, id_rating, content],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data has been updated successfully.",
      });
    }
  );
});

//get list comment
app.get("/comment/:id_rating", function (req, res) {
  let id_rating = req.params.id_rating;
  console.log("id_rating: ", id_rating);
  if (!id_rating) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide data_id" });
  }
  //get list comment inner join user
  dbSurvey.query(
    "SELECT comment.id, comment.id_user, comment.id_rating, comment.content, users.name, users.image FROM comment INNER JOIN users ON comment.id_user = users.id where id_rating =  ?",
    id_rating,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results.reverse(),
        message: "data list.",
      });
    }
  );
});

//send message
app.post("/message", function (req, res) {
  let id_user_send = req.body.id_user_send;
  let id_user_receive = req.body.id_user_receive;
  let content = req.body.content;
  let time = req.body.time;
  dbSurvey.query(
    "INSERT INTO message (id_user_send, id_user_receive, content, time) values (?, ?, ?, ?)",
    [id_user_send, id_user_receive, content, time],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "data has been updated successfully.",
      });
    }
  );
});

//get list user have message
app.get("/message/:id_user", function (req, res) {
  let id_user = req.params.id_user;
  console.log("id_user: ", id_user);
  if (!id_user) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide data_id" });
  }
  //get list user inner join message
  dbSurvey.query(
    "SELECT users.id, users.name, users.image, message.id_user_send, message.id_user_receive, message.content, message.time FROM message INNER JOIN users ON message.id_user_send = users.id where  id_user_receive = ?  ORDER BY message.time DESC",
    [id_user],
    function (error, results, fields) {
      dbSurvey.query(
        "SELECT users.id, users.name, users.image, message.id_user_send, message.id_user_receive, message.content, message.time FROM message INNER JOIN users ON message.id_user_receive = users.id where  id_user_send = ?  ORDER BY message.time DESC",
        [id_user],
        function (error, results2, fields) {
          if (error) throw error;
          return res.send({
            error: false,
            data: results.concat(results2),
            message: "data list.",
          });
        }
      );
      // if (error) throw error;
      // return res.send({
      //   error: false,
      //   data: results.reverse(),
      //   message: "data list.",
      // });
    }
  );
});
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
// nhớ thêm cái cors này để tránh bị Exception nhé :D  ở đây mình làm nhanh nên cho phép tất cả các trang đều cors được.

socketIo.on("connection", (socket) => {
  ///Handle khi có connect từ client tới
  console.log("New client connected " + socket.id);

  socket.on("sendDataClient", function (data) {
    // Handle khi có sự kiện tên là sendDataClient từ phía client
    socketIo.emit("sendDataServer", { data }); // phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});

server.listen(7000, () => {
  console.log("Server socket is running on port 7000");
});

module.exports = app;
