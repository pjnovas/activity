
var expect = require('expect.js')
  , _ = require('underscore')
  , Activity = require('../../lib')
  , StatusNotFound = require('../../lib/errors/StatusNotFound');

describe('Activity', function(){
  
  function createActivity(options){
    return new Activity(options || {
      statuses: ["online", "offline", "away"]
    });
  }

  function createTestStatusesActivity(done){
    var activity = createActivity();
    activity.setStatus('uid1', 'online', function(err){
      expect(err).to.not.be.ok();
      activity.setStatus('uid2', 'away', function(err){
        expect(err).to.not.be.ok();
        activity.setStatus('uid3', 'offline', function(err){
          expect(err).to.not.be.ok();
          done(activity);
        });
      });
    });
  }

  it('should allow to set statuses', function(){
    var activity = createActivity();
    expect(activity._statuses).to.be.an('array');
    expect(activity._statuses[0]).to.be.equal('online');
    expect(activity._statuses[1]).to.be.equal('offline');
    expect(activity._statuses[2]).to.be.equal('away');

    expect(activity._idsByStatus['online']).to.be.an('array');
    expect(activity._idsByStatus['offline']).to.be.an('array');
    expect(activity._idsByStatus['away']).to.be.an('array');
  });

  it('should allow to set an status', function(done){
    var activity = createActivity();

    activity.setStatus('uid1', 'online', function(err){
      expect(err).to.not.be.ok();

      expect(activity._statusById['uid1']).to.be.equal('online');
      expect(activity._idsByStatus['online']).to.be.an('array');
      expect(activity._idsByStatus['online'][0]).to.be.equal('uid1');
      done();
    });
  });

  it('should throw an error if status is invalid', function(done){
    var activity = createActivity();

    activity.setStatus('uid1', 'falseStatus', function(err){
      expect(err).to.be.ok();
      expect(err).to.be.a(StatusNotFound);
      done();
    });
  });

  it('should allow to get an status of one or several ids', function(done){
    createTestStatusesActivity(function(activity){
      activity.getStatus(['uid1', 'uid2'], function(err, statuses){
        expect(err).to.not.be.ok();

        expect(statuses['uid1']).to.be.equal('online');
        expect(statuses['uid2']).to.be.equal('away');

        activity.getStatus('uid3', function(err, status){
          expect(status).to.be.equal('offline');

          done();
        });    
      });
    });
  });

  it('should allow to get an specific status of one or several ids', function(done){
    createTestStatusesActivity(function(activity){
      activity.getStatus(['uid1', 'uid2'], 'online', function(err, statuses){
        expect(err).to.not.be.ok();

        expect(statuses['uid1']).to.be.equal('online');
        expect(statuses['uid2']).to.not.be.ok();

        activity.getStatus('uid3', 'offline', function(err, status){
          expect(status).to.be.equal('offline');

          done();
        });    
      });
    });
  });

  it('should allow to change an status', function(done){
    createTestStatusesActivity(function(activity){
      activity.setStatus('uid1', 'offline', function(err){
        expect(err).to.not.be.ok();

        var idx = activity._idsByStatus['online'].indexOf('uid1');
        expect(idx).to.be.equal(-1);

        activity.getStatus('uid1', function(err, status){
          expect(status).to.be.equal('offline');
          done();
        });

      });
    });
  });

  it('should allow to be destroyed', function(done){
    createTestStatusesActivity(function(activity){
      activity.destroy(function(err){
        expect(err).to.not.be.ok();

        expect(activity._statuses).to.not.be.ok();
        expect(activity._idsByStatus).to.not.be.ok();
        expect(activity._statusById).to.not.be.ok();
        done();
      });
    });
  });

});