//Code to initialize Firebase. This is Mateo's personal firebase config.
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA7VN500kiAtXDrjW8UXmmFaOB6K08M3pw",
    authDomain: "trainscheduler-68269.firebaseapp.com",
    databaseURL: "https://trainscheduler-68269.firebaseio.com",
    projectId: "trainscheduler-68269",
    storageBucket: "trainscheduler-68269.appspot.com",
    messagingSenderId: "783243982961"
  };

//Initializes Firebase using the configuration from Mateo
firebase.initializeApp(config);

//Initialized variables for use through
var database = firebase.database();
var current_name = "";
var current_destination = "";
var start_time = "";
var current_frequency = "";
var next_arrival = "";
var next_arrival_mili = '';
var minutes_away = "";

function calculateNextArrival (){

  var start_string = start_time.toString().split(':');
  var start_hour = start_string[0];
  var start_minute = start_string[1];

  var today = moment();

  var start = moment();
  start = moment().set({'hour': start_hour, 'minute': start_minute});
  var next_time = start;
  start = start.format('h:mm');

  while(next_time < today){

    next_time = moment(next_time).add(current_frequency, 'minutes');

  }

  next_arrival_mili = next_time;
  next_arrival = next_time.format('h:mm');
}

function calculateMinutesAway(){
  
  var today = moment();
  minutes_away = moment().to(next_arrival_mili);

}


$('#add-train').on('click', function(){

  event.preventDefault();

  current_name = $('#name-input').val();
  current_destination = $('#destination-input').val();
  start_time = $('#start-input').val();
  current_frequency = $('#frequency-input').val();

  database.ref().push({

    name: current_name,
    destination: current_destination,
    start_time: start_time,
    frequency: current_frequency,

  });
});


database.ref().on('child_added', function(child_snapshot){

  //Gets the snapshot values.
  current_name = child_snapshot.val().name;
  current_destination = child_snapshot.val().destination;
  start_time = child_snapshot.val().start_time;
  current_frequency = child_snapshot.val().frequency;
  entry_id = child_snapshot.key;
  console.log(entry_id);

  //Creates the table row
  var table_row = $('<tr>');
  table_row.attr('id', entry_id);

  var name_col = $('<td>').text(current_name);
  name_col.attr('id', 'name');
  table_row.append(name_col);

  var destination_col = $('<td>').text(current_destination);
  destination_col.attr('id', 'destination');
  table_row.append(destination_col);

  var frequency_col = $('<td>').text(current_frequency);
  frequency_col.attr('id', 'frequency');
  table_row.append(frequency_col);

  calculateNextArrival();

  var next_arrival_col = $('<td>').text(next_arrival);
  next_arrival_col.attr('id', 'next_arrival');
  table_row.append(next_arrival_col);

  calculateMinutesAway();

  var minutes_away_col = $('<td>').text(minutes_away);
  minutes_away_col.attr('id', 'minutes_away');
  table_row.append(minutes_away_col);

  var update_btn = $('<td>');
  update_btn.append('<button class="btn btn-default" id="update-btn" entry-id="' + entry_id + '">Update Train</button>');
  update_btn.attr('entry-id', entry_id);
  table_row.append(update_btn);

  var remove_btn = $('<td>');
  remove_btn.append('<button class="btn btn-default" id="remove-btn entry-id="' + entry_id + '">Remove Train</button>');
  remove_btn.attr('entry-id', entry_id);
  table_row.append(remove_btn);

  //Appends entire row to the table.
  $('#train-table').append(table_row);

}, function(errorObject){

    console.log("The read failed: " + errorObject.code);

});


$(document).on('click', '#update-btn', function(){

  var _id = $('#update-btn').attr('entry-id');
  console.log(_id);
  var update = {};

});

$(document).on('click', '#remove-btn', function(){

  var _id = $('#remove-btn').attr('entry-id');
  console.log(_id);

});