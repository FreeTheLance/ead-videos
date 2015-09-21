var canvas = document.getElementById("main-canvas");
 
var context = canvas.getContext("2d");
 
var video = document.getElementById("main-video");


var buttonObject =
 
{
 
  width: 0,
 
  height: 0,
 
  x: 0,
 
  y: 0,
 
  centerX: function()
 
  {
 
    return this.x + (this.width / 2);
 
  },
 
  centerY: function()
 
  {
 
    return this.y + (this.height / 2);
 
  },
 
  halfWidth: function()
 
  {
 
    return this.width / 2;
 
  },
 
  halfHeight: function()
 
  {
 
    return this.height / 2;
 
  }
 
};

var button = Object.create(buttonObject);
 
button.x = 200;
 
button.y = 200;

context.fillStyle = "#333";
 
context.fillRect(button.x,button.y,button.width,button.height);