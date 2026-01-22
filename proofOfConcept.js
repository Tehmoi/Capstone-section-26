import fs from "fs";
const wordsInContent = "about 2 header"
const content = '<%- include("partials/header.ejs") %><h1>'+wordsInContent+'</h1><%- include("partials/footer.ejs") %>';
const addedContent = 'second line'

fs.readFile('views/create.ejs', 'utf-8', readingFile)
function readingFile(error, data) {
  if (error) {
      console.log(error);
  } else {
      console.log(data); // Printing the create.ejs file's content

      // Creating new file - paste.txt with file.txt's content
      fs.writeFile('views/paste.ejs', data, 'utf8', writeFile);
  }
}

function writeFile(error) {
  if (error) {
      console.log(error)
  } else {
      console.log('Content has been pasted to paste.txt file');
  }
}

try {
  fs.writeFileSync('views/test.ejs', (content + '\n'+ addedContent));
  // file written successfully
} catch (err) {
  console.error(err);
}
/*Proof of concept works as is for writing as file. and copying should also work
The question being of how to copy a file, and implant an href into a a dictionary could be how we solve
the issue of listing new posts onto the main page. The main struggles of this capstone are within reach
Next plan is to copy the file of the submit. thus making the new file and send it to the server. 
when the new file is sent to the server it also adds to the list in the index. containing the 
dict{bookname : href} as the respective key and value. witht his no new gets need to be made
when the get dict{bookname} is used in the app.get section we can make this modular allowing any
post to be displayed. The whole server doesnt need to modulate, the post section does.*/ 