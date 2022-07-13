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

$(".content2").hide();

/* menu */
$('#minimize').click(function(){
  win.minimize();
});
$('#close').click(function(){
  win.close();
});
/*
$('#maximize').click(function() {
  if(win.isMaximized()){
      win.unmaximize();
  }else{
      win.maximize();
  }
});*/

$('#submitButton').click(function(){

  let inputValue = $("#inputUrl").val();

  let isValid = ytdl.validateURL(inputValue);

  if (!isValid){
    $("#error").text("URL invalide");
    $("#error").css("color", "red");
    dataMusic.url = "none";
  }

  else {
    $("#error").text("bon URL");
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
  $("#mp4").css("background-color", "#1c1d25");
  $("#mp3").css("background-color", "#AA0000");
  checkStep3();
});
$('#mp4').click(function(){
  dataMusic.optionConversion = 'mp4';
  $("#mp3").css("background-color", "#1c1d25");
  $("#mp4").css("background-color", "#AA0000");
  checkStep3();
});

$('#low').click(function(){
  dataMusic.optionQuality = 'low';
  $("#low").css("background-color", "#AA0000");
  $("#high").css("background-color", "#1c1d25");
  checkStep3();
  canDownload();
});
$('#high').click(function(){
  dataMusic.optionQuality = 'high';
  $("#low").css("background-color", "#1c1d25");
  $("#high").css("background-color", "#AA0000");
  checkStep3();
  canDownload();
});

$('#again').click(function(){
  refreshMusic();
  $(".content").show();
  $(".content2").hide();
  $("#progressBar").val(0);
  $("#progressText").text("0%");
  $("#infoProgress").text("Téléchargement en cours...");
  $("#infoProgress").css("color", "white");
});

function refreshMusic() {
  dataMusic.url = "none";
  dataMusic.name = "none";
  dataMusic.info = "none";
  $("#error").css("color", "transparent");
  $("#step1").css("color", "white");
  $("#inputUrl").val("");
  $("#outputText").text("");
  $("#error").text("");
  $("#error").css("color", "transparent");
}

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
  $("#outputText").text(dataMusic.name);
  canDownload();
}

function downloadMusic() {

  let qualitySelect;
  let convertSelect;

  let sum = 0;
  let totalSize = 0;
  let newValue = 0;

  if (dataMusic.optionConversion === "mp4") { 
    qualitySelect = (dataMusic.optionQuality === "high") ? "highestvideo" : "lowestvideo";
    convertSelect = "audioandvideo";
  }
  if (dataMusic.optionConversion === "mp3") { 
    qualitySelect = (dataMusic.optionQuality === "high") ? "highestaudio" : "lowestaudio";
    convertSelect = "audioonly";
  }

  if (canDownload() === true){
    
    $(".content").hide();
    $(".content2").show();

    ytdl(dataMusic.url, { filter: convertSelect, quality: qualitySelect })
    .on('response', function(res){
      totalSize = res.headers['content-length'];
    })
    .on( 'data', function(data){ 
      sum = sum + data.length;
      newValue = ( (sum/totalSize).toFixed(2) ) * 100
      $("#progressBar").val(newValue);
      $("#progressText").text(newValue.toFixed(2)+"%");
    })
    .on( 'finish', function(){
      $("#infoProgress").text("Téléchargement terminé");
      $("#infoProgress").css("color", "green");
    })
    .pipe(fs.createWriteStream(dataMusic.path+"/"+dataMusic.name+"."+dataMusic.optionConversion));
  }
}