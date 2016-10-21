var five = require("johnny-five"),
    board = new five.Board();

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
    pin: 2
  });

  thermometer.on("change", function() {
    console.log(this.celsius + "°C");
    // console.log("0x" + this.address.toString(16));
  });
});
