var fs = require("fs");
const path = require("path");

console.log("App started running");

var regex = /['"\(]\S*imgur\.com\S*[\)"|']/g;

function filewalker(dir, done) {
  let results = [];

  fs.readdir(dir, function(err, list) {
    if (err) return done(err);

    var pending = list.length;

    if (!pending) return done(null, results);

    list.forEach(function(file) {
      file = path.resolve(dir, file);

      fs.stat(file, function(err, stat) {
        // If directory, execute a recursive call

        if (stat && stat.isDirectory()) {
          // Add directory to array [comment if you need to remove the directories from the array]
          //console.log(`dir:${file}`);
          if (
            file.match(/(node_modules|\.cach|client\/public|\.map)/g) === null
          ) {
            filewalker(file, function(err, res) {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          }
        } else {
          //console.log(`fil:${file}`);
          var openFile = fs.readFileSync(file, "utf8");
          var matches = openFile.match(regex);
          if (matches !== null) {
            matches.forEach(item => {
              results.push(item);
              console.log(file);
              console.log(item);
            });
            console.log(matches);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

filewalker("../freecodecamp/curriculum", function(err, data) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("start jsonfy");
  console.log(data);
  //   fs.unlinkSync("urls.json");

  //   data = [...new Set(data)];

  //   var jsonData = `{"urls":[${data}]}`;

  //   var jsonObj = JSON.parse(jsonData);
  //   console.log(jsonObj);

  //   // stringify JSON Object
  //   var jsonContent = JSON.stringify(jsonObj);
  //   console.log(jsonContent);

  //   fs.writeFile("urls.json", jsonContent, "utf8", function(err) {
  //     if (err) {
  //       console.log("An error occured while writing JSON Object to File.");
  //       return console.log(err);
  //     }

  //     console.log("JSON file has been saved.");
  //   });
});
