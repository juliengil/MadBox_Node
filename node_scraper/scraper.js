const request = require('request');
const cheerio = require('cheerio');

// constants 
const urlToScrap = "https://dl.bintray.com/ironsource-mobile/unity-adapters/";
const extension = ".unitypackage";
const prefix = "IronSource";
const suffix = "Adapter";
const versionFormat = "_v";

/**
 * Holds the result as a json object
 */
var result = {
  json: {},

  /**
   * Adds the element that was just processed to the object containing the expected result
   *
   * @param {packageElement} elem represents the current item to append to the result
   */
  appendElement: function(elem) {
    // checks whether a similar packageName has already been added
    if (!this.json.hasOwnProperty(elem.name)) {
      this.json[elem.name] = {};
    }
    // adds version and download link to the result object
    this.json[elem.name][elem.version] = elem.link;
  }
};

/**
 * Holds values for one package
 */
var packageElement = {
  // values for the package
  name: "",
  version: "",
  link: "",

  /**
   * Extracts the values of a package for a given cheerio element
   * @param {Object} cheerioElem the object to parse to obtain the desired values
   */
  parse: function(cheerioElem) {
    // for this element, extracts the name and the version
    packageInfos = cheerioElem.text().split(versionFormat);
    this.name = this.getPackageName(packageInfos[0]);
    this.version = packageInfos[1].replace(extension, '');
    // gets the download link from the href attribute with cheerio
    this.link = cheerioElem.children().attr('href');
    this.link = this.link.startsWith('http') ? this.link : urlToScrap + this.link;
    return this
  },

  /**
   * "Trims" the name of the unity package to have a clean output
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
      result.appendElement(packageElement.parse($(this)));
    });
    console.log(result.json);
  }
  else {
    console.log("Error: " + error);
  }
})
