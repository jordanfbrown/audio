"use strict";

var audioMetaData = require("audio-metadata"),
    fs = require("fs"),
    dir = "/Users/jordan/Music/February/";

var results = {};

fs.readdir(dir, function (err, files) {
  files.forEach(function (file) {
    if (file.indexOf("mp3") !== 0) {
      fs.readFile(dir + file, function (err, fileData) {
        var metadata = audioMetaData.id3v2(fileData);
        if (metadata) results[file] = metadata.TKEY;
      });
    }
  });
});