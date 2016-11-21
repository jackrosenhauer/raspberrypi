var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  // Create an Led on pin 13
  var led = new five.Led(13);
  var led2 = new five.Led(12);

  // Strobe the pin on/off, defaults to 100ms phases
  led.strobe();
  led2.strobe();

  //DS18B20 (requires ConfigurableFirmata)
  var thermometer = new five.Thermometer({
    controller: "DS18B20",
    pin: 11
  });

  thermometer.on("change", function() {
    //console.log("thermometer change : " + this.celsius + "°C");
    // console.log("0x" + this.address.toString(16));
  });

  var once = true;
  thermometer.on("data", function() {
    data = {
      F: this.F,
      C: this.C,
      K: this.K
    };
    if (once){
      console.log(this);
      once = false;
    }
    //console.log(data);
  });

  // setInterval(function(){
  //   console.log("timeout");
  //
  // }, 500);

  var data;
  //controls open or closed

  var relay1 = five.Led(7);

  var time = new Date();
  relay1.off();

  this.repl.inject({
    status: function(){
      console.log(data);
    },
    on: function(){
      //close the relay
      relay1.off();
    },
    off: function(){
      //open the relay
      relay1.on();
    },
    quit: function(){
      process.exit();
    }
  });

  console.log("started at " + time + "\n");
});
