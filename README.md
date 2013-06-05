##Activity [![Build Status](https://secure.travis-ci.org/pjnovas/activity.png?branch=master)](http://travis-ci.org/pjnovas/activity) [![Coverage Status](https://coveralls.io/repos/pjnovas/activity/badge.png)](https://coveralls.io/r/pjnovas/activity) [![NPM version](https://badge.fury.io/js/activity.png)](http://badge.fury.io/js/activity)

Activity Manager for any kind of statuses based on ids

### Getting Started

```bash
npm install activity --save-dev
```

#### Create an activity

```javascript
var Activity = require('activity');

var activity = new Activity({
  statuses: ["online", "offline", "away"]
});
```

#### Set an status
```javascript
activity.setStatus('uid1', 'online', function(err){
  if (err) {
    // somthing went wrong
  }
});

// you can set an status without checking if it was applied
activity.setStatus('uid2', 'away');
activity.setStatus('uid3', 'online');
```

#### Get statuses
```javascript
activity.getStatus(['uid1', 'uid2'], function(err, statuses){
  if (err) {
    // somthing went wrong
  }
  else {
    console.dir(statuses); // { uid1: 'online', uid2: 'away' }
  }
});
```

#### Get one status
```javascript
activity.getStatus('uid1', function(err, status){
  if (err) {
    // somthing went wrong
  }
  else {
    console.dir(status); // 'online'
  }
});
```

#### Get ids by an status
```javascript
activity.getIds('online', function(err, ids){
  if (err) {
    // somthing went wrong
  }
  else {
    console.dir(ids); // [ 'uid1', 'uid3' ]
  }
});
```

### TODO
* Add option to use Redis to store the current statuses.
* A way to clear all ids.

### Contribute

1. Fork this repo
2. run `npm install`
2. Create the tests for the new functionality or bug case
3. Put your awesome code
4. run `grunt test`
5. All good?, place a pull request

