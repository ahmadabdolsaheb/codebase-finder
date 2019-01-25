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

  //create a directories with nav md files
  if(!fs.existsSync(directory + "/" + country) && country != ""){
    fs.mkdirSync(directory + "/" + country, { recursive: true })
    let item = newItemMaker(i.country);
    fs.writeFileSync(directory + "/" + country + "/index.md", item);
    lastItemMatter = item;
    lastItemValue = i.country;
  }

  if(!fs.existsSync(directory + "/" + country + "/" + state ) && state != ""){
    fs.mkdirSync(directory + "/" + country + "/" + state, { recursive: true });
    let item = newItemMaker(i.state)
    fs.writeFileSync(directory + "/" + country + "/" + state + "/index.md", item);
    lastItemMatter = item;
    lastItemValue = i.state;
  }

  if(!fs.existsSync(directory + "/" + country + "/" + state + "/" + city ) && city != ""){
    fs.mkdirSync(directory + "/" + country + "/" + state + "/" + city, { recursive: true });
    let item = newItemMaker(i.city);
    fs.writeFileSync(directory + "/" + country + "/" + state + "/" + city + "/index.md", item);
    lastItemMatter = item;
    lastItemValue = i.city;
  }


  //if a directory exist, take the index.md file and put it in a location1
  //and place the new file to location2
  directory = mainDirectory + "/" + country + "/" + state + "/" + city;

  var file = fs.readFileSync(directory+'/index.md', 'utf8');

  //if the directory does not have a study group in it, take the old md and replace it with
  //study goup meta data
  if(file == lastItemMatter){
    fs.unlinkSync(directory+'/index.md');
    let item = mattermaker(lastItemValue, i.country, i.state, i.city,"", i.coordinates, i.photoUrl, i.url);
    fs.writeFileSync(directory + "/index.md", item);

  //if the directory already has a study group md, take the old one and nest it
  //neighborhood1, take the new study group and put it in neighborhood2
  //recreate the current directory's md file for navigation
  }else{
    var oldMd = fs.readFileSync(directory + '/index.md', 'utf8');
    var oldMtr = matter(lastItemMatter).data;
    let lastTitle = (matter(oldMd).data.title);
    let newItem = newItemMaker(lastTitle);

    fs.unlinkSync(directory+'/index.md');
    fs.writeFileSync(directory + "/index.md", newItem);

    fs.mkdirSync(directory + "/neighborhood-1");
    var neighborhood1item = mattermaker("neighborhood-1", oldMtr.country, oldMtr.state, oldMtr.city,"One" , oldMtr.coordinates, oldMtr.photoUrl, oldMtr.url);
    fs.writeFileSync(directory + "/neighborhood-1" + "/index.md", neighborhood1item);

    fs.mkdirSync(directory + "/neighborhood-2");
    let neighborhood2item = mattermaker("neighborhood-2", i.country, i.state, i.city,"Two", i.coordinates, i.photoUrl, i.url);
    fs.writeFileSync(directory + "/neighborhood-2" + "/index.md", neighborhood2item);
  }
}

//helper functions

function mattermaker(title, country, state, city, neighborhood, coordinates, photoUrl, url){

let item =
`---
title: ${title ? title: ''}
location:
  country: ${country ? country: ''}
  state: ${state ? state: ''}
  city: ${city ? city: ''}
  neighborhood: ${neighborhood ? neighborhood: ''}
  coordinates: ${coordinates ? coordinates: ''}
  plusCode: ''
social:
  name: Facebook
  URL: ${url ? url: ''}
chat:
  name: ''
  URL: ''
event:
  name: ''
  URL: ''
leaders:
- name: ''
  URL: ''
photos:
  old: ${photoUrl ? photoUrl: ''}
  cover: ''
---
`;
return item;
}

function newItemMaker(title){
  let item =
`---
title: ${title}
---`;
  return item;
}
console.log('App finished running');
