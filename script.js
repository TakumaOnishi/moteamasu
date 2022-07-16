window.addEventListener('DOMContentLoaded', () => {

   let vx = vy = X = Y = foX = foY = x1 = x2 = y1 = y2 = question = vmin = offsetX = offsetY = lastX = lastY = lastMove = lastUpdate = 0;
   let pointerDown = pressD = pressU = pressL = pressR = linking = putting = moved = false;
   let rightWall = leftWall = upperWall = bottomWall = extraWall = userFile = floor = preview = null;
   let place = pageTitle = extraHTML = "";
   let visited = [];
   let ctx = {};
   //const baseURL = "http://localhost:8080/";

   const room = document.getElementById("room");
   const you = document.getElementById("you");
   const message = document.getElementById("message");
   const option = document.querySelectorAll("#message > div");

   const isTouch = ('ontouchstart' in document);
   const downEvent = (isTouch) ? 'touchstart' : 'pointerdown';
   const moveEvent = (isTouch) ? 'touchmove' : 'pointermove';
   const upEvent = (isTouch) ? 'touchend' : 'pointerup';

   if(localStorage.getItem('visited')){
      visited = localStorage.getItem('visited').split(",");
   }
   if(localStorage.getItem('password')){
      if(localStorage.getItem('userID')){
         if(localStorage.getItem('userID') != getUserID()){
            you.src = "./images/you_.svg";
            you.style.cursor = "pointer";
         }
      }else{
         you.src = "./images/you_.svg";
         you.style.cursor = "pointer";
      }
   }

   link("genkan");
   resize();
   lastUpdate = Date.now();
   update();



   //-------------------------------------------------
   // データアップロード
   //-------------------------------------------------

   you.addEventListener('mouseenter', function(){
      you.style.opacity = "1";
   });

   you.addEventListener('mouseleave', function(){
      if(you.style.opacity == "1"){
         you.style.opacity = "0.6";
      }
   });

   you.addEventListener(upEvent, function(){
      if(localStorage.getItem('password')){
         if(localStorage.getItem('userID') == getUserID()){
            tell('「明日また来てよ。」');
         }else switch(place){
            case 'genkan':
            case 'rouka1':
            case 'rouka2':
            case 'rouka3':
            case 'kaidan12':
            case 'kaidan23':
            case 'soto':
            case 'datsui':
            case 'onnadatsui':
            case 'otokodatsui':
               tell('「' + pageTitle + 'に物置かないで。」');
            break;
            default:
               ask(1);
            break;
         }
      }else{
         tell(' ???「まず俺んとこ来てもらって…」');
      }
   });

   if(!isTouch){
      for(let i=1; i<=3; i++){
         option[i].addEventListener('mouseenter', function(){
            this.style.color = "white";
            this.style.border = ".1vh solid white";
         });
         option[i].addEventListener('mouseleave', function(){
            this.style.color = "#fff9";
            this.style.border = ".1vh solid transparent";
         });
      };
   };


   option[1].addEventListener(upEvent, async function(){
      switch(question){

         case 1:
            ask(2);
         break;

         case 2:
            ask(11);
         break;

         case 12: // これってURL？：うん
            ctx["title"] = await getSiteTitle(ctx["content"]);
            ctx["url"] = (50 <= ctx["content"].length) ? ctx["content"].slice(0 ,50)+'…' : ctx["content"];
            preview = document.createElement('a');
            preview.href = ctx["content"];
            preview.target = "blank";
            preview.rel = "noopener noreferrer";
            preview.innerHTML = '<p style="display:flex; justify-content:flex-start; color:white; font-size:2vmin; margin:0 0 1vmin 0"><img src="./images/link.svg" style="height:3vmin">' + ctx["title"] + '</p><p style="color:#fff8; font-size:1.5vmin; margin:0;">' + ctx["url"] + '</p>';
            preview.style.backgroundColor = (ctx["backgroundColor"]) ? ctx["backgroundColor"] : "#ff5555";
            preview.style.transform = 'translate(calc(' + ((X - x1) * vmin) + 'px - 50%), calc(' + ((Y - y1) * vmin) + 'px - 50%))';
            preview.style.display = "block";
            preview.style.padding = "2vmin";
            preview.style.borderRadius = "3vmin";
            preview.style.fontFamily = "Noto Sans JP";
            preview.style.textDecoration = "none";
            preview.style.transition = "color .1s";
            document.querySelector('#floor').appendChild(preview);
            ask(31);
         break;

         case 13: // これってHTML？：うん
            preview = document.createElement('article');
            preview.innerHTML = ctx["content"];
            preview.style.transform = 'translate(calc(' + ((X - x1) * vmin) + 'px - 50%), calc(' + ((Y - y1) * vmin) + 'px - 50%))';
            document.querySelector('#floor').appendChild(preview);
            ask(41);
         break;

         case 18:
            ctx["type"] = "text";
            if(!ctx["textAlign"]) ctx["textAlign"] = "left";
            commit();
         break;

         case 25:
            ctx["type"] = "image";
            resizeImage();
         break;

         case 32:
            ctx["type"] = "url";
            commit();
         break;

         case 41:
            ctx["type"] = "html";
            commit();
         break;

         case 51:
            ask(52);
         break;
      }
   });

   option[2].addEventListener(upEvent, function(){
      switch(question){

         case 1:
            ask(0);
         break;

         case 2:
            ask(21);
         break;

         case 11:
            const content = document.querySelector('#textarea').value.trim();
            if(content){
               if(content.match(/<script/)){
                  option[0].innerHTML = "「あ、scriptは入れらんない。」";
               }else{
                  ctx["content"] = content;
                  option[1].classList.remove('textarea');
                  if(content.slice(0,4) == "http"){
                     ask(12);
                  }else if(content.slice(0,1) == "<" && content.slice(-1) == ">"){
                     ask(13);
                  }else{
                     createP();
                  }
               }
            }else{
               option[0].innerHTML = "「なんかは書いてよｗ」";
            }
         break;

         case 12:
            createP();
         break;

         case 13:
            createP();
         break;

         case 14:
            switch(document.querySelector('.rangeInput > input').value){
               case "0":
                  ctx["textAlign"] = "left";
               break;
               case "1":
                  ctx["textAlign"] = "center";
               break;
               case "2":
                  ctx["textAlign"] = "right";
               break;
            }
            option[1].classList.remove('rangeInput');
            ask(15);
         break;

         case 15:
            ctx["color"] = document.querySelector('.colorInput > input').value;
            option[1].classList.remove('colorInput');
            ask(16);
         break;

         case 16:
            ctx["fontSize"] = document.querySelector('.rangeInput > input').value;
            option[1].classList.remove('rangeInput');
            ask(17);
         break;

         case 17:
            ctx["fontFamily"] = document.querySelector('.select > select').value;
            option[1].classList.remove('select');
            ask(18);
         break;

         case 18:
            ask(17);
         break;

         case 21:
            option[1].classList.remove('fileInput');
            ask(2);
         break;

         case 22:
            if(preview.naturalWidth < preview.naturalHeight){
               ctx["width"] = round1( document.querySelector('.rangeInput > input').value * (preview.naturalWidth / preview.naturalHeight));
            }else{
               ctx["width"] = document.querySelector('.rangeInput > input').value;
            }
            option[1].classList.remove('rangeInput');
            ask(23);
         break;
         
         case 23:
            ctx["blendMode"] = document.querySelector('#blendMode').value;
            option[1].classList.remove('select');
            ask(24);
         break;
         
         case 24:
            ctx["tell"] = document.querySelector('.option > input[type="text"]').value;
            if(ctx["tell"] == "") ctx["tell"] = "……";
            preview.setAttribute('onclick', "tell('" + ctx["tell"] + "')");
            option[1].classList.remove('textInput');
            ask(25);
         break;

         case 25:
            ask(24);
         break;

         case 31:
            ctx["backgroundColor"] = document.querySelector('.colorInput > input').value;
            option[1].classList.remove('colorInput');
            ask(32);
         break;

         case 32:
            ask(31);
         break;

         case 41:
            document.querySelector('#floor').removeChild(preview);
            preview = null;
            ask(11);
         break;

         case 51:
            ask(0);
         break;

         case 52:
            commitPassword();
         break;
      }
   });

   option[3].addEventListener(upEvent, function(){
      switch(question){

         case 11:
            option[1].classList.remove('textarea');
            ask(2);
         break;

         case 12:
            ask(11);
         break;

         case 13:
            ask(11);
         break;

         case 14:
            switch(document.querySelector('.rangeInput > input').value){
               case "0":
                  ctx["textAlign"] = "left";
               break;
               case "1":
                  ctx["textAlign"] = "center";
               break;
               case "2":
                  ctx["textAlign"] = "right";
               break;
            }
            option[1].classList.remove('rangeInput');
            document.querySelector('#floor').removeChild(preview);
            preview = null;
            ask(11);
         break;

         case 15:
            ctx["color"] = document.querySelector('.colorInput > input').value;
            option[1].classList.remove('colorInput');
            if(preview.innerHTML.match(/<br>/)){
               ask(14);
            }else{
               document.querySelector('#floor').removeChild(preview);
               preview = null;
               ask(11);
            }
         break;

         case 16:
            ctx["fontSize"] = document.querySelector('.rangeInput > input').value;
            option[1].classList.remove('rangeInput');
            ask(15);
         break;

         case 17:
            ctx["fontFamily"] = document.querySelector('.select > select').value;
            option[1].classList.remove('select');
            ask(16);
         break;

         case 22: // 嘘、やっぱ…
            if(preview.naturalWidth < preview.naturalHeight){
               ctx["width"] = round1( document.querySelector('.rangeInput > input').value * (preview.naturalWidth / preview.naturalHeight));
            }else{
               ctx["width"] = document.querySelector('.rangeInput > input').value;
            }
            option[1].classList.remove('rangeInput');
            document.querySelector('#floor').removeChild(preview);
            preview = null;
            userFile = null;
            if(ctx["width"]) delete ctx["width"];
            if(ctx["blendMode"]) delete ctx["blendMode"];
            ask(21);
         break;
         
         case 23:
            ctx["blendMode"] = document.querySelector('.select > select').value;
            option[1].classList.remove('select');
            ask(22);
         break;
         
         case 24:
            ctx["tell"] = document.querySelector('.textInput > input').value;
            option[1].classList.remove('textInput');
            ask(23);
         break;

         case 31:
            option[1].classList.remove('colorInput');
            document.querySelector('#floor').removeChild(preview);
            preview = null;
            if(ctx["backgroundColor"]) delete ctx["backgroundColor"];
            if(ctx["title"]) delete ctx["title"];
            if(ctx["url"]) delete ctx["url"];
            ask(11);
         break;

         case 52:
            option[1].classList.remove('textInput');
            ask(0);
            tell('「住民に聞いてみて。」');
         break;
      }
   });



   function ask(i){
      question = i;
      //console.log(question, ctx);
      switch(i){
         
         case 0:
            if(preview){
               if(!ctx["left"]) document.querySelector('#floor').removeChild(preview); // commit後は放置
               preview = null;
               userFile = null;
            }
            message.style.transition = "opacity ease-out .5s";
            message.style.pointerEvents = "none";
            message.style.opacity = "0";
            you.style.opacity = "0.6";
            ctx = {};
            setTimeout(() => {
               if(option[1].innerHTML){ // tellが入ってなければ
                  for(let i=0; i<=3; i++){
                     option[i].innerHTML = "";
                     option[i].style.pointerEvents = "none";
                  }
               }
               option[1].classList.remove('fileInput');
               option[1].classList.remove('rangeInput');
               option[1].classList.remove('select');
               option[1].classList.remove('textarea');
               option[1].classList.remove('textInput');
               option[1].classList.remove('colorInput');
               you.style.pointerEvents = "auto";
               room.style.pointerevents = "auto";
               putting = false;
            }, 500);
         break;

         case 1:
            room.style.pointerevents = "none";
            you.style.pointerEvents = "none";
            you.style.opacity = "0";
            message.style.transition = "none";
            message.style.opacity = "1";
            option[0].innerHTML = "「なんか置いてく？」";
            option[1].innerHTML = "うん";
            option[2].innerHTML = "いや大丈夫";
            option[3].innerHTML = "";
            option[1].style.pointerEvents = "auto";
            option[2].style.pointerEvents = "auto";
            option[3].style.pointerEvents = "none";
            setTimeout(() => {
               message.style.pointerEvents = "auto";
               putting = true;
            }, 500);
         break;

         case 2:
            option[0].innerHTML = "「なに置きたいんだっけ。」";
            option[1].innerHTML = "文字";
            option[2].innerHTML = "画像";
            option[3].innerHTML = "";
            option[3].style.pointerEvents = "none";
         break;
         
         case 11:
            option[0].innerHTML = "「じゃここに書いてもらって…」";
            option[1].innerHTML = "<textarea id='textarea' placeholder='400文字まで' maxlength='400' autofocus></textarea>";
            option[1].classList.add('textarea');
            option[2].innerHTML = "これでOK";
            option[3].innerHTML = "　嘘、やっぱ…";
            option[3].style.pointerEvents = "auto";
            document.querySelector('#textarea').addEventListener('input', function(){
               this.style.height = 1 + 'px';
               this.style.height = this.scrollHeight + 'px';
            });
            document.querySelector('#textarea').addEventListener('focus', function(){
               option[1].style.border = ".1vh solid white";
            });
            document.querySelector('#textarea').addEventListener('blur', function(){
               option[1].style.border = ".1vh solid transparent";
            });
         break;
         
         case 12:
            option[0].innerHTML = "「…これってURL？」";
            option[1].innerHTML = "うん";
            option[2].innerHTML = "　いや…？";
            option[3].innerHTML = "　嘘、やっぱ…";
            option[3].style.pointerEvents = "auto";
         break;
         
         case 13:
            option[0].innerHTML = "「…これってHTML？」";
            option[1].innerHTML = "うん";
            option[2].innerHTML = "　いや…？";
            option[3].innerHTML = "　嘘、やっぱ…";
            option[3].style.pointerEvents = "auto";
         break;
         
         case 14:
            option[0].innerHTML = "「オッケ。どっちか寄せとく？」";
            option[1].innerHTML = '<input type="range" min="0" max="2" value="1" step="1">';
            option[1].classList.add('rangeInput');
            if(ctx["textAlign"]){
               preview.style.textAlign = ctx["textAlign"];
               switch(ctx["textAlign"]){
                  case "left":
                     document.querySelector('.rangeInput > input').value = "0";
                  break;
                  case "center":
                     document.querySelector('.rangeInput > input').value = "1";
                  break;
                  case "right":
                     document.querySelector('.rangeInput > input').value = "2";
                  break;
               }
            }
            option[2].innerHTML = "これでいい";
            option[3].innerHTML = "　嘘、やっぱ…";
            option[3].style.pointerEvents = "auto";
            document.querySelector('.rangeInput > input').addEventListener('input', function(){
               switch(this.value){
                  case "0":
                     preview.style.textAlign = "left";
                  break;
                  case "1":
                     preview.style.textAlign = "center";
                  break;
                  case "2":
                     preview.style.textAlign = "right";
                  break;
               }
            });
         break;
         
         case 15:
            option[0].innerHTML = "「色は？」";
            option[1].innerHTML = '<p>#ffffff</p><input type="color" value="#ffffff"/>';
            option[1].classList.add('colorInput');
            if(ctx["color"]){
               document.querySelector('.colorInput > input').value = ctx["color"];
               document.querySelector('.colorInput > p').innerHTML = ctx["color"];
            }
            option[2].innerHTML = "これでいい";
            option[3].innerHTML = "　嘘、やっぱ…";
            option[3].style.pointerEvents = "auto";
            document.querySelector('.colorInput > input').addEventListener('input', function(){
               document.querySelector('.colorInput > p').innerHTML = this.value;
               preview.style.color = this.value;
            });
         break;
         
         case 16:
            option[0].innerHTML = "「大きさは？こんなもん？」";
            option[1].innerHTML = '<input type="range" min="1" max="10" value="'+((ctx["fontSize"]) ? ctx["fontSize"] : '3')+'" step="0.1">';
            option[1].classList.add('rangeInput');
            option[2].innerHTML = "これぐらいで";
            option[3].innerHTML = "　嘘、やっぱ…";
            option[3].style.pointerEvents = "auto";
            document.querySelector('.rangeInput > input').addEventListener('input', function(){
               preview.style.fontSize = this.value + "vmin";
            });
         break;
         
         case 17:
            option[0].innerHTML = "「あとフォントも変えれるけど。」";
            option[1].innerHTML = '<select><option value="Noto Sans JP">1. Noto Sans</option><option value="Shippori Mincho B1">2. しっぽり明朝B1</option><option value="Zen Maru Gothic">3. ZEN丸ゴシック</option><option value="DotGothic16">4. ドットゴシック16</option><option value="Rampart One">5. ランパート One</option><option value="Hachi Maru Pop">6. はちまるポップ</option><option value="Kaisei Decol">7. 解星デコール</option></select>';
            option[1].classList.add('select');
            if(ctx["fontFamily"]){
               switch(ctx["fontFamily"]){
                  case "Shippori Mincho B1":
                     document.querySelector('.select > select').options[1].selected = true;
                  break;
                  case "Zen Maru Gothic":
                     document.querySelector('.select > select').options[2].selected = true;
                  break;
                  case "DotGothic16":
                     document.querySelector('.select > select').options[3].selected = true;
                  break;
                  case "Rampart One":
                     document.querySelector('.select > select').options[4].selected = true;
                  break;
                  case "Hachi Maru Pop":
                     document.querySelector('.select > select').options[5].selected = true;
                  break;
                  case "Kaisei Decol":
                     document.querySelector('.select > select').options[6].selected = true;
                  break;
               }
            }
            option[2].innerHTML = "これがいい";
            option[3].innerHTML = "　嘘、やっぱ…";
            option[3].style.pointerEvents = "auto";
            document.querySelector('.select > select').addEventListener('change', function(){
               preview.style.fontFamily = this.value;
            });
         break;
         
         case 18:
            option[0].innerHTML = "「じゃぁこれで置いときます──」";
            option[1].innerHTML = "ありがとう";
            option[2].innerHTML = "　待って！やっぱ…";
            option[3].innerHTML = "";
            option[3].style.pointerEvents = "none";
         break;
         
         case 21:
            option[0].innerHTML = "「あ、いま預かるよ。」";
            option[1].innerHTML = 'ファイルを選ぶ<input type="file" id="fileInput" accept=".jpg, .jpeg, .png"/>';
            option[1].classList.add('fileInput');
            option[2].innerHTML = "　嘘、やっぱ…";
            option[3].innerHTML = "";
            option[3].style.pointerEvents = "none";
            document.querySelector('#fileInput').addEventListener('change', function(){
               if(question == 0) return; // ファイル選択中に抜けられたら
               const files = this.files;
               if(files.length == 0){
                  option[0].innerHTML = "「どれ？」";
                  return;
               }else if(files.length > 1){
                  option[0].innerHTML = "「あ、一枚だけ…」";
                  return;
               }
               if(!files[0].type.match(/^image\/(jpeg|jpg|png)$/)){
                  //console.log(files[0].type);
                  option[0].innerHTML = "「一応お願いしてる形式が、PNGかJPEGんなってて。」";
                  return;
               }
               userFile = files[0];
               preview = document.createElement('img');
               const fileReader = new FileReader();
               fileReader.readAsDataURL(userFile);
               fileReader.onload = (function(){
                  preview.src = fileReader.result;
                  preview.onload = (function(){
                     preview.style.transform = 'translate(calc(' + ((X - x1) * vmin) + 'px - 50%), calc(' + ((Y - y1) * vmin) + 'px - 50%))';
                     preview.style.transition = "width .1s";
                     if(preview.naturalWidth < preview.naturalHeight){
                        preview.style.height = "50vmin";
                     }else{
                        preview.style.width = "50vmin";
                     }
                     document.querySelector('#floor').appendChild(preview);
                     option[1].classList.remove('fileInput');
                     ask(22);
                  });
               });
            });
         break;
         
         case 22:
            option[0].innerHTML = "「大きさこんなもん？」";
            option[1].innerHTML = '<input type="range" min="1" max="100" value="'+((ctx["width"]) ? ctx["width"] : '50')+'" step="1">';
            option[1].classList.add('rangeInput');
            option[2].innerHTML = "これぐらいで";
            option[3].innerHTML = "　嘘、やっぱ…";
            option[3].style.pointerEvents = "auto";
            document.querySelector('.rangeInput > input').addEventListener('input', function(){
               if(preview.naturalWidth < preview.naturalHeight){
                  preview.style.height = this.value + "vmin";
               }else{
                  preview.style.width = this.value + "vmin";
               }
            });
         break;
         
         case 23:
            option[0].innerHTML = "「色味とかも変えれるけど。」";
            option[1].classList.add('select');
            option[1].innerHTML = '<select id="blendMode"><option value="normal">1. 普通</option><option value="lighten">2. 比較（明）</option><option value="darken">3. 比較（暗）</option><option value="color-dodge">4. 覆い焼き</option><option value="color-burn">5. 焼き込み</option><option value="hard-light">6. ハードライト</option><option value="difference">7. 差の絶対値</option></select>';
            if(ctx["blendMode"]){
               switch(ctx["blendMode"]){
                  case "lighten":
                     document.querySelector('#blendMode').options[1].selected = true;
                  break;
                  case "darken":
                     document.querySelector('#blendMode').options[2].selected = true;
                  break;
                  case "color-dodge":
                     document.querySelector('#blendMode').options[3].selected = true;
                  break;
                  case "color-burn":
                     document.querySelector('#blendMode').options[4].selected = true;
                  break;
                  case "hard-light":
                     document.querySelector('#blendMode').options[5].selected = true;
                  break;
                  case "difference":
                     document.querySelector('#blendMode').options[6].selected = true;
                  break;
               }
            }
            option[2].innerHTML = "これでいい";
            option[3].innerHTML = "　嘘、やっぱ…";
            option[3].style.pointerEvents = "auto";
            document.querySelector('#blendMode').addEventListener('change', function(){
               preview.style.mixBlendMode = this.value;
            });
         break;
         
         case 24:
            option[0].innerHTML = "「あ、あと押されたときなんて言う？」";
            option[1].innerHTML = "<input type='text' placeholder='……' maxlength='20' autofocus></input>";
            option[1].classList.add('textInput');
            option[2].innerHTML = "って言う";
            option[3].innerHTML = "　嘘、やっぱ…";
            option[3].style.pointerEvents = "auto";
         break;
         
         case 25:
            option[0].innerHTML = "「じゃぁこれで置いときます──」";
            option[1].innerHTML = "ありがとう";
            option[2].innerHTML = "　待って！やっぱ…";
            option[3].innerHTML = "";
            option[3].style.pointerEvents = "none";
         break;
         
         case 31: // URL
         option[0].innerHTML = "「これ色、どうする？」";
         option[1].innerHTML = '<p>#ff5555</p><input type="color" value="#ff5555"/>';
         option[1].classList.add('colorInput');
         if(ctx["backgroundColor"]){
            document.querySelector('.colorInput > input').value = ctx["backgroundColor"];
            document.querySelector('.colorInput > p').innerHTML = ctx["backgroundColor"];
         }
         option[2].innerHTML = "これでいい";
         option[3].innerHTML = "　嘘、やっぱ…";
         option[3].style.pointerEvents = "auto";
         document.querySelector('.colorInput > input').addEventListener('input', function(){
            document.querySelector('.colorInput > p').innerHTML = this.value;
            preview.style.backgroundColor = this.value;
         });
         break;
         
         case 32:
            option[0].innerHTML = "「じゃぁこれで置いときます──」";
            option[1].innerHTML = "ありがとう";
            option[2].innerHTML = "　待って！やっぱ…";
            option[3].innerHTML = "";
            option[3].style.pointerEvents = "none";
         break;
         
         case 41: // HTML
            option[0].innerHTML = "「じゃぁこれで置いときます──」";
            option[1].innerHTML = "ありがとう";
            option[2].innerHTML = "　待って！やっぱ…";
            option[3].innerHTML = "";
            option[3].style.pointerEvents = "none";
         break;

         case 51: // 住民認証
            you.style.pointerEvents = "none";
            room.style.pointerevents = "none";
            you.style.opacity = "0";
            message.style.transition = "none";
            message.style.opacity = "1";
            option[0].innerHTML = "カズキタさん「ウッス…」";
            option[1].innerHTML = "　物置かせてくれない？";
            option[2].innerHTML = "　うっす…";
            option[3].innerHTML = "";
            option[1].style.pointerEvents = "auto";
            option[2].style.pointerEvents = "auto";
            option[3].style.pointerEvents = "none";
            setTimeout(() => {
               message.style.pointerEvents = "auto";
               putting = true;
            }, 500);
         break;

         case 52:
            option[0].innerHTML = "「合言葉は？」";
            option[1].innerHTML = "<input type='text' maxlength='20' autofocus></input>";
            option[1].classList.add('textInput');
            option[2].innerHTML = "だった気がする";
            option[3].innerHTML = " 知らない…";
            option[3].style.pointerEvents = "auto";
         break;
      }
   };

   function commitPassword(){
      ctx["password"] = document.querySelector('.option > input[type="text"]').value;
      //console.log(ctx);
      fetch('checkPassword.php', {method : "post", body: JSON.stringify(ctx), headers: {"Content-Type": "application/json"}
      }).then((res) => {
         if(res.status !== 200){
            throw new Error("system error.");
         }
         return res.json();
      }).then((json) => {
         message.style.pointerEvents = "auto";
         message.style.opacity = "1";
         if(json.status){
            //console.log("住民認証成功");
            you.src = "./images/you_.svg";
            you.style.cursor = "pointer";
            localStorage.setItem('password', ctx["password"]);
            ask(0);
            tell(json.result);
         }else{
            //console.error("住民認証失敗, " + json.result);
            option[0].innerHTML = json.result;
         }
      }).catch((error) => {
         console.error(error);
         option[0].innerHTML = "「あれ、電波が…」";
      })
   };

   function resizeImage(){ // 画像リサイズ
      if(preview.naturalWidth > ctx["width"] * 8){
         const canvas = document.createElement('canvas');
         const w = ctx["width"] * 8;
         const h = w * preview.naturalHeight / preview.naturalWidth;
         canvas.width = w;
         canvas.height = h;
         const context = canvas.getContext('2d');
         context.drawImage(preview, 0, 0, w, h);
         canvas.toBlob(function(blob){
            commitImage(blob);
         });
      }else{
         commitImage(userFile);
      }
   };

   function commitImage(file){
      const formData = new FormData();
      formData.append("image", file); // ファイル内容を詰める
      formData.append("place", place);
      formData.append("password", localStorage.getItem('password'));
      //console.log(formData);

      fetch("recieveImage.php", {method: "POST", body: formData})
      .then((res)=>{
         if(!res.ok){
            throw new Error(`Fetch: ${res.status} ${res.statusText}`);
         }
         return(res.json());
      }).then((json)=>{
         if(json.status){
            //console.log("画像アップロード成功");
            ctx["src"] = json.result;
            commit();
         }else{
            //console.log("画像アップロード失敗, " + json.result);
            option[0].innerHTML = json.result;
         }
      }).catch((error)=>{
         console.error(error);
         option[0].innerHTML = "「あれ、電波が…」";
      });
   };

   function commit(){
      message.style.pointerEvents = "none";
      message.style.opacity = ".5";
      ctx["place"] = place;
      ctx["left"] = round1( X - x1 );
      ctx["top"] = round1( Y - y1 );
      ctx["password"] = localStorage.getItem('password');

      fetch('recieveHTML.php', {method : "post", body: JSON.stringify(ctx), headers: {"Content-Type": "application/json"}
      }).then((res) => {
         if(res.status !== 200){
            throw new Error("system error.");
         }
         return res.json();
      }).then((json) => {
         message.style.pointerEvents = "auto";
         message.style.opacity = "1";
         if(json.status){
            //console.log("HTMLアップロード成功");
            you.src = "./images/you.svg";
            you.style.cursor = "default";
            localStorage.setItem('userID', getUserID());
            ask(0);
            tell(json.result);
         }else{
            //console.error("HTMLアップロード失敗, " + json.result);
            option[0].innerHTML = json.result;
         }
      }).catch((error) => {
         console.error(error);
         option[0].innerHTML = "「あれ、電波が…」";
      });
   };

   function tell(text){
      message.style.transition = "none";
      message.style.opacity = "1";
      option[0].innerHTML = text;
      for(let i=1; i<=3; i++){
         if(option[i].innerHTML){
            option[i].innerHTML = "";
            option[i].style.pointerEvents = "none";
         }
      };
      setTimeout(() => {
         if(option[0].innerHTML == text){
            message.style.transition = "opacity ease-out .5s";
            message.style.opacity = "0";
         }
      }, 3000)
   };

   window.addEventListener("beforeunload", function(event) {
      if(putting){
         const orecle = "「置かなくていい？」";
         event.returnValue = orecle;
         return orecle;
      }
   });

   function round1(value) {
      return Math.round(value * 10) / 10;
   };

   function createP(){
      preview = document.createElement('p');
      preview.innerHTML = htmlspecialchars(ctx["content"]).replaceAll("\n", "<br>");
      preview.style.textAlign = "center";
      preview.style.color = "white";
      preview.style.fontFamily = "Noto Sans JP";
      preview.style.fontSize = "3vmin";
      preview.style.transform = 'translate(calc(' + ((X - x1) * vmin) + 'px - 50%), calc(' + ((Y - y1) * vmin) + 'px - 50%))';
      preview.style.transition = "font-size .1s, color .1s";
      if(ctx["color"]) preview.style.color = ctx["color"];
      if(ctx["fontSize"]) preview.style.fontSize = ctx["fontSize"] + "vmin";
      if(ctx["fontFamily"]) preview.style.fontFamily = ctx["fontFamily"];
      document.querySelector('#floor').appendChild(preview);
      if(preview.innerHTML.match(/<br>/)){
         ask(14);
      }else{
         ask(15);
      }
   };

   function htmlspecialchars(str){
      return (str + '').replace(/&/g,'&amp;')
                       .replace(/"/g,'&quot;')
                       .replace(/'/g,'&#039;')
                       .replace(/</g,'&lt;')
                       .replace(/>/g,'&gt;'); 
   };

   function getSiteTitle(url){
      return new Promise(resolve => {
         fetch('https://cors-anywhere.herokuapp.com/' + url).then(res => res.text()).then(text => {
            const el = new DOMParser().parseFromString(text, "text/html");
            const headEls = el.head.children;
            return Array.from(headEls).map(v => {
               const prop = v.getAttribute('property');
               if (!prop) return;
               return { prop: prop.replace("og:",""),content: v.getAttribute("content")};
            })
         }).then(list =>{
            return list.filter(v=>v);
         }).then(result =>{
            const title = htmlspecialchars(result.filter(v=>v.prop==="title")[0].content);
            if(title){
               const shortTitle = (50 <= title.length) ? title.slice(0 ,50)+'…' : title;
               resolve(shortTitle);
            }else{
               throw new Error(result);
            }
         }).catch(error =>{
            console.error('リンク先サイトからOGPを取得できませんでした ', error);
            resolve('不明なサイト');
         })
      })
   };

   function getUserID(){
      const time = new Date();
      return time.getDate()*100 + time.getMonth()*10000 + time.getFullYear();
   }


   //-------------------------------------------------
   // 無方向スクロール
   //-------------------------------------------------

   function resize(){
      vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
      offsetX = window.innerWidth / (2 * vmin);
      offsetY = window.innerHeight / (2 * vmin);
   }

   window.addEventListener('resize', resize);


   document.addEventListener('wheel', function(event){
      const now = Date.now();
      const dt = (now - lastMove) * 0.3 * vmin; // 1/3倍の距離
      lastMove = now;
      if(!linking && dt){
         vx = event.deltaX / dt;
         vy = event.deltaY / dt;
      }
      event.preventDefault();
   }, {passive: false});


   document.addEventListener(downEvent, function(event){
      moved = false;
      if(!event.target.closest('#message')){
         pointerDown = true;
         if(isTouch){
            lastX = event.changedTouches[0].pageX;
            lastY = event.changedTouches[0].pageY;
         }else{
            lastX = event.pageX;
            lastY = event.pageY;
         }
         vx = 0;
         vy = 0;
      }
   });


   document.addEventListener(moveEvent, function(event){
      if(!moved) moved = true;
      const now = Date.now();
      const dt = (now - lastMove) * 0.15 * vmin; // 1/1.5倍の距離
      lastMove = now;
      if(pointerDown){
         if(!linking && dt){
            if(isTouch){
               vx = -(event.changedTouches[0].pageX - lastX) / dt;
               vy = -(event.changedTouches[0].pageY - lastY) / dt;
               lastX = event.changedTouches[0].pageX;
               lastY = event.changedTouches[0].pageY;
            }else{
               vx = -(event.pageX - lastX) / dt;
               vy = -(event.pageY - lastY) / dt;
               lastX = event.pageX;
               lastY = event.pageY;
            }
         }
         event.preventDefault();
      }
   }, {passive: false});


   document.addEventListener(upEvent, function(event){
      if(pointerDown){
         pointerDown = false;
      }
      if(!moved){
         if(putting && !event.target.closest('#message')){
            ask(0);
         }else if(place == 'kazukita' && event.target.src){
            if(event.target.src.slice(-18) == '/images/shunin.PNG'){
               if(localStorage.getItem('password')){
                  tell("「ウッス…」");
               }else{
                  ask(51);
               }
            }
         }
      }
   });


   document.addEventListener('keydown', function(event){
      if(putting) return;
      switch(event.key){
         case 'a':
         case 'ArrowLeft':
            if(!pressL) pressL = true;
         break;

         case 'd':
         case 'ArrowRight':
            if(!pressR) pressR = true;
         break;

         case 'w':
         case 'ArrowUp':
            if(!pressU) pressU = true;
         break;

         case 's':
         case 'ArrowDown':
            if(!pressD) pressD = true;
         break;

         default:
         break;
      }
   });

   document.addEventListener('keyup', function(event){
      if(putting) return;
      switch(event.key){
         case 'a':
         case 'ArrowLeft':
            pressL = false;
         break;

         case 'd':
         case 'ArrowRight':
            pressR = false;
         break;

         case 'w':
         case 'ArrowUp':
            pressU = false;
         break;

         case 's':
         case 'ArrowDown':
            pressD = false;
         break;

         default:
         break;
      }
   });

   function update(){
      if((pressL ^ pressR) && !linking){
         if(Math.abs(vx) < 0.7) vx += (pressR-0.5) * 0.1;
      }else if(0.001 < Math.abs(vx)){
         vx *= 0.93;
      }else{
         vx = 0;
      }
      if((pressU ^ pressD) && !linking){
         if(Math.abs(vy) < 0.7) vy += (pressD-0.5) * 0.1;
      }else if(0.001 < Math.abs(vy)){
         vy *= 0.93;
      }else{
         vy = 0;
      }
      const now = Date.now();
      const dt = (now - lastUpdate) * 0.1; // vx, vy = vmin/10ms
      lastUpdate = now;
      if(vx||vy){
         if(vx){
            X += vx * dt;
            if(X < x1){
               X = x1;
               leftWall();
            }else if(x2 < X){
               X = x2;
               rightWall();
            }
         }
         if(vy){
            Y += vy * dt;
            if(Y < y1){
               Y = y1;
               upperWall();
            }else if(y2 < Y){
               Y = y2;
               bottomWall();
            }
         }
         extraWall();
      }
      foX += (X - foX) * 0.2;
      foY += (Y - foY) * 0.2;
      room.style.transform = 'translate(' + ((offsetX - foX) * vmin) + 'px, ' + ((offsetY - foY) * vmin) + 'px)';
      if(preview){
         preview.style.transform = 'translate(calc(' + ((X - x1) * vmin) + 'px - 50%), calc(' + ((Y - y1) * vmin) + 'px - 50%))';
      }
      window.requestAnimationFrame(update); // 常時アニメーション
   }
   


   //-------------------------------------------------
   // 非同期遷移
   //-------------------------------------------------
   
   async function link(there){
      if(putting || linking) return;
      linking = true;
      room.style.opacity = "0";
      place = there;
      reset();
      Promise.all([getHTML(), waitTransition()])
      .then((result) => {
         if(floor){
            room.removeChild(floor);
            floor = null;
         }
         document.querySelector("title").innerHTML = "モテアマスの" + pageTitle;
         //history.replaceState(null, null, baseURL+place);
         floor = document.createElement('div');
         floor.id = "floor";
         floor.style.cssText = 'left:' + x1 + 'vmin; top:' + y1 + 'vmin; width:' + (x2-x1) + 'vmin; height:' + (y2-y1) + 'vmin;';
         floor.innerHTML = result[0] + extraHTML;
         // const contents = document.querySelectorAll("#floor > *");
         // for(let i=0; i<contents.length; i++){
         //    contents[i].style.transform = "translate(-50%,-50%) rotateZ(" + Math.random() + "turn)";
         // }
         let bgImg = new Image();
         bgImg.onload = function(){
            floor.style.backgroundImage = 'url(' + bgImg.src + ')';
            room.appendChild(floor);
            room.style.opacity = "1";
         };
         bgImg.src = './images/' + place + '.jpg';
         setTimeout(() => {
            linking = false;
         }, 300);
         if(visited.indexOf(place) == -1){
            visited.push(place);
            localStorage.setItem('visited', visited);
         }
      });
   }

   function getHTML(){
      return new Promise(resolve => {
         fetch('./htmls/' + place + '.html')
         .then(response => response.text())
         .then(contentsHTML => {
            resolve(contentsHTML);
         })
      })
   }

   function waitTransition(){
      return new Promise(resolve => {
         setTimeout(() => {
            resolve("waited!");
         }, 800)
      })
   }

   function reset(){
      leftWall = rightWall = upperWall = bottomWall = extraWall = function(){};
      extraHTML = "";

      switch(place){

         case "genkan":
            pageTitle = "玄関"; x1 = -44; x2 = 44;
            y1 = -44;
            y2 = 44;
            upperWall = function(){
               if(putting || linking) return;
               linking = true;
               room.style.opacity = "0";
               you.style.opacity = "0";
               setTimeout(() => {
                  if(visited.indexOf('access') == -1){
                     visited.push('access');
                     localStorage.setItem('visited', visited);
                  }
                  window.location.href = './access/';
               }, 800);
            }
            bottomWall = function(){
               link("ribingu");
            }
            rightWall = function(){
               if(0<Y) link("benkyo-");
            }
            leftWall = function(){
               if(0>Y) link("kaidan12");
            }
            extraHTML = '<img src="images/logo.PNG" style="width:30vmin; left:50%; top:50%; z-index:2147483647;">';
         break;

         case "ribingu":
            pageTitle = "リビング"; x1 = -44; x2 = 228;
            y1 = 44;
            y2 = 268;
            upperWall = function(){
               if(X<50) link("genkan");
            }
            rightWall = function(){
               if(132<Y && Y<180) link("rouka1");
            }
            extraWall = function(){
               if(132<Y && X<12){
                  if(Y-132 > 12-X){
                     X = 12;
                  }else{
                     link("samurandori-");
                  }
               }
            }
            extraHTML = "<div style='border-radius: 2vmin; position:absolute; left:-4vmin; top:88vmin; width:60vmin; height:140vmin; background-color:#111111; z-index:2147483647; transform:none;'></div>";
         break;

         case "kaidan12":
            pageTitle = "階段"; x1 = -92; x2 = -44;
            y1 = -44;
            y2 = 212;
            rightWall = function(){
               if(0>Y){
                  link("genkan");
               }else if(172<Y){
                  link("rouka2");
               }
            }
         break;

         case "benkyo-":
            pageTitle = "勉強部屋"; x1 = 44; x2 = 228;
            y1 = -44;
            y2 = 44;
            leftWall = function(){
               if(0<Y) link("genkan");
            }
         break;

         case "koya":
            pageTitle = "小屋部屋"; x1 = 228; x2 = 324;
            y1 = -44;
            y2 = 132;
            bottomWall = function(){
               if(X<276) link("rouka1");
            }
         break;

         case "sannin":
            pageTitle = "三人部屋"; x1 = 324; x2 = 420;
            y1 = -44;
            y2 = 132;
            bottomWall = function(){
               if(324<X && X<372) link("rouka1");
            }
         break;

         case "tankan":
            pageTitle = "単管部屋"; x1 = 420; x2 = 516;
            y1 = -44;
            y2 = 132;
            bottomWall = function(){
               if(420<X) link("rouka1");
            }
         break;

         case "rouka1":
            pageTitle = "廊下"; x1 = 228; x2 = 468;
            y1 = 132;
            y2 = 268;
            leftWall = function(){
               if(Y<180) link("ribingu");
            }
            upperWall = function(){
               if(X<276){
                  link("koya")
               }else if(324<X && X<372){
                  link("sannin")
               }else if(420<X){
                  link("tankan")
               }
            }
            extraWall = function(){
               if(180<Y && 276<X){
                  if(Y-180 < X-276){
                     if(276<X && X<324){
                        link("atsutoire")
                     }else if(372<X && X<420){
                        link("datsui")
                     }else{
                        Y = 180;
                     };
                  }else{
                     X = 276;
                  }
               }
            }
            extraHTML = "<div style='border-radius: 2vmin; position:absolute; left:48vmin; top:48vmin; width:200vmin; height:100vmin; background-color:#111111; z-index:2147483647; transform:none;'></div>";
         break;

         case "atsutoire":
            pageTitle = "トイレ"; x1 = 276; x2 = 324;
            y1 = 180;
            y2 = 268;
            upperWall = function(){
               link("rouka1");
            }
         break;

         case "datsui":
            pageTitle = "脱衣所"; x1 = 372; x2 = 468;
            y1 = 180;
            y2 = 220;
            upperWall = function(){
               if(X<420) link("rouka1");
            }
            leftWall = function(){
               if(Y<220) link("temaeburo");
            }
            bottomWall = function(){
               if(X<420){
                  link("kireishawa-");
               }else if(420<X){
                  link("kitanashawa-");
               }
            }
            rightWall = function(){
               link("okuburo");
            }
            extraHTML = '<div style="color:#ca9; font-family:Noto Sans JP; mix-blend-mode:color-burn; transform-origin:CENTER, CENTER; transform:rotateZ(-5deg); position:relative; margin:1vmin; width:92vmin; height:36vmin;"><p style="margin:0; font-size:3vmin;">THE ROOMS YOU\'VE VISITED: [' + String(visited).replaceAll(',', ', ') + '] = ' + visited.length + '/46</p></div>';
         break;

         case "temaeburo":
            pageTitle = "浴室"; x1 = 324; x2 = 372;
            y1 = 180;
            y2 = 268;
            rightWall = function(){
               if(Y<220)link("datsui");
            }
         break;

         case "kireishawa-":
            pageTitle = "シャワールーム"; x1 = 372; x2 = 420;
            y1 = 220;
            y2 = 268;
            upperWall = function(){
               link("datsui");
            }
         break;

         case "kitanashawa-":
            pageTitle = "シャワールーム"; x1 = 420; x2 = 468;
            y1 = 220;
            y2 = 268;
            upperWall = function(){
               link("datsui");
            }
         break;

         case "okuburo":
            pageTitle = "浴室"; x1 = 468; x2 = 516;
            y1 = 132;
            y2 = 220;
            leftWall = function(){
               if(180<Y) link("datsui");
            }
         break;

         case "samurandori-":
            pageTitle = "ランドリー"; x1 = -44; x2 = 12;
            y1 = 132;
            y2 = 212;
            upperWall = function(){
               link("ribingu");
            }
            leftWall = function(){
               if(170<Y && Y<200) link("soto");
            }
            bottomWall = function(){
               link("samutoire");
            }
         break;

         case "samutoire":
            pageTitle = "トイレ"; x1 = -44; x2 = 12;
            y1 = 212;
            y2 = 268;
            upperWall = function(){
               link("samurandori-");
            }
         break;

         case "soto":
            pageTitle = "駐車場"; x1 = -188; x2 = -44;
            y1 = 0;
            y2 = 268;
            rightWall = function(){
               if(170<Y && Y<200) link("samurandori-");
            }
            extraWall = function(){
               if(Y<80){
                  Y = 80;
               }else if(-168<X && X<-112 && 100<Y && Y<224){
                  if(-140 < X){
                     if(162 < Y){ // 右下
                        if(-112-X < 224-Y){
                           X = -112;
                        }else{
                           link("mobaha");
                        }
                     }else{ // 右上
                        if(-112-X < Y-100){
                           X = -112;
                        }else{
                           Y = 100;
                        }

                     }
                  }else{
                     if(162 < Y){ // 左下
                        if(X+168 < 224-Y){
                           X = -168;
                        }else{
                           link("mobaha");
                        }
                     }else{ // 左上
                        if(X+168 < Y-100){
                           X = -168;
                        }else{
                           Y = 100;
                        }
                     }
                  }
               }else if(-84<X && 212<Y){
                  if(X+84 < Y-212){
                     X = -84;
                  }else{
                     link("sototoire");
                  }
               }
            }
            extraHTML = '<div style="border-radius: 2vmin; position:absolute; left:104vmin; top:212vmin; width:45vmin; height:59vmin; background-color:#111111; z-index:2147483647; transform:none;"></div><div style="border-radius: 2vmin; position:absolute; left:20vmin; top:100vmin; width:56vmin; height:124vmin; background-color:#111111; z-index:2147483647; transform:none;"></div>'
         break;

         case "sototoire":
            pageTitle = "トイレ"; x1 = -84; x2 = -44;
            y1 = 212;
            y2 = 268;
            upperWall = function(){
               link("soto");
            }
         break;

         case "mobaha":
            pageTitle = "モバイルハウス"; x1 = -168; x2 = -112;
            y1 = 100;
            y2 = 224;
            bottomWall = function(){
               link("soto");
            }
         break;

         case "rouka2":
            pageTitle = "廊下"; x1 = -44; x2 = 516;
            y1 = 132;
            y2 = 212;
            leftWall = function(){
               if(172<Y) link("kaidan12");
            }
            upperWall = function(){
               if(-4<X && X<36){
                  link("nakano");
               }else if(76<X && X<116){
                  link("so");
               }else if(116<X && X<156){
                  link("dori");
               }else if(196<X && X<236){
                  link("kaoru");
               }else if(316<X && X<356){
                  link("makita");
               }else if(396<X && X<436){
                  link("shino");
               }else if(456<X && X<496){
                  link("oku");
               }
            }
            bottomWall = function(){
               if(36<X && X<76){
                  link("otokorandori-");
               }else if(96<X && X<136){
                  link("onnarandori-");
               }else if(236<X){
                  link("kyu-to-");
               }
            }
            extraWall = function(){
               if(136<X && X<236 && 172<Y){
                  if(X-136 < Y-172){
                     X = 136;
                  }else if(236-X < Y-172){
                     X = 236;
                  }else if(X<176){
                     link("kaidan23");
                  }else{
                     Y = 172;
                  }
               }else if(276<X && 188<Y){
                  if(X-276 < Y-188){
                     X = 276;
                  }else{
                     if(356<X && X<396){
                        link("otokodatsui");
                     }else if(436<X && X<476){
                        link("onnadatsui");
                     }else if(396<X && X<436){
                        link("toire2");
                     }else{
                        Y = 188;
                     }
                  }
               }
            }
            extraHTML = '<div style="border-radius: 2vmin; position:absolute; left:180vmin; top:40vmin; width:100vmin; height:44vmin; background-color:#111111; z-index:2147483647; transform:none;"></div><div style="border-radius: 2vmin; position:absolute; left:320vmin; top:56vmin; width:250vmin; height:30vmin; background-color:#111111; z-index:2147483647; transform:none;"></div>';
         break;

         case "nakano":
            pageTitle = "中野部屋"; x1 = -44; x2 = 36;
            y1 = -44;
            y2 = 132;
            bottomWall = function(){
               if(-4<X) link("rouka2");
            }
         break;

         case "so":
            pageTitle = "そう部屋"; x1 = 36; x2 = 116;
            y1 = -44;
            y2 = 132;
            bottomWall = function(){
               if(76<X) link("rouka2");
            }
         break;

         case "dori":
            pageTitle = "どり部屋"; x1 = 116; x2 = 196;
            y1 = -44;
            y2 = 132;
            bottomWall = function(){
               if(X<156) link("rouka2");
            }
         break;

         case "kaoru":
            pageTitle = "かおる部屋"; x1 = 196; x2 = 276;
            y1 = -44;
            y2 = 132;
            bottomWall = function(){
               if(X<236) link("rouka2");
            }
         break;

         case "makita":
            pageTitle = "マキタ部屋"; x1 = 276; x2 = 356;
            y1 = -44;
            y2 = 132;
            bottomWall = function(){
               if(316<X) link("rouka2");
            }
         break;

         case "shino":
            pageTitle = "しの部屋"; x1 = 356; x2 = 436;
            y1 = -44;
            y2 = 132;
            bottomWall = function(){
               if(396<X) link("rouka2");
            }
         break;

         case "oku":
            pageTitle = "奥部屋"; x1 = 436; x2 = 516;
            y1 = -44;
            y2 = 132;
            bottomWall = function(){
               if(456<X && X<496) link("rouka2");
            }
         break;

         case "otokotoire":
            pageTitle = "トイレ"; x1 = -44; x2 = -4;
            y1 = 212;
            y2 = 268;
            rightWall = function(){
               if(Y<252) link("otokorandori-");
            }
         break;

         case "otokorandori-":
            pageTitle = "ランドリー"; x1 = -4; x2 = 76;
            y1 = 212;
            y2 = 268;
            leftWall = function(){
               if(Y<252) link("otokotoire");
            }
            upperWall = function(){
               if(36<X) link("rouka2");
            }
         break;

         case "onnarandori-":
            pageTitle = "ランドリー"; x1 = 76; x2 = 156;
            y1 = 212;
            y2 = 268;
            rightWall = function(){
               if(Y<252) link("onnatoire");
            }
            upperWall = function(){
               if(96<X && X<136) link("rouka2");
            }
         break;

         case "onnatoire":
            pageTitle = "トイレ"; x1 = 156; x2 = 196;
            y1 = 212;
            y2 = 268;
            leftWall = function(){
               if(Y<252) link("onnarandori-");
            }
         break;

         case "kyu-to-":
            pageTitle = "給湯室"; x1 = 196; x2 = 316;
            y1 = 188;
            y2 = 268;
            upperWall = function(){
               if(236<X && X<276) link("rouka2");
            }
            extraWall = function(){
               if(X<276 && Y<212){
                  if(276-X < 212-Y){
                     X = 276;
                  }else if(236<X){
                     link("rouka2");
                  }else{
                     Y = 212
                  }
               }
            }
            extraHTML = '<div style="border-radius: 2vmin; position:absolute; left:-4vmin; top:-4vmin; width:84vmin; height:28vmin; background-color:#111111; z-index:2147483647; transform:none;"></div>'
         break;

         case "otokodatsui":
            pageTitle = "脱衣所"; x1 = 356; x2 = 396;
            y1 = 188;
            y2 = 228;
            upperWall = function(){
               link("rouka2");
            }
            leftWall = function(){
               link("otokoburo");
            }
            bottomWall = function(){
               link("otokoshawa-");
            }
         break;

         case "otokoburo":
            pageTitle = "浴室"; x1 = 316; x2 = 356;
            y1 = 188;
            y2 = 268;
            rightWall = function(){
               if(Y<228) link("otokodatsui");
            }
         break;

         case "otokoshawa-":
            pageTitle = "シャワールーム"; x1 = 356; x2 = 396;
            y1 = 228;
            y2 = 268;
            upperWall = function(){
               link("otokodatsui");
            }
         break;

         case "toire2":
            pageTitle = "トイレ"; x1 = 396; x2 = 436;
            y1 = 188;
            y2 = 268;
            upperWall = function(){
               link("rouka2");
            }
         break;

         case "onnadatsui":
            pageTitle = "脱衣所"; x1 = 436; x2 = 476;
            y1 = 188;
            y2 = 228;
            upperWall = function(){
               link("rouka2");
            }
            rightWall = function(){
               link("onnaburo");
            }
            bottomWall = function(){
               link("onnashawa-");
            }
         break;

         case "onnaburo":
            pageTitle = "浴室"; x1 = 476; x2 = 516;
            y1 = 188;
            y2 = 268;
            leftWall = function(){
               if(Y<228) link("onnadatsui");
            }
         break;

         case "onnashawa-":
            pageTitle = "シャワールーム"; x1 = 436; x2 = 476;
            y1 = 228;
            y2 = 268;
            upperWall = function(){
               link("onnadatsui");
            }
         break;

         case "kaidan23":
            pageTitle = "階段"; x1 = 136; x2 = 276;
            y1 = 172;
            y2 = 212;
            upperWall = function(){
               if(X<176){
                  link("rouka2");
               }else if(228<X){
                  link("rouka3");
               }
            }
         break;

         case "rouka3":
            pageTitle = "廊下"; x1 = 228; x2 = 276;
            y1 = 12;
            y2 = 172;
            leftWall = function(){
               if(52<Y && Y<92){
                  link("riko");
               }else if(92<Y && Y<132){
                  link("su");
               }
            }
            rightWall = function(){
               if(52<Y && Y<92){
                  link("kazukita");
               }else if(92<Y && Y<132){
                  link("dorei");
               }
            }
            bottomWall = function(){
               link("kaidan23");
            }
         break;

         case "riko":
            pageTitle = "りこ部屋"; x1 = -44; x2 = 228;
            y1 = 12;
            y2 = 92;
            rightWall = function(){
               if(52<Y) link("rouka3");
            }
         break;

         case "su":
            pageTitle = "すー部屋"; x1 = -44; x2 = 228;
            y1 = 92;
            y2 = 172;
            rightWall = function(){
               if(Y<132) link("rouka3");
            }
         break;

         case "kazukita":
            pageTitle = "カズキタ邸"; x1 = 276; x2 = 516;
            y1 = 12;
            y2 = 92;
            leftWall = function(){
               if(52<Y) link("rouka3");
            }
            extraHTML = '<img src="images/shunin.PNG" style="width:75vmin; right:0; top:60%; z-index:2147483647;">';
         break;

         case "dorei":
            pageTitle = "奴隷部屋"; x1 = 276; x2 = 516;
            y1 = 92;
            y2 = 172;
            leftWall = function(){
               if(Y<132) link("rouka3");
            }
         break;
      }
   }

});