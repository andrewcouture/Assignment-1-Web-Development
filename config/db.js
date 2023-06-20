const DB = {
  URI: 'mongodb+srv://basic123:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};

module.exports = DB;