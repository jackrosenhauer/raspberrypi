var five = require("johnny-five");
var board = new five.Board({
    //samplingInterval: 1000
});

board.on("ready", function () {
    //DS18B20 (requires ConfigurableFirmata)
    // setTimeout(function(){
    //
    // }, 2000);
    // var thermometer = new five.Thermometer({
    //     controller: "DS18B20",
    //     pin: 4
    // });
    //
    // thermometer.on("change", function () {
    //     console.log("thermometer1 change : " + this.F + "°F");
    //     // console.log("0x" + this.address.toString(16));
    // });
    //
    // thermometer.on("data", function () {
    //     data = {
    //         F: this.F,
    //         C: this.C,
    //         K: this.K
    //     };
    //     //console.log(data);
    // });
    //

    //issue running both sensors at the same time.... https://github.com/rwaldron/johnny-five/issues/1115
    var hygrometer = new five.Multi({
       controller: "HTU21D",
       freq: 20000
    });


    hygrometer.on("data", function(){
        // console.log("HTU21D Thermometer");
        // console.log("\tfahrenheit        : ", this.thermometer.fahrenheit);
        // console.log("HTU21D Hygrometer");
        // console.log("\trelative humidity : ", this.hygrometer.relativeHumidity);
    });

    var data;

    //messed up the order in the wiring so they're out of sequence...
    var relays = new five.Relays([3, 2, 4, 5, 6, 7, 8, 9, 10]);
    relays.close();

    this.repl.inject({
      status: function(){
        return relays;
      },
      on: function(index){
        //close the relay
        relays[index].open();
      },
      off: function(index){
        //open the relay
        relays[index].close();
      },
      quit: function(){
        process.exit();
      }
    });

    board.samplingInterval(1000);
    var time = new Date();
    console.log("started at " + time + "\n");
});
