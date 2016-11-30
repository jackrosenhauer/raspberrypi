const five = require("johnny-five");
const util = require('util');
const events = require('events');

let Controller = function(options){
    let self = this;
    options = options || {};

    self.board = new five.Board(options);

    self.status = {
        relays: {},
        hygrometer: {}
    };

    self.board.on('ready', self.setupBoard.bind(self));

};

util.inherits(Controller, events.EventEmitter);

Controller.prototype.setupBoard = function(){
    let self = this;

    self.hygrometer = new five.Multi({
        controller: "HTU21D",
        freq: 1000,
        id: "hygrometer"
    });

    self.hygrometer.on('data', function(){
        self.status[this.id] = {
            "temperature": this.thermometer.fahrenheit,
            "humidity": this.hygrometer.relativeHumidity
        }
    });

    self.relays = new five.Relays([3, 2, 4, 5, 6, 7, 8, 9, 10]);

    self.relays.forEach(function(relay, index){
        relay.id = "relay" + index + 1;
        relay.close();
    });

    self.emit("ready");
};

Controller.prototype.getRelayStatus = function(relayID){
    let self = this;

    let relay = self.relays.byId(relayID);
    if (relay){
        return {"on": relay.isOn}
    } else {
        self.emit("error", new Error(`Relay with ID ${relayID} does not exist`));
    }
};

Controller.prototype.update = function(){
    let self = this;
    //console.log(self);
    self.relays.forEach(function(relay, index){
       self.status.relays[relay.id] = self.getRelayStatus(relay.id);
    });

    self.emit("update", self.status);
};

Controller.prototype.getData = function(){
    let self = this;
};

Controller.prototype.toggleRelay = function(relayID){
    let self = this;
    let relay;
    if (relay = self.relays.byId(relayID)){
        relay.toggle();
    }else{
        self.emit("error", new Error(`Relay with ID ${relayID} does not exist`));
    }
};

Controller.prototype.setUpdateInterval = function(interval){
    let self = this;
    self.updateInterval = interval;
    clearInterval(self.updateIntervalTimeout);
    self.updateIntervalTimeout = setInterval(self.update.bind(self), interval);
};

module.exports = Controller;