var canvas = new fabric.Canvas("canvas");
var clear = document.getElementById("clear");
var rectangle = document.getElementById("rectangle");
var ellipse = document.getElementById("ellipse");
var order = document.getElementById("order");
var success = document.getElementById("success");
var isEllipse = false;
var isRectangle = false;
 
var circle, isDown, origX, origY;
 
$(rectangle).on("click", function () {
 isEllipse = false;
 isRectangle = true;
 
 console.log("rectangle");
});
 
$(ellipse).on("click", function () {
 isEllipse = true;
 isRectangle = false;
 console.log("ellipse");
});
$(clear).on("click", function () {
 var objects = canvas.getObjects();
 for (var i = 0; i < objects.length; i++) {
   canvas.remove(objects[i]);
 }
 canvas.renderAll();
});
 
$(order).on("click", async function () {
 let mySvg = canvas.toSVG();
 console.log(mySvg);
 let response = await fetch("http://127.0.0.1:3000/", {
   method: "POST",
   body: mySvg,
 }).then(function (response) {
   alert("Order Placed");
 });
 
});
canvas.on("mouse:down", function (o) {
 isDown = true;
 var pointer = canvas.getPointer(o.e);
 origX = pointer.x;
 origY = pointer.y;
 
 if (isEllipse) {
   circle = new fabric.Circle({
     left: origX,
     top: origY,
     originX: "left",
     originY: "top",
     radius: pointer.x - origX,
     angle: 0,
     fill: "",
     stroke: "red",
     strokeWidth: 3,
   });
   canvas.add(circle);
 }
 
 if (isRectangle) {
   rectangle = new fabric.Rect({
     left: origX,
     top: origY,
     fill: "transparent",
     stroke: "red",
     strokeWidth: 3,
   });
   canvas.add(rectangle);
 }
});
 
canvas.on("mouse:move", function (o) {
 if (!isDown) return;
 var pointer = canvas.getPointer(o.e);
 var radius =
   Math.max(Math.abs(origY - pointer.y), Math.abs(origX - pointer.x)) / 2;
 if (isEllipse) {
   if (radius > circle.strokeWidth) {
     radius -= circle.strokeWidth / 2;
   }
   circle.set({ radius: radius });
 
   if (origX > pointer.x) {
     circle.set({ originX: "right" });
   } else {
     circle.set({ originX: "left" });
   }
   if (origY > pointer.y) {
     circle.set({ originY: "bottom" });
   } else {
     circle.set({ originY: "top" });
   }
   canvas.renderAll();
 }
 
 if (isRectangle) {
   if (origX > pointer.x) {
     rectangle.set({ left: Math.abs(pointer.x) });
   }
   if (origY > pointer.y) {
     rectangle.set({ top: Math.abs(pointer.y) });
   }
 
   rectangle.set({ width: Math.abs(origX - pointer.x) });
   rectangle.set({ height: Math.abs(origY - pointer.y) });
   canvas.renderAll();
 }
});
 
canvas.on("mouse:up", function (o) {
 isDown = false;
});
