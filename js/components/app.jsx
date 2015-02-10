var React = require('react');
var reader = new FileReader();
var audioMetaData = require('audio-metadata');
var _ = require('lodash');

var App = React.createClass({
  onDrop: function (e) {
    this.stopEvent(e);
    this.populateFileQueue(e.dataTransfer.files);
  },

  stopEvent: function (e) {
    e.stopPropagation();
    e.preventDefault();
  },

  componentDidMount: function () {
    reader.onload = this.fileLoaded;
    this.fileQueue = [];
  },

  fileLoaded: function(e) {
    var metadata = audioMetaData.id3v2(e.target.result);
    this.readFileFromQueue();
  },

  populateFileQueue: function (files) {
    _.each(files, function(file) {
      this.fileQueue.push(file)
    }.bind(this));

    this.readFileFromQueue();
  },

  readFileFromQueue: function () {
    var file = this.fileQueue.pop();
    if (file) reader.readAsArrayBuffer(file);
  },

  render: function () {
    return (
      <div id="app-wrapper">
        <h1>Audiodyssey</h1>
        <div id="dropbox" className="well" onDrop={this.onDrop} onDragOver={this.stopEvent} onDragEnter={this.stopEvent}>
          <h4 className="text-center">Drop Files Here</h4>
        </div>
      </div>
    );
  }
});

module.exports = App;

