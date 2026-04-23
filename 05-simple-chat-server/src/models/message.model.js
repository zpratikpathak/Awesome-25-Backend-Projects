class Message {
  constructor(sender, text) {
    this.sender = sender;
    this.text = text;
    this.timestamp = new Date();
  }
}

module.exports = Message;
