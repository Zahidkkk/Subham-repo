import express from "express";
import path from "path";
import mongoose from "mongoose";

const PORT = 4000;


mongoose.connect("mongodb://127.0.0.1:27017/", {
    dbName: "backend",
})
    .then(() => console.log("Database connected")).catch((error) => console.log(error));

const messageSchema = new mongoose.Schema({
    name: "string",
    email: "string",
    pass: "string"
});

const Message1 = new mongoose.model("Message", messageSchema);


const app = express();

// setting up view engine
app.set("view engine", "ejs");

// access dynamic ejs (looks like html) file
// we use RANDER METHOD to access Dynamic HTML (ejs) file
app.get("/", (req, res) => {
    res.render("home.ejs", { name: "Subham" });
});

// STATIC FILE access process

// to use and acccess  any (html,css,js) static file data -->> we have to use exact this "MIDDLEWARE"
app.use(express.static((path.join(path.resolve(), "public"))));

//how to access static only html/ static folder in node we have to use exact path loc

const pathlocc = path.join(path.resolve(), "public/staticIndex.html");
// console.log(pathlocc);

// app.use(express.static(pathlocc)); //(useless not working like this) to access static file

app.get("/a", (req, res) => {
    // res.sendFile ( (path.join(path.resolve(), "public/staticIndex.html") ) );
    res.sendFile(pathlocc);
});


//FORM DATA STORE TO DATABASE

//using built-in middleware func to access form data
app.use(express.urlencoded({ extended: true })); // in this middleware we can pass an object

//The express.urlencoded() middleware will parse the URL-encoded data and make it available to the request object. This data can then be accessed in the request handler.


// const users = [];

// we use RANDER METHOD to access Dynamic HTML (ejs) file
app.get("/form", (req, res) => {
    res.render("htmlForm.ejs");
});

app.post("/form", async (req, res) => {
    console.log(req.body);

    await Message1.create({ name: req.body.Fname, email: req.body.Email, pass: req.body.Password });

    // users.push({ formdata: req.body });
    // console.log(users);
    res.render("success.ejs");
});



// instead of then/catch we can use async and await--- for adding manually data in two ways----   WAY - 1

// app.get("/add", (req, res) => {
//     Message1.create({ name: "subham", email: "sample@gmail.com", password: "sub1234" }).then(() => { res.send("formdata added to database") }).catch((err) => { console.log(err) })
// });

// OR------------>   WAY - 2

// app.get("/add", async (req, res) => {
//     await Message1.create({ name: "subham sp", email: "sample2@gmail.com", password: "sub12345" });
//     res.send("data2 added to database");
// });


// app.get("/users", (req, res) => {
//     res.json({ user });
// });


// ---------------------------------------------


//Authentication part-- making normal handler named as "isAuthenticated"

// const isAuthenticated = (req,res,next) => {
//     const { token } = req.cookies;

//     if (token) {
//         console.log(token);
//         next();
//     } else {
//         console.log("token expired after 10 sec or logout pressed");
//         res.render("login.ejs");
//     }
// };

// app.get("/login", isAuthenticated, (req, res) => {
//     res.render("logout.ejs");

//     // res.render("login.ejs");
//     // console.log(req.cookies);
// });

// //here we use post coz with login we have to post the login credential data
// app.post("/login", (req, res) => {
//     res.cookie("token", "I'mloggedIn", {
//         httpOnly: true, expires: new Date(Date.now() + 10 * 1000)
//     });
//     res.redirect("/login");
// });

// //here we use get coz with logout we dont need any logout credential data
// app.get("/logout", (req, res) => {
//     res.cookie("token", "null", {
//         httpOnly: true, expires: new Date(Date.now())
//     });
//     res.redirect("/login");
// });

app.listen(PORT, () => {
    console.log(`server is working on ${PORT}`);
});
