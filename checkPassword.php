<?php

$json = json_decode(file_get_contents("php://input"), true);


//-------------------------------------------------
// 結果を返却
//-------------------------------------------------

if(!$json['password']){
   sendResult(false, '「…なんか変なことした？」');
}else if(hash('sha3-384', $json['password']) == '72dc5284a56ad500a1c202a745d4f31b4a1f703a4ffadddba5ec98a903edfeb9b0028e12ea3245d975ae74794d5cd4f4'){
   sendResult(true, '「おかえり。好きな部屋でボタン押して。」');
}else{
   sendResult(false, '「違うよ。」');
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