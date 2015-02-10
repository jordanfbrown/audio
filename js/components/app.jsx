var React = require('react');
var reader = new FileReader();
var audioMetaData = require('audio-metadata');
var _ = require('lodash');

var App = React.createClass({
  getInitialState: function() {
    return {
      songs: JSON.parse(localStorage.getItem('songs') || '[]')
    }
  },

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
    var song = {
      artist: metadata.artist || metadata.TALB,
      title: metadata.title || metadata.TIT2,
      bpm: metadata.TBPM,
      key: metadata.TKEY
    };
    var songs = this.state.songs.concat(song);
    this.setState({ songs: songs });
    localStorage.setItem('songs', JSON.stringify(songs));
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
    var rows = this.state.songs.map(function(song) {
      return (
        <tr>
          <td>{song.artist}</td>
          <td>{song.title}</td>
          <td>{song.bpm}</td>
          <td>{song.key}</td>
        </tr>
      )
    });

    return (
      <div id="app-wrapper">
        <h1>Audiodyssey</h1>
        <div id="dropbox" className="well" onDrop={this.onDrop} onDragOver={this.stopEvent} onDragEnter={this.stopEvent}>
          <h4 className="text-center">Drop Files Here</h4>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Artist</th>
              <th>Title</th>
              <th>BPM</th>
              <th>Key</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = App;

