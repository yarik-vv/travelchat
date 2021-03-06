const crypto = require('crypto');
const HttpError = require('error').HttpError;
const mongoose = require('libs/mongoose');
const Schema = mongoose.Schema;
const log = require('libs/log')(module);

var schema = new Schema({
  username: {
    type: String,
    unique: true, 
    required: true 
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });

schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = (username, password) => {
  const User = this.User;

  return new Promise((resolve, reject) => {
    User.findOne({username: username}).exec((err, user) => {
      if(err){
        reject(err);
      }
      if(user){
        if(user.checkPassword(password)){ 
          log.info(username+' - sign in.');
          resolve(user);
        }
        else {
          log.warn(username+' - vvel ne pravilnuy parol');
          reject(new HttpError(403, "Invalid password"));
        }
      } 
      else{
        user=new User({username: username, password: password});
        user.save( (err) => {
          if(!err){
            resolve(user);
          }
          else{
            reject(err);
          }
        })
      }
    });
  });
};

schema.statics.removeUser = (id) => {
  const User = this.User;

  return new Promise((resolve, reject) => {
    User.deleteOne({ "_id" : id }).exec((err) => {
      if(err){
        log.error('Ne udalos udalit usera s id: '+id);
        reject();
      }
      else{
        log.warn('Udalen user s id: '+id);
        resolve();
      }
    });
  });
};

exports.User = mongoose.model('User', schema);