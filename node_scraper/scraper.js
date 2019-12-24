const request = require('request');
const cheerio = require('cheerio');

// constants 
const urlToScrap = "https://dl.bintray.com/ironsource-mobile/unity-adapters/";
const extension = ".unitypackage";
const prefix = "IronSource";
const suffix = "Adapter";
const versionFormat = "_v";

// variables
var result = {
  json: {},

  /**
   * Adds the element that was just processed to the object containing the expected result
   *
   * @param {String} elem cheerio object, represents the current item to append to the result
   */
  appendElement: function(elem) {
    // for this element, extracts the name and the version
    const packageInfos = elem.text().split(versionFormat);
    const packageName = this.getPackageName(packageInfos[0]);
    const version = packageInfos[1].replace(extension, '');
    // gets the download link from the href attribute with cheerio
    const dlLink = elem.children().attr('href');
  
    // checks whether a similar packageName has already been added
    if(!this.json.hasOwnProperty(packageName)) {
      this.json[packageName] = {};
    }
    // adds version and download link to the result object
    this.json[packageName][version] = dlLink.startsWith('http') ? dlLink : urlToScrap + dlLink;
  },

  /**
   * "trims" the name of the unity package to have a clean output
   *
   * @param {String} name The module name, to clean remove suffix and prefix from
   */
  getPackageName: function(name) {
    if (name.startsWith(prefix)) {
      name = name.substr(prefix.length);
    }
    if (name.endsWith(suffix)) {
      name = name.substr(0, name.length - suffix.length);
    }
    return name;
  }
};

// use request and cheerio modules to ease the scraping
request(urlToScrap, function (error, response, body) {
  if (!error) {
    const $ = cheerio.load(body);

    // filters on pre elements that concern unity packages
    $('pre').filter(function(i, item) {
      return $(this).text().endsWith(extension);
    }).each(function(i, item) {
      result.appendElement($(this));
    });
    console.log(result.json);
  }
  else {
    console.log("Error: " + error);
  }
})
