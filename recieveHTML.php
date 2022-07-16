<?php

$json = json_decode(file_get_contents("php://input"), true);


//-------------------------------------------------
// セキュリティ
//-------------------------------------------------

if(!$json['password'] || !$json['type'] || !$json['place']){
   sendResult(false, '「…なんか変なことした？」');
   exit(1);
}

if(hash('sha3-384', $json["password"]) != '72dc5284a56ad500a1c202a745d4f31b4a1f703a4ffadddba5ec98a903edfeb9b0028e12ea3245d975ae74794d5cd4f4'){
   sendResult(false, '「…なんか変なことした？」');
   exit(1);
}

switch($json['type']){

   case 'text':
      if($json["fontFamily"] && $json["textAlign"] && $json["fontSize"] && $json["color"] && trim($json['content']) && $json["left"] && $json["top"]){
         $content = str_replace("\n", "<br>", htmlspecialchars( trim( $json['content'] ) ) );
         $elm = '<p style="font-family:'.$json["fontFamily"].'; text-align:'.$json["textAlign"].'; font-size:'.$json["fontSize"].'vmin; color:'.$json["color"].'; left:'.$json["left"].'vmin; top:'.$json["top"].'vmin;">'.$content.'</p>';
      }
   break;

   case 'image':
      if($json["src"] && $json["left"] && $json["top"] && $json["width"] && $json["blendMode"]){
         if($json["tell"]){
            $json["tell"] = "'".str_replace("\n", " ", htmlspecialchars( $json["tell"] ) )."'";
         }else{
            $json["tell"] = "'……'";
         }
         $elm = '<img src="'.$json["src"].'" style="left:'.$json["left"].'vmin; top:'.$json["top"].'vmin; width:'.$json["width"].'vmin; mix-blend-mode:'.$json["blendMode"].';" onclick="tell('.$json["tell"].')">';
      }
   break;

   case 'url':
      if($json["content"] && $json["left"] && $json["top"] && $json["backgroundColor"] && $json["title"] && $json["url"]){
         $elm = '<a href="'.$json["content"].'" target="blank" rel="noopener noreferrer" style="display:block; padding:2vmin; border-radius:3vmin; font-family:Noto Sans JP; text-decoration:none; background-color:'.$json["backgroundColor"].'; left:'.$json["left"].'vmin; top:'.$json["top"].'vmin;"><p style="display:flex; justify-content:flex-start; color:white; font-size:2vmin; margin:0 0 1vmin 0"><image src="./images/link.svg" style="height:3vmin">'.$json["title"].'</p><p style="color:#fff8; font-size:1.5vmin; margin:0;">'.$json["url"].'</p></a>';
      }
   break;

   case 'html':
      if($json["content"] && $json["left"] && $json["top"]){
         if(strpos($json["content"], '<script') === false){
            $elm = '<article style="left:'.$json["left"].'vmin; top:'.$json["top"].'vmin;">'.$json['content'].'</article>';
         }
      }
   break;

   default:
   break;
}

if(!$elm){
   sendResult(false, '「…なんか変なことした？」');
   exit(1);
}


//-------------------------------------------------
// サーバへ保存
//-------------------------------------------------

$filename = './htmls/'.$json['place'].'.html';
$result = file_put_contents($filename, "\n".$elm, FILE_APPEND | LOCK_EX);


//-------------------------------------------------
// 結果を返却
//-------------------------------------------------

if( $result !== false ){
   sendResult(true, '「あーい。」');
}else{ // 書き込みエラー
   sendResult(false, '「…あれ？ちょっもう一回やってみて。」');
}

/**
 * 結果をJSON形式で返却
*
* @param  boolean $status 成功:true, 失敗:false
* @param  mixed   $data   ブラウザに返却するデータ
* @return void
*/
function sendResult($status, $data){
   // CORS (必要に応じて指定)
   header('Access-Control-Allow-Origin: *');
   header('Access-Control-Allow-Headers: *');

   header('Content-type: application/json');
   echo json_encode([
   "status" => $status,
   "result" => $data
   ]);
}

?>