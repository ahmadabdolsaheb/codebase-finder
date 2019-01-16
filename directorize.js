console.log('App started running');

var fs = require('fs');

var obj = JSON.parse(fs.readFileSync('studygroups.json', 'utf8'));

for(let i of obj){

  //remove spaces
  let city = i.city.replace(/\s/g, '-');
  let state = i.state.replace(/\s/g, '-');
  let country = i.country.replace(/\s/g, '-');

  //create a directory
  let directory = "locations/" + country + "/" + state + "/" + city;

  //if a directory exist, take the index.md file and put it in a location1
  //and place the new file to location2
  if(fs.existsSync(directory)){
    if(fs.existsSync(directory+'/index.md')){
      var file1 = fs.readFileSync(directory+'/index.md', 'utf8');
      fs.mkdirSync(directory+"/location2", { recursive: true }, (err) => {
        if (err) throw err;
      });
      fs.writeFileSync(directory + "/location2/index.md", file1);
      fs.unlinkSync(directory+'/index.md');
    }
    directory+="/location1"
  }


  fs.mkdirSync(directory, { recursive: true }, (err) => {
    if (err) throw err;
  });

  let item =
`---
country: ${i.country}
state: ${i.state}
city: ${i.city}
neighborhood:
coordinates: ${i.coordinates}
plusCode:
leader:
photoUrl: ${i.photoUrl}
videoUrl:
socialUrl: ${i.url}
messagingUrl:
eventUrl:
---`;
  fs.writeFileSync(directory + "/index.md", item);
}
