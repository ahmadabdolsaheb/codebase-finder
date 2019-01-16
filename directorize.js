console.log('App started running');
const matter = require('gray-matter');
var fs = require('fs');
var rimraf = require("rimraf");
var obj = JSON.parse(fs.readFileSync('studygroups.json', 'utf8'));
var mainDirectory = "pages";
let lastItemMatter = ``;
rimraf.sync(mainDirectory);

for(let i of obj){
  let directory = mainDirectory + "/";
      lastItemMatter = ``;
  let lastItemValue;
  //replace spaces with hypthens
  let city = i.city.replace(/\s/g, '-');
  let state = i.state.replace(/\s/g, '-');
  let country = i.country.replace(/\s/g, '-');

  //create a directory
  if(!fs.existsSync(directory + "/" + country) && country != ""){
    fs.mkdirSync(directory + "/" + country, { recursive: true }, (err) => {
      if (err) throw err;
    });
    let item =
`---
title: ${i.country}
---`;
    fs.writeFileSync(directory + "/" + country + "/index.md", item);
    lastItemMatter = item;
    lastItemValue = i.country;
  }

  if(!fs.existsSync(directory + "/" + country + "/" + state ) && state != ""){
    fs.mkdirSync(directory + "/" + country + "/" + state, { recursive: true }, (err) => {
      if (err) throw err;
    });
    let item =
`---
title: ${i.state}
---`;
    fs.writeFileSync(directory + "/" + country + "/" + state + "/index.md", item);
    lastItemMatter = item;
    lastItemValue = i.state;
  }

  if(!fs.existsSync(directory + "/" + country + "/" + state + "/" + city ) && city != ""){
    fs.mkdirSync(directory + "/" + country + "/" + state + "/" + city, { recursive: true }, (err) => {
      if (err) throw err;
    });
    let item =
`---
title: ${i.city}
---`;
    fs.writeFileSync(directory + "/" + country + "/" + state + "/" + city + "/index.md", item);
    lastItemMatter = item;
    lastItemValue = i.city;
  }


  //if a directory exist, take the index.md file and put it in a location1
  //and place the new file to location2
  directory = mainDirectory + "/" + country + "/" + state + "/" + city;

  var file = fs.readFileSync(directory+'/index.md', 'utf8');


  if(file == lastItemMatter){
    fs.unlinkSync(directory+'/index.md');
    let item = mattermaker(lastItemValue, i.country, i.state, i.city,"", i.coordinates, i.photoUrl, i.url);
    fs.writeFileSync(directory + "/index.md", item);
  }else{
    var oldMd = fs.readFileSync(directory + '/index.md', 'utf8');
    var oldMtr = matter(lastItemMatter).data;
    fs.unlinkSync(directory+'/index.md');

    fs.mkdirSync(directory + "/neighborhood-1", { recursive: true }, (err) => {
      if (err) throw err;
    });
    var neighborhood1item = mattermaker("neighborhood-1", oldMtr.country, oldMtr.state, oldMtr.city,"" , oldMtr.coordinates, oldMtr.photoUrl, oldMtr.url);
    fs.writeFileSync(directory + "/neighborhood-1" + "/index.md", neighborhood1item);

    fs.mkdirSync(directory + "/neighborhood-2", { recursive: true }, (err) => {
      if (err) throw err;
    });
    let neighborhood2item = mattermaker("neighborhood-2", i.country, i.state, i.city,"", i.coordinates, i.photoUrl, i.url);
    fs.writeFileSync(directory + "/neighborhood-2" + "/index.md", neighborhood2item);
  }
}
console.log(lastItemMatter);
console.log(matter(lastItemMatter).data.title);

function mattermaker(title, country, state, city, neighborhood, coordinates, photoUrl, url){
let item =
`---
title: ${title}
country: ${country}
state: ${state}
city: ${city}
neighborhood: ${neighborhood}
coordinates: ${coordinates}
plusCode:
---
Join our [Facebook group](${url}).

You can chat with us on [WeChat](wechat URL).

Our Group leader is [Miya](freecodecamp.org/miya)

Here are some pictures from our recent events:
![](${photoUrl}).

Here's a stream of one of our recent events:
[youtube embed]

We have events every Tuesday. You can RSVP for an event on [meetup](meetupurl).
`;
return item;
}
