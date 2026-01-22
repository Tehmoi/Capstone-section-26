import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { title } from "process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

var nameTest = "about";
var bookList = {};

var editForm = ('<form id="hiddenForm" action="/submit" method="POST">'+
    '<input type="text" name="fileName" id="nameOfFile" placeholder="Title">'+
    '<input type="text" name="title" id="nameOfTitle" placeholder="Chapter">'+ 
    '<input type="file" name="giveFile" placeholder="upload file">'+
    '<br>'+
    '<textarea name="insertText" id="fullBody" placeholder="Body of text"></textarea>'+
    '<script>$("#fullBody").autogrow();</script>\n\n' +
    '<br>\n\n'+
    '<input type="submit" value="OK">'+
    '</form>'+
    '</br>');



app.use(express.static("public"));//having an end '/' to deal with MIME type. Any MIME issues, revove /

app.use(bodyParser.urlencoded({ extended: true }));//likely dont need. this is a personal site


app.get("/", (req, res) => {
    //Step 1 - Make the get route work and render the index.ejs file.
    var haps = bookList; //booklist is a variable from 1 level above, therefore renders the list
    // res.render("index.ejs", {listings:haps}); //renders on index every the title:value of the haps
    //console.log(haps);

    const folderpath = path.join(__dirname, "views/Books");
    fs.readdir(folderpath, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to read folder");
    }
     res.render("index.ejs", {listings:haps, files:files});
     console.log(files);
  });
  });
  app.get("/edit", (req, res) => {
    //Step 1 - Make the get route work and render the index.ejs file.
    var haps = bookList; //booklist is a variable from 1 level above, therefore renders the list
    // res.render("index.ejs", {listings:haps}); //renders on index every the title:value of the haps
    //console.log(haps);

    const folderpath = path.join(__dirname, "views/Books");
    fs.readdir(folderpath, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to read folder");
    }
     res.render("edit.ejs", {listings:haps, files:files});
     console.log(files);
  });
  });
  // app.get("/:name", (req, res) => { //this is what allows any .ejs page to run this is neededor speficic functions are needed
  //   //make dynamic locations for book retrieval.
  //   const name = req.params.name;
    
  //   res.render(name+".ejs", {listings:bookList}); //dynamically renders files in book listing.
  // });
  app.get("/:name", (req, res, next) => {
  const name = req.params.name;

  // Block anything that looks like a file request
  if (name.includes(".")) {
    return next();
    
  }

  res.render(name + ".ejs", { listings: bookList });
});
  app.get("/Books/:name", (req, res) => {
    //make dynamic locations for book retrieval.
    const name = req.params.name;
    
    res.render("Books/"+name+".ejs", {listings:bookList}); //dynamically renders files in book listing.
  });
  app.get("/contact", (req, res) => {
    res.render("contact.ejs"); 
  });
  // app.get(`/${nameTest}`, (req, res) => {
  //   res.render(`${nameTest}.ejs`, {siteName : nameTest});
  //   //concept for dynamic rendering of multiple book pages using the bookList dictionary at the top
  //   // each key should be 'example', used for app.get and render using the dictionary containing dictionary
  //   //appears viable
  //   //run without this and test.
  // });
  app.get("/create", (req, res) => {
    res.render("create.ejs");
  });
  app.post("/submit", (req, res) => {
    var submissionCreated = { fileCreate :req.body["fileName"], postTitle :req.body["title"],
    bodyText: req.body["insertText"]};
    
    console.log(submissionCreated);
    res.render("submit.ejs", {file : submissionCreated["fileCreate"],
     title : submissionCreated["postTitle"], body : submissionCreated["bodyText"]} );
     //below is the content of the body and title turning into a new page.
    var content = ('<!DOCTYPE html>\n\n<html lang="en">\n\n<head>\n<meta charset="UTF-8">'+
   ' <meta http-equiv="X-UA-Compatible"\n content="IE=edge">' + '<meta name="viewport"'+ 
   'content="width=device-width, initial-scale=1.0"></meta>\n</head>'+'<body> \n'+
    '<link type="text/css" rel="stylesheet" href="/styles/styles.css">'+
      '<%- include("../partials/header.ejs") %><h1 id ="fileName">'+submissionCreated["fileCreate"]+
      '</h1>'+'\n\n<h2 id= "Title">' +submissionCreated["postTitle"]+'</h2>'+
      '\n\n<p id= "Text">'+submissionCreated["bodyText"] +'</p>' +
      '<button id="editButton" style="background-color: rgb(116, 116, 150); color: aliceblue;"> Edit Post</button>\n\n'+
      editForm +'\n\n'+
    '<%- include("../partials/footer.ejs") %> \n\n'+
  '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>\n' +
  '<script src="/JS/edit.js"></script>\n</body> \n</html>');


      
       //creates the input into the page
      //id's added to title and text fields for editing the fields through seperate page easier.

    //CODE BELOW IS WHAT CREATES THE DICTIONARY ENTRY. FILENAME AND TITLE ARE KEY:VALUE
    bookList[req.body["fileName"]] = req.body["title"];//adds them to book list at index
     try {
      fs.writeFileSync('views/Books/'+submissionCreated["fileCreate"]+'.ejs', (content + '\n'));
      // file written successfully
    } catch (err) {
      console.error(err);
    }
    console.log(bookList)
   });
  app.post("/delete", (req, res) => {
    var deleteTarget = {craps: req.body["fileName"]};
    var delBook = bookList;
    console.log("delBook");
    console.log(delBook);
    console.log("bookList");
    console.log(bookList);
    delete delBook[deleteTarget["craps"]];
    fs.unlinkSync('views/Books/'+deleteTarget["craps"]+'.ejs')//file should delete: Success book is still in the list
    
    bookList = delBook;//turn the main list into the del list, because it would be the freshest ver.
    console.log("new list");
    console.log(bookList); //the file and dictionary deletion finally works, need to work on CSS next.
    //index page still reads deleted fiel 
    
    
  });

  app.get("public/styles/styles.css", (req, res) => {
  res.type("text/css");
  res.sendFile(path.join(__dirname, "public/styles/styles.css"));
});

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

 