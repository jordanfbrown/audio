var React = require('react');
var reader = new FileReader();
var audioMetaData = require('audio-metadata');
var _ = require('lodash');
var Table = require('reactable').Table;

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
      Artist: metadata.artist || metadata.TALB,
      Title: metadata.title || metadata.TIT2,
      BPM: metadata.TBPM,
      KEY: metadata.TKEY,
    };

    if (_.where(this.state.songs, song).length) {
      this.showError(song.Title + ' has already been added.')
    }
    else {
      var songs = this.state.songs.concat(song);
      this.setState({ songs: songs });
      localStorage.setItem('songs', JSON.stringify(songs));
    }

    this.readFileFromQueue();
  },

  populateFileQueue: function (files) {
    _.each(files, function(file) { this.fileQueue.push(file) }.bind(this));
    this.readFileFromQueue();
  },

  readFileFromQueue: function () {
    var file = this.fileQueue.pop();
    if (file) reader.readAsArrayBuffer(file);
  },

  clearSongs: function() {
    localStorage.removeItem('songs')
    this.setState({ songs: [] })
  },

  showError: function(error) {
    this.setState({ error: error })
    _.delay(function() {
      this.setState({ error: null })
    }.bind(this), 5000);
  },

  render: function () {
    var errorAlert;

    if (this.state.error) {
      errorAlert = <div className="alert alert-danger bottom-affix" role="alert">{this.state.error}</div>;
    }

    return (
      <div id="app-wrapper">
        <h1>Audiodyssey</h1>
        <div id="dropbox" className="well" onDrop={this.onDrop} onDragOver={this.stopEvent} onDragEnter={this.stopEvent}>
          <h4 className="text-center">Drop Files Here</h4>
        </div>
        <hr />
        <button className="btn btn-danger" type="button" onClick={this.clearSongs}>Clear Songs</button>
        <hr />
        <Table className="table table-striped" data={this.state.songs} sortable={true} />
        {errorAlert}
      </div>
    );
  }
});

module.exports = App;

