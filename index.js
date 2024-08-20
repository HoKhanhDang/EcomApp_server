const express = require("express");
const initRoutes = require("./routes");
const axios = require("axios");
require("dotenv").config();

const dbConnection = require("./config/dbconnection.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(
    cors({
        origin: [
            "https://ecom-app-admin-dunks-projects.vercel.app",
            "https://ecom-app-client-dunks-projects.vercel.app",
            "https://ecom-app-client-v2-dunks-projects.vercel.app",
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(cookieParser());
const port = process.env.PORT || 8888;

//configure body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const headers = {
    "Content-Type": "application/json",
    appid: process.env.APP_ID_COMETCHAT ,
    apikey: process.env.APIKEY_COMETCHAT ,
};

app.get("/api/create", (req, res) => {
    // data for new user
    const data = {
        // you can use your own logic to generate random UID and name
        // only uid has to be unique
        uid: new Date().getTime(),
        name: "customer_" + new Date().getTime(),
    };
    axios
        .post(`${process.env.URT_COMETCHAT}/users`, JSON.stringify(data), {
            headers,
        })
        .then((response) => {
            // user is created, fetch auth token
            requestAuthToken(response.data.data.uid)
                .then((token) => {
                    console.log("Success:" + JSON.stringify(token));
                    // token is returned to client
                    res.json(token);
                })
                .catch((error) => {
                    console.error("Error fetching auth token:", error);
                    res.status(500).json({ error: "Error fetching auth token" });
                });
        })
        .catch((error) => {
            console.error("Error creating user:", error);
            if (error.response && error.response.status === 401) {
                res.status(401).json({ error: "Unauthorized" });
            } else {
                res.status(500).json({ error: "Error creating user" });
            }
        });
});
app.get("/api/auth", (req, res) => {
    const uid = req.query.uid;
    // if you have your own login method, call it here.
    // then call CometChat for auth token
    requestAuthToken(uid)
        .then((token) => {
            console.log("Success:" + JSON.stringify(token));
            res.json(token);
        })
        .catch((error) => console.error("Error:", error));
});
app.get('/api/users', (req, res) => {
  axios
    .get(`${process.env.URT_COMETCHAT}/users`, {
      headers,
    })
    .then(response => {
      const { data } = response.data;
      const filterAgentData = data.filter(data => {
      // filter agent out from the list of users
        return data.uid !== process.env.AGENT_ID_COMETCHAT;
      });
      res.json(filterAgentData);
    })
    .catch(error => console.error('Error:', error));
});
// this function will fetch token
const requestAuthToken = (uid) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${process.env.URT_COMETCHAT}/users/${uid}/auth_tokens`, null, {
                headers,
            })
            .then((response) => {
                console.log("New Auth Token:", response.data);
                resolve(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching auth token:", error);
                if (error.response && error.response.status === 401) {
                    reject({ error: "Unauthorized" });
                } else {
                    reject({ error: "Error fetching auth token" });
                }
            });
    });
};

dbConnection();
initRoutes(app);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
