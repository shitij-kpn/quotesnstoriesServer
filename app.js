const express = require("express");
const pool = require("./core/pool");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
// //SignIN
app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  pool.query("SELECT * FROM users WHERE email = ?", [email], function (
    error,
    results
  ) {
    if (error) {
      res.json({
        status: false,
        message: "there are some error with query",
      });
    } else {
      if (results.length > 0) {
        const isValid = bcrypt.compareSync(password, results[0].password);
        if (isValid) {
          res.json({
            status: true,
            message: "successfully authenticated",
            email: results[0].email,
            role: results[0].role,
          });
        } else {
          res.json({
            status: false,
            message: "Email and password does not match",
          });
        }
      } else {
        res.json({
          status: false,
          message: "Email does not exits",
        });
      }
    }
  });
});

//register
app.post("/register", (req, res) => {
  const { email, password, role } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const users = {
    email: email,
    password: hash,
    role: role,
  };
  pool.query("INSERT INTO users SET ?", users, function (error, results) {
    if (error) {
      res.json({
        status: false,
        message: "there are some error with query",
      });
    } else {
      res.json({
        status: true,
        data: results,
        message: "user registered sucessfully",
      });
    }
  });
});

//update
app.patch("/update", (req, res) => {
  const { email, role } = req.body;
  console.log("running update");
  pool.query(
    "UPDATE users SET role = ? WHERE email = ?",
    [role, email],
    function (error, results) {
      if (error) {
        res.json({
          status: false,
          message: "there are some error with query",
        });
      } else {
        res.json({
          status: true,
          data: results,
          message: "role updated",
        });
      }
    }
  );
});

app.listen(5000, () => console.log("server runnning on port 5000"));

module.exports = app;
