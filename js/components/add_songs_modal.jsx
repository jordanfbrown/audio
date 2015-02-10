var React = require('react');
var {Modal, Button} = require('react-bootstrap');

var AddSongsModal = React.createClass({
  onDrop: function (e) {
    this.stopEvent(e);
    this.props.populateFileQueue(e.dataTransfer.files);
  },

  stopEvent: function (e) {
    e.stopPropagation();
    e.preventDefault();
  },

  render: function () {

    return (
      <Modal title="Add Songs" onRequestHide={this.props.onRequestHide}>
        <div className="modal-body">
          <div id="dropbox" onDrop={this.onDrop} onDragEnter={this.stopEvent} onDragOver={this.stopEvent}>
            <h4 className="text-center">Drop songs here</h4>
          </div>
        </div>
        <div className="modal-footer">
          <Button onClick={this.props.onRequestHide}>Close</Button>
        </div>
      </Modal>
    )
  }
});

module.exports = AddSongsModal;