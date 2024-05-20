import express, { urlencoded } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "login-data",
}).then(() => {
    console.log('database connected');
}).catch((err) => {
    console.log("Failed to connect", err);
});

const loginSchema = new mongoose.Schema({
    name: "string",
    email: "string",
    pass: "string"
});

const Login1 = new mongoose.model("Login", loginSchema);


const PORT = 3000;

const app = express();

//middleware for cookie-parser
app.use(cookieParser());

// to use and acccess  any (html,css,js) static file data -->> we have to use exact this "MIDDLEWARE"
app.use(express.static((path.join(path.resolve(), "public"))));

//Authentication part-- making normal handler named as "isAuthenticated"

const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        // console.log(token);
        const decodedData = jwt.verify(token, "subh05");

        console.log(decodedData);

        req.login = await Login1.findById(decodedData._id);

        next();
    } else {
        console.log("token expired after 30 sec or logout pressed");
        res.redirect("/login");
    }
};

app.use(express.urlencoded({ extended: true }));

app.get("/", isAuthenticated, (req, res) => {
    console.log(req.login);
    res.render("logout.ejs", { name: req.login.name });
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");

    // res.render("login.ejs");
    // console.log(req.cookies);
});

app.post("/login", async (req, res) => {

    let login = await Login1.findOne({ email: req.body.Email });

    if (!login) {
        return res.redirect("/register");
    }

    // const isMatch = login.pass === req.body.Password;
    const isMatch = await bcrypt.compare(req.body.Password, login.pass);

    if (!isMatch) return res.render("login.ejs", { errMsg: "Wrong password" });

    const token = jwt.sign({ _id: login._id }, "subh05");
    console.log(token);

    res.cookie("token", token, {
        httpOnly: true, expires: new Date(Date.now() + 300 * 1000)
    });
    res.redirect("/");

})

//here we use post coz with register and login we have to post the login credential data
app.post("/register", async (req, res) => {
    console.log(req.body);

    let login = await Login1.findOne({ email: req.body.Email });

    if (login) {
        return res.redirect("/login");
    }

    const hassedPassword = await bcrypt.hash(req.body.Password, 10);

    login = await Login1.create({ name: req.body.Fname, email: req.body.Email, pass: hassedPassword });


    const token = jwt.sign({ _id: login._id }, "subh05");
    console.log(token);

    res.cookie("token", token, {
        httpOnly: true, expires: new Date(Date.now() + 300 * 1000)
    });
    res.redirect("/");
});

//here we use get coz with logout we dont need any logout credential data
app.get("/logout", (req, res) => {
    res.cookie("token", "null", {
        httpOnly: true, expires: new Date(Date.now())
    });
    res.redirect("/login");
});

app.listen(PORT, () => {
    console.log(`server is working on ${PORT}`);
});
