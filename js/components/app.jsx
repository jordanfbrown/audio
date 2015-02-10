var React = require('react');
var reader = new FileReader();
var audioMetaData = require('audio-metadata');
var _ = require('lodash');
var Table = require('reactable').Table;
var {Button, ModalTrigger, ButtonToolbar} = require('react-bootstrap');
var AddSongsModal = require('./add_songs_modal.jsx')

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
      this.showError('Unable to read song information.')
      return;
    }

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

    var modal = <AddSongsModal populateFileQueue={this.populateFileQueue} />;

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
        <Table className="table table-striped" data={this.state.songs} sortable={true} />
        {errorAlert}
      </div>
    );
  }
});

module.exports = App;

