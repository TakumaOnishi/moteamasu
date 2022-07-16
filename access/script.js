let checkPoint = [
   {'x':326, 'y':325},
   {'x':284, 'y':388},
   {'x':368, 'y':429},
   {'x':307, 'y':545},
   {'x':312, 'y':565},
   {'x':300, 'y':610},
   {'x':347, 'y':656},
   {'x':275, 'y':730},
   {'x':304, 'y':770},
   {'x':262, 'y':806},
   {'x':242, 'y':786}
];
let theta = [];
let vector = [];
for(let i=1;i<checkPoint.length;i++){
   theta[i] = Math.atan((checkPoint[i].y-checkPoint[i-1].y)/(checkPoint[i].x-checkPoint[i-1].x));
   vector[i] = {'x':Math.cos(theta[i]), 'y':Math.sin(theta[i])};
}
let rumorText = [
   "モテアマス三軒茶屋（もてあますさんげんぢゃや）",
   "は、東京都世田谷区にあるシェアハウス。",
   "2016年11月に実業家のカズキタによって開館された。","","",
   "もとは社員寮であったこの建物にひとりで住み始めたカズキタが、",
   "15LDKの大空間を持て余したことから「モテアマス」の名がついたという。",
   "以来、その恵まれた立地と懐の広いコミュニティに",
   "多くのフリーランサーが流れ着き、今では駐車場やテントにまで",
   "「人を持て余す」シェアハウスになっている。"
];
let dx = 0;
let dy = 0;
let phase, X, Y, H, W, offsetX, offsetY, ratio, scale, lastX, lastY, lastMove, pointerDown, wheelMoving, pressD, pressU, pressL, pressR, keymoving;


