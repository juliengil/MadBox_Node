const request = require('request');
const cheerio = require('cheerio');

// constants 
const urlToScrap = "https://dl.bintray.com/ironsource-mobile/unity-adapters/";
const extension = ".unitypackage";
const prefix = "IronSource";
const suffix = "Adapter";
const versionFormat = "_v";

// variables
var list = [];
var jsonResult = {};

// "trims" the name of the unity package to have a clean output
var nameShortener = function(name) {
  if (name.startsWith(prefix)) {
    name = name.substr(prefix.length);
  }
  if (name.endsWith(suffix)) {
    name = name.substr(0, name.length - suffix.length);
  }
  return name;
};

// adds the element that was just processed to the object containing the expected result
var addValuesToResult = function(package, version, dlLink) {
  // checks whether a similar package has already been added
  if(!jsonResult.hasOwnProperty(package)) {
    jsonResult[package] = {};
  }
  // adds version and download link to the result object
  jsonResult[package][version] = dlLink.startsWith('http') ? dlLink : urlToScrap + dlLink;
};

// use request and cheerio modules to ease the scraping
request(urlToScrap, function (error, response, body) {
  if (!error) {
    const $ = cheerio.load(body);

    // filters on pre elements that concern unity packages
    $('pre').filter(function(i, item) {
      return $(this).text().endsWith(extension);
    }).each(function(i, item) {
      // for each element, gets the name and the version
      const packageInfos = $(this).text().split(versionFormat);
      const name = nameShortener(packageInfos[0]);
      const version = packageInfos[1].replace(extension, '');
      
      // gets the download link from the href attribute with cheerio
      const dlLink = $(this).children().attr('href');

      addValuesToResult(name, version, dlLink);
    });
    console.log(jsonResult);
  }
  else {
    console.log("Error: " + error);
  }
})
