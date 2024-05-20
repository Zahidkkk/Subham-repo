import express from "express";

import fs from "fs";
import path from "path";

// instead of const server we use const app in express //

const app = express();

app.get("/", (req, res) => {
    res.send("<h1> Hi Bro</h1>");
});

app.get("/about", (req, res) => {
    // res.json({ name: "Subham", company: "CTS"});
    // res.sendStatus(400);

    res.status(404).json({ name: "Subham", company: "CTS", projects: [] });
    // res.status(404).send("Message with console status code 404");
});

app.get("/*", (req, res) => {

    console.log(path.resolve());
    const pathloc = path.resolve();
    console.log(path.join(pathloc, "./index.html"));

    res.sendFile( path.join(pathloc, "./index.html") );

})

app.listen(8000, () => {
    console.log("Server is working !!");
});