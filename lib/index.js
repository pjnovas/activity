
var EventEmitter = require('events').EventEmitter
  , _ = require('underscore')
  , util = require('util')
  , StatusNotFound = require('./errors/StatusNotFound');
  
var Activity = module.exports = function (options) {
  this._statuses = options.statuses;

  this._idsByStatus = {};

  _.each(this._statuses, function(status){
    this._idsByStatus[status] = [];
  }, this);

  this._statusById = {};
};

util.inherits(Activity, EventEmitter);

Activity.prototype.setStatus = function(id, status, done) {
  
  if (this._statuses.indexOf(status) === -1){
    done(new StatusNotFound());
  }
  else {
    var prevStatus = this._statusById[id];

    this._statusById[id] = status;

    if (prevStatus){
      var idx = this._idsByStatus[prevStatus].indexOf(id);
      this._idsByStatus[prevStatus].splice(idx, 1);
    }

    this._idsByStatus[status].push(id);

    done();
  }

  return this;
};

Activity.prototype.getIds = function(status, done) {
  done(null, this._idsByStatus[status]);
};

Activity.prototype.getStatus = function(idOrIds, statusOrDone, done) {
  var status;

  if (_.isFunction(statusOrDone)){
    done = statusOrDone;
  }
  else {
    status = statusOrDone;
  }

  if (_.isArray(idOrIds)){
    var founds = {};

    _.each(idOrIds, function(id){
      if (status && status === this._statusById[id]){
        founds[id] = this._statusById[id];
      }
      else if (!status) {
        founds[id] = this._statusById[id]; 
      }
    }, this);

    done(null, founds);
  }
  else {
    done(null, this._statusById[idOrIds]);
  }

  return this;
};

Activity.prototype.destroy = function(done) {
  for(var p in this._idsByStatus){
    this._idsByStatus[p] = [];
    delete this._idsByStatus[p];
  }

  for(var p in this._statusById){
    delete this._statusById[p];
  }

  this._idsByStatus = null;
  this._statusById = null;
  this._statuses = null;

  done();
};

Activity.error = {
  StatusNotFound: require('./errors/StatusNotFound')
};