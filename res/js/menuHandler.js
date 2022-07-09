const fs = require('fs');
const ytdl = require('ytdl-core');

const $ = require('jquery');
const {remote} = require('electron');
var win = remote.getCurrentWindow();

var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

let title = document.getElementById('title').innerHTML;
document.getElementById('titleShown').innerHTML = title;

let dataMusic = {
  url: "none",
  name: "none",
  optionConversion: "none",
  optionQuality: "none",
  path: "none",
  info: "none"
}

/* menu */
$('#minimize').click(function(){
  win.minimize();
});
$('#close').click(function(){
  win.close();
});
$('#maximize').click(function() {
  if(win.isMaximized()){
      win.unmaximize();
  }else{
      win.maximize();
  }
});

$('#submitButton').click(function(){

  let inputValue = $("#inputUrl").val();

  let isValid = ytdl.validateURL(inputValue);

  if (!isValid){
    $("#error").text("error : invalid URL");
    $("#error").css("color", "red");
    dataMusic.url = "none";
  }

  else {
    $("#error").text("good URL");
    $("#error").css("color", "green");
    $("#step1").css("color", "green");
    dataMusic.url = inputValue;
    infoMusic();
  }
});

$('#inputFile').change(function() {
  $("#step2").css("color", "green");
  dataMusic.path = document.getElementById("inputFile").files[0].path;
  canDownload();
});

$('#download').click(function(){
  downloadMusic();
});



// settings

$('#mp3').click(function(){
  dataMusic.optionConversion = 'mp3';
  $("#mp4").css("background-color", "#333333");
  $("#mp3").css("background-color", "#AA0000");
  checkStep3();
});
$('#mp4').click(function(){
  dataMusic.optionConversion = 'mp4';
  $("#mp3").css("background-color", "#333333");
  $("#mp4").css("background-color", "#AA0000");
  checkStep3();
});

$('#low').click(function(){
  dataMusic.optionQuality = 'low';
  $("#low").css("background-color", "#AA0000");
  $("#medium").css("background-color", "#333333");
  $("#high").css("background-color", "#333333");
  checkStep3();
  canDownload();
});
$('#medium').click(function(){
  dataMusic.optionQuality = 'medium';
  $("#low").css("background-color", "#333333");
  $("#medium").css("background-color", "#AA0000");
  $("#high").css("background-color", "#333333");
  checkStep3();
  canDownload();
});
$('#high').click(function(){
  dataMusic.optionQuality = 'high';
  $("#low").css("background-color", "#333333");
  $("#medium").css("background-color", "#333333");
  $("#high").css("background-color", "#AA0000");
  checkStep3();
  canDownload();
});

function checkStep3() {
  if (dataMusic.optionConversion != "none" && dataMusic.optionQuality != "none"){
    $("#step3").css("color", "green");
  }
}

function canDownload() {
  if (dataMusic.path != "none" && dataMusic.name!= "none" && dataMusic.optionConversion != "none" && dataMusic.optionQuality != "none" && dataMusic.url != "none"){
    $("#download").css("color", "white");
    return true;
  }
  else {
    $("#download").css("color", "rgba(255, 255, 255, 0.34);");
    return false;
  }
}

async function infoMusic() {
  dataMusic.info = await ytdl.getBasicInfo(dataMusic.url)
  dataMusic.name = dataMusic.info.videoDetails.title;
  myConsole.log(dataMusic.name);

  canDownload();
}

function downloadMusic() {

  if (canDownload() == true){
    alert(dataMusic.path+"/"+dataMusic.name+".mp3");

    if (dataMusic.optionConversion == "mp3") {
      ytdl(dataMusic.url, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(dataMusic.path+"/"+dataMusic.name+".mp3"));
    }
    else {
      ytdl(dataMusic.url, { filter: format => format.container === 'mp4' })
      .pipe(fs.createWriteStream(dataMusic.path+"/"+dataMusic.name+".mp4"));
    }
  }

}