window.addEventListener('DOMContentLoaded', () => {

   const city = document.getElementById("city");
   const svg = document.getElementsByClassName("svg");
   const home = document.getElementById("home");
   const vignette = document.getElementById("vignette");
   const rumor = document.getElementById("rumor");
   const compass = document.getElementById("compass");

   const isTouch = ('ontouchstart' in document);
   const downEvent = (isTouch) ? 'touchstart' : 'pointerdown';
   const moveEvent = (isTouch) ? 'touchmove' : 'pointermove';
   const upEvent = (isTouch) ? 'touchend' : 'pointerup';
   phase = 1;
   X = checkPoint[0].x;
   Y = checkPoint[0].y;

   onSet();
   onUpdate();

   setTimeout(() => {
      city.style.opacity = "1";
   }, 100);


   document.addEventListener('wheel', function(event){
      wheelMoving = true;
      dx = -event.deltaX * 0.1;
      dy = -event.deltaY * 0.1;
      move(dx,dy);
      onUpdate();
      lastMove = Date.now();
      event.preventDefault();
   }, {passive: false});


   document.addEventListener(downEvent, function(event){
      pointerDown = true;
      wheelMoving = false;
      if(isTouch){
         lastX = event.changedTouches[0].pageX;
         lastY = event.changedTouches[0].pageY;
      }else{
         lastX = event.pageX;
         lastY = event.pageY;
      }
      dx = 0;
      dy = 0;
      event.preventDefault();
   }, {passive: false});


   document.addEventListener(moveEvent, function(event){
      if(pointerDown){
         if(isTouch){
            dx = (event.changedTouches[0].pageX - lastX + dx) * 0.2;
            dy = (event.changedTouches[0].pageY - lastY + dy) * 0.2;
            lastX = event.changedTouches[0].pageX;
            lastY = event.changedTouches[0].pageY;
         }else{
            dx = (event.pageX - lastX + dx) * 0.2;
            dy = (event.pageY - lastY + dy) * 0.2;
            lastX = event.pageX;
            lastY = event.pageY;
         }
         move(dx,dy);
         onUpdate();
         lastMove = Date.now();
         event.preventDefault();
      }
   }, {passive: false});
   

   document.addEventListener(upEvent, function(event){
      pointerDown = false;
      if(Date.now() - lastMove < 30){
         inertia();
      }
      event.preventDefault();
   }, {passive: false});

   window.addEventListener('resize', function(){
      onSet();
      onUpdate();
   });


   document.addEventListener('keydown', function(event){
      let key = event.key;
      if((key === 'a'||key === 'ArrowLeft')&&!pressL){
         dx += 5;
         pressL = true;
         if(!keymoving) keymove(); keymoving = true;
      }else if((key === 's'||key === 'ArrowDown')&&!pressD){
         dy -= 5;
         pressD = true;
         if(!keymoving) keymove(); keymoving = true;
      }else if((key === 'd'||key === 'ArrowRight')&&!pressR){
         dx -= 5;
         pressR = true;
         if(!keymoving) keymove(); keymoving = true;
      }else if((key === 'w'||key === 'ArrowUp')&&!pressU){
         dy += 5;
         pressU = true;
         if(!keymoving) keymove(); keymoving = true;
      }
   });

   document.addEventListener('keyup', function(event){
      let key = event.key;
      if(key === 'a'||key === 'ArrowLeft'){
         pressL = false;
         dx -= 5;
      }else if(key === 's'||key === 'ArrowDown'){
         pressD = false;
         dy += 5;
      }else if(key === 'd'||key === 'ArrowRight'){
         pressR = false;
         dx += 5;
      }else if(key === 'w'||key === 'ArrowUp'){
         pressU = false;
         dy -= 5;
      }
   });



   function onSet(){
      //document.documentElement.style.setProperty('--R', standardR + 'px');
      H = window.innerHeight;
      W = window.innerWidth;
      ratio = 450/Math.max(W,H); // display scale => svg scale
      offsetX = W/2;
      offsetY = H/2;
      for(let i=0;i<svg.length;i++){
         svg[i].style.width = 599.24/ratio + "px";
      }
   }

   function onUpdate(){
      if(phase <= 9){
         scale = 1+Math.tan((Y-325)/315);
      }
      let left = (checkPoint[10].x - X)/ratio*scale + offsetX;
      let top = (checkPoint[10].y - Y)/ratio*scale + offsetY;
      home.style.left = left + "px";
      home.style.top = top + "px";
      if(phase <= 10){
         if(H < top){
            left *= offsetY/(top-offsetY);
            top = H;
         }else if(top < 0){
            left *= offsetY/(offsetY-top);
            top = 0;
         }
         if(left < 0){
            top *= offsetX/(offsetX-left);
            left = 0;
         }
         vignette.style.left = left + "px";
         vignette.style.top = top + "px";
         let userX = offsetX-X/ratio;
         let userY = offsetY-Y/ratio;
         city.style.transformOrigin = X/ratio + "px " + Y/ratio + "px";
         city.style.transform = "translate(" + userX + "px," + userY + "px) scale(" + scale + ")";
         svg[0].style.left = (-userX/16) + "px";
         svg[0].style.top = (-userY/16) + "px";
         compass.setAttribute('x1', X);
         compass.setAttribute('y1', Y-1);
      }
   }

   function inertia(){
      if(!wheelMoving && (0.1 <= Math.abs(dx)||0.1 <= Math.abs(dy))){
         dx *= 0.95;
         dy *= 0.95;
         move(dx,dy);
         onUpdate();
         window.requestAnimationFrame(inertia);
      }
   }

   function keymove(){
      if(pressD||pressU||pressR||pressL){
         move(dx,dy);
         onUpdate();
         window.requestAnimationFrame(keymove);
      }else{
         dx = dy = 0;
         keymoving = false;
      }
   }

   function tell(i){
      rumor.innerHTML = "<p>" + rumorText[i] + "</p>";
      setTimeout(() => {
         if(phase-1 == i){
            rumor.innerHTML = "";
         };
      }, 3000);
   }
/*
   function showlogo(){
      rumor.innerHTML = "";
      logo.style.opacity = "1";
      setTimeout(() => {
         logo.style.transition = "opacity 2s ease";
         logo.style.opacity = "0";
      }, 3000);
   }
   */

   function move(dx,dy){
      if(Y == checkPoint[0].y){
         tell(0); // 最初の字幕
      }
      if(phase <= 10){
         let s = dx * vector[phase].x + dy * vector[phase].y; // 内積
         dx = s * vector[phase].x;
         dy = s * vector[phase].y;
      }
      X -= dx * ratio / scale;
      Y -= dy * ratio / scale;
      if(phase < 9){
         if(Y < checkPoint[phase-1].y){
            X = checkPoint[phase-1].x;
            Y = checkPoint[phase-1].y;
         if(1 < phase){
            phase--;
         }
         }else if(checkPoint[phase].y < Y){
            X = checkPoint[phase].x;
            Y = checkPoint[phase].y;
            tell(phase);
            phase++;
         }
      }else if(phase == 9){
         if(Y < checkPoint[phase-1].y){
            X = checkPoint[phase-1].x;
            Y = checkPoint[phase-1].y;
         if(1 < phase){
            phase--;
         }
         }else if(X < checkPoint[phase].x){
            X = checkPoint[phase].x;
            Y = checkPoint[phase].y;
            tell(phase);
            phase++;
            home.style.visibility = "visible";
         }
      }else if(phase == 10){
         if(checkPoint[phase-1].x < X){
            X = checkPoint[phase-1].x;
            Y = checkPoint[phase-1].y;
         if(1 < phase){
            phase--;
            home.style.visibility = "hidden";
         }
         }else if(X < checkPoint[phase].x){
            X = checkPoint[phase].x;
            Y = checkPoint[phase].y;
            phase++;
            //city.style.display = "none";
            //logo.style.opacity = "1";
            //showlogo();
            window.location.href = '../';
         }
      }
      //console.log(phase);
   }

});