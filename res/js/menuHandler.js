const $ = require('jquery');
const {remote} = require('electron');
var win = remote.getCurrentWindow();

let title = document.getElementById('title').innerHTML;
document.getElementById('titleShown').innerHTML = title;

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
  console.log(win.isMaximized());
});
