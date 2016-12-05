/**
 * Created by Jack on 12/3/2016.
 */
var config = require("./RelaySchedule.json");
var events = require("events");

const MINUTE_MS = 60 * 1000;
const HOUR_MS = MINUTE_MS * 60;
const DAY_MS = HOUR_MS * 24;

function RelayScheduler(relay, schedule, onFunction, offFunction) {
  let self = this;
  self.relay = relay;
  self.schedule = [];
  self.onFunction = onFunction;
  self.offFunction = offFunction;

  self.currentTaskIndex = null;
  self.currentTask = null;

  self.nextTask = null;
  self.nexTaskIndex = null;

  self.parseSchedule(schedule);
  self.setupTasks();
  self.scheduleNextAction();
}


//ensures the schedule is in desc order
RelayScheduler.prototype.parseSchedule = function (schedule) {
  let self = this;
  let previousStartTime = undefined;
  let previousEndTime = undefined;

  schedule.forEach(function (period) {
    let startTimeMS = self.timeToMS(period["on"]);
    let endTimeMS = self.timeToMS(period["off"]);
    console.log(startTimeMS + " :: " + endTimeMS);

    //make sure start time is before end time
    if (startTimeMS >= endTimeMS) {
      throw new Error("Invalid time range, start time must be before end time " + period);
    }

    if (previousStartTime !== undefined && previousEndTime !== undefined) {
      //start time must of the task must be greater than the end time of the previous task
      if (previousStartTime < startTimeMS && previousEndTime < startTimeMS) {
        previousStartTime = startTimeMS;
        previousEndTime = endTimeMS;
      } else {
        throw new Error("Time schedule must be in descending order");
      }
    } else {
      previousStartTime = startTimeMS;
      previousEndTime = endTimeMS;
    }

    //push it to the array of parsed tasks
    self.schedule.push({"on": startTimeMS, "off": endTimeMS});
  });
};

RelayScheduler.prototype.setupTasks = function () {
  let self = this;
  let currentTimeInMS = self.getCurrentTimeInMS();
  let nextTask = undefined;
  let previousEndTime = undefined;

  for (let i = 0, len = self.schedule.length; i < len; i++){
    let period = self.schedule[i];
    if (currentTimeInMS >= period.on && currentTimeInMS <= period.off) {
      //the current task should be this
      nextTask = period;
      self.currentTaskIndex = i;
      self.currentTask = self.schedule[i];
      self.nextTask = self.schedule[i + 1 % self.schedule.length];
      self.triggerOnAction();
      console.log("!!");
    } else if (currentTimeInMS > previousEndTime && currentTimeInMS < period.on) {
      //this is the NEXT task
      self.currentTaskIndex = null;
      self.currentTask = null;
      self.nextTask = self.schedule[i];
      self.nextTaskindex = i;
      self.triggerOffAction();
      nextTask = period;
      console.log("..");
    } else {
      previousEndTime = period.off;
      console.log("none of the above");
    }
  }

  //if there are no tasks to be setup then use the first
  if (nextTask === undefined) {
    self.currentTaskIndex = null;
    self.currentTask = null;
    self.nextTask = self.schedule[0];
    self.nexttaskIndex = 0;
  }

};

RelayScheduler.prototype.scheduleNextAction = function(){
  let self = this;
  if (self.currentTask !== null){
    //schedule the off action
    let timeUntilAction = self.getTimeDifferenceInMS(self.currentTask['on'], self.getCurrentTimeInMS());
    console.log("ms until next action: " + timeUntilAction);
  } else if (self.nextTask !== null){
    //schedule the on action
    console.log(self.nextTask['on']);
    console.log(self.getCurrentTimeInMS());
    let timeUntilAction = self.getTimeDifferenceInMS(self.nextTask['on'], self.getCurrentTimeInMS());
    console.log("ms until next action: " + timeUntilAction);
  } else {

  }
};

RelayScheduler.prototype.getCurrentTimeInMS = function(){
  let currentTime = new Date();
  return currentTime.getHours() * HOUR_MS + currentTime.getMinutes() * MINUTE_MS;
};

//converts the format hh:mm to milliseconds
RelayScheduler.prototype.timeToMS = function (time) {
  let ms;
  let timeArray = /(\d{1,2}):(\d{2})/.exec(time);
  if (timeArray !== null) {
    ms = timeArray[1] * HOUR_MS + timeArray[2] * MINUTE_MS;
  } else {
    //throw error
    throw Error("Invalid time: " + time);
  }
  return ms;
};

RelayScheduler.prototype.getTimeDifferenceInMS = function(timeInMS1, timeInMS2){
  let self = this;
  if (timeInMS2 > timeInMS1){
    //rollover
    return DAY_MS - timeInMS2 + timeInMS1;
  } else {
    return timeInMS1 - timeInMS2;
  }
};

RelayScheduler.prototype.triggerOnAction = function(){
  let self = this;
  self.onFunction(self.relay.id);
  //self.currentTask = self.nextTask
};

RelayScheduler.prototype.triggerOffAction = function(){
  let self = this;
  self.offFunction(self.relay.id);
  self.currntTask = null;
  self.currentTaskIndex = null;

};

module.exports = RelayScheduler;