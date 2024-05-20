// const http = require("http");

import http from "http";
import city1, {city2, city3, city4} from "./variables.js";
import {generateLovePercent} from "./variables.js"

import fs from "fs";
import { error } from "console";

// const error = fs.readFileSync("./index.html","utf-8");
// console.log(error);

console.log(city1, city2, city3, city4);
console.log("love percentage is" + " " + generateLovePercent());

const server = http.createServer((req, res)=> {
    if(req.url === "/") {
        res.end(`<h1>Welcome to Home page </br> Your love percentage is ${generateLovePercent()}</h1>`); 
    }
    else if(req.url === "/about") {
        res.end("<h1>Welcome to About page</h1>"); 
    } else if(req.url === "/contact") {
        res.end("<h1>Welcome to Contact page</h1>"); 
    } 
    else {
        fs.readFile("./index.html","utf-8", (err, data) => {
            res.end(data);
            console.log(data);
        });
    
        }

    // console.log(req.url); 
});

server.listen(5000, ()=>{
    console.log("server is working");
});