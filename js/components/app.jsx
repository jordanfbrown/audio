var React = require('react');
var reader = new FileReader();
var audioMetaData = require('audio-metadata');
var _ = require('lodash');
var {Button, ModalTrigger, ButtonToolbar} = require('react-bootstrap');
var AddSongsModal = require('./add_songs_modal.jsx')
var CAMELOT_MAP = {
  'Abmin': '1A',
  'Ebmin': '2A',
  'Bbmin': '3A',
  'Fmin': '4A',
  'Cmin': '5A',
  'Gmin': '6A',
  'Dmin': '7A',
  'Amin': '8A',
  'Emin': '9A',
  'Bmin': '10A',
  'F#min': '11A',
  'Dbmin': '12A',
  'Bmaj': '1B',
  'F#maj': '2B',
  'Dbmaj': '3B',
  'Abmaj': '4B',
  'Ebmaj': '5B',
  'Bbmaj': '6B',
  'Fmaj': '7B',
  'Cmaj': '8B',
  'Gmaj': '9B',
  'Dmaj': '10B',
  'Amaj': '11B',
  'Emaj': '12B'
};

var App = React.createClass({
  getInitialState: function() {
    return {
      songs: JSON.parse(localStorage.getItem('songs') || '[]')
    }
  },

  componentDidMount: function () {
    reader.onload = this.fileLoaded;
    this.fileQueue = [];
  },

  fileLoaded: function(e) {
    var metadata = audioMetaData.id3v2(e.target.result);

    if (!metadata) {
      this.showError('Unable to read song information.');
      this.readFileFromQueue();
      return;
    }

    var song = {
      artist: metadata.artist || metadata.TALB,
      title: metadata.title || metadata.TIT2,
      bpm: metadata.TBPM,
      key: metadata.TKEY,
      matching: false
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
    localStorage.removeItem('songs');
    this.setState({ songs: [] })
  },

  showError: function(error) {
    this.setState({ error: error });
    _.delay(function() {
      this.setState({ error: null })
    }.bind(this), 5000);
  },

  filterByKey: function (key) {
    var camelotKey = CAMELOT_MAP[key];
    if (camelotKey) {
      var matches = camelotKey.match(/(\d+)([AB])/);
      var number = parseInt(matches[1]);
      var letter = matches[2];
      var upper = number + 1 == 13 ? 1 : number + 1;
      var lower = number - 1 == 0 ? 12 : number - 1;
      var oppositeLetter = letter == 'A' ? 'B' : 'A';
      var matchingKeys = [upper + letter, lower + letter, number + oppositeLetter];
      
      this.state.songs.forEach(function(song) {
        var camelotKey = CAMELOT_MAP[song.key];
        song.matching = _.include(matchingKeys, camelotKey);
      });

      this.setState({ songs: this.state.songs });
    }
  },

  render: function () {
    var errorAlert;

    if (this.state.error) {
      errorAlert = <div className="alert alert-danger bottom-affix" role="alert">{this.state.error}</div>;
    }

    var modal = <AddSongsModal populateFileQueue={this.populateFileQueue} />;
    var rows = this.state.songs.map(function(song) {
      return (
        <tr onClick={_.partial(this.filterByKey, song.key)} className={song.matching ? 'success' : ''}>
          <td>{song.artist}</td>
          <td>{song.title}</td>
          <td>{song.bpm}</td>
          <td>{song.key}</td>
        </tr>
      );
    }.bind(this));

    return (
      <div id="app-wrapper">
        <h1>Audiodyssey</h1>
        <hr />
        <ButtonToolbar>
          <ModalTrigger modal={modal}>
            <Button bsStyle="primary">Add Songs</Button>
          </ModalTrigger>
          <Button bsStyle="danger" onClick={this.clearSongs}>Clear Songs</Button>
        </ButtonToolbar>
        <hr />
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
        {errorAlert}
      </div>
    );
  }
});

module.exports = App;

