const five = require("johnny-five");
const util = require('util');
const events = require('events');
let RelayScheduler = require("./RelayScheduler");
let relaySchedule = require("./RelaySchedule.json");

let Controller = function (options) {
  let self = this;
  options = options || {};

  self.board = new five.Board(options);

  self.updates = {};
  self.board.on('ready', self.setupBoard.bind(self));
};

util.inherits(Controller, events.EventEmitter);

Controller.prototype.hygrometerUpdate = function(hygrometer){
  let self = this;
  self.updates[hygrometer.id] = {
    "type": "sensor",
    "temperature": hygrometer.thermometer.fahrenheit,
    "humidity": hygrometer.hygrometer.relativeHumidity
  };
};

Controller.prototype.setupBoard = function () {
  let self = this;
  self.hygrometer = new five.Multi({
    controller: "HTU21D",
    freq: 1000,
    id: "Hygrometer"
  });
  self.hygrometer.on('data', self.hygrometerUpdate.bind(self));

  self.relays = new five.Relays([3, 2, 4, 5, 6, 7, 8, 9]);
  self.relays.forEach(function (relay, index) {
    relay.id = "relay" + (index + 1);
    relay.close();
    if (relaySchedule[relay.id]){
      relay.scheduler = new RelayScheduler(relay, relaySchedule[relay.id].schedule, self.turnRelayOn.bind(self), self.turnRelayOff.bind(self));
    }
  });

  //let the scheduler run... sleep for .5 seconds
  setTimeout(function(){
    self.emitAllRelaysStatus();
    self.emit("ready");
  }, 500);
};

Controller.prototype.emitAllRelaysStatus = function (relayID) {
  let self = this;
  let relayStatus = {};

  //we're using NO on the relay, so we take the inverse of isOn
  self.relays.forEach(function (relay, index) {
    relayStatus[relay.id] = {
      'type': "relay",
      "isOn": !relay.isOn
    };
  });
  self.emit("update", relayStatus);
};

Controller.prototype.emitRelayStatus = function(relayID){
  let self = this;
  let relay;
  if (relay = self.relays.byId(relayID)){

  };
};

Controller.prototype.getRelayById = function(relayID){
  let self = this;
  let relay;
  if (relay = self.relays.byId(relayID)){
    return relay;
  } else {
    self.emit("error", new Error(`Relay with ID ${relayID} does not exist`));
  }
};

Controller.prototype.update = function () {
  let self = this;
  self.emit("update", self.updates);
  self.updates = {};
};


//create sync records
Controller.prototype.toggleRelay = function (relayID) {
  let self = this;
  let relay;
  if (relay = self.relays.byId(relayID)) {
    relay.toggle();
    self.emit("update", {relayID: {"type": "relay", "isOn": !relay.IsOn}});
  } else {
    self.emit("error", new Error(`Relay with ID ${relayID} does not exist`));
  }
};

Controller.prototype.turnRelayOn = function(relayID){
  let self = this;
  console.log('turning relay on...');
  let relay;
  if (relay = self.relays.byId(relayID)){
    relay.open();
    let update = {};
    update[relayID] = {
      "type": "relay",
      "isOn": !relay.isOn
    };

    self.emit("update", update);
  } else {
    self.emit("error", new Error(`Relay with ID ${relayID} does not exist`));
  }
};

Controller.prototype.turnRelayOff = function(relayID){
  let self = this;
  console.log('turning relay off...');
  let relay;
  if (relay = self.relays.byId(relayID)){
    relay.close();
    let update = {};
    update[relayID] = {
      "type": "relay",
      "isOn": !relay.isOn
    };

    self.emit("update", update);
  } else {
    self.emit("error", new Error(`Relay with ID ${relayID} does not exist`));
  }
};

Controller.prototype.setUpdateInterval = function (interval) {
  let self = this;
  self.updateInterval = interval;
  clearInterval(self.updateIntervalTimeout);
  self.updateIntervalTimeout = setInterval(self.update.bind(self), interval);
};

Controller.prototype.changeRelayState = function(relayID, isOn, cb){
  let self = this;
  if (isOn === true){
    self.turnRelayOn(relayID);
  } else if (isOn === false){
    self.turnRelayOff(relayID);
  } else {
    throw new Error("Something went wrong");
  }
  //do some stuff
  cb();
};

module.exports = Controller;