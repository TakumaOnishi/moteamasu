<?php

//-------------------------------------------------
// セキュリティ
//-------------------------------------------------

//必要なデータがあるか
if(!$_POST["place"] || !$_POST["password"] || !$_FILES['image']){
  sendResult(false, '「…なんか変なことした？」');
  exit(1);
}

//合言葉のログは正しいか
if(hash('sha3-384', $_POST["password"]) != '72dc5284a56ad500a1c202a745d4f31b4a1f703a4ffadddba5ec98a903edfeb9b0028e12ea3245d975ae74794d5cd4f4'){
  sendResult(false, '「…なんか変なことした？」');
  exit(1);
}

// ファイルが渡されているか
if( ! isset($_FILES['image']) ){
  sendResult(false, '「…なんか変なことした？」');
  exit(1);
}
// 何らかのエラーが発生しているか
if( (isset($_FILES['image']['error'])) && ($_FILES['image']['error'] !== UPLOAD_ERR_OK) ){
  //sendResult(false, 'Exception ' . ERROR_MSG[$_FILES['image']['error']]);
  sendResult(false, '「…なんか変なことした？」');
  exit(1);
}
// アップロードされたファイルを指しているか (not /etc/passwd...)
if( ! is_uploaded_file( $_FILES['image']['tmp_name'] ) ){
  sendResult(false, '「…なんか変なことした？」');
  exit(1);
}
// ファイルサイズが1MB以下か（画像は最大でも800px四方にリサイズされているはず）
if( $_FILES['image']['size'] > (1024 * 1024) ){
  sendResult(false, "「…なんか変なことした？」");
  exit(1);
}
// MIME TYPEが画像形式か(JPEG,PNG)
$mime = getMimeType( $_FILES['image']['tmp_name']);  // 画像形式を取得
if( getMimeType( $_FILES['image']['tmp_name']) === null ){
  sendResult(false, '「…なんか変なことした？」');
  exit(1);
}


//-------------------------------------------------
// サーバへ保存
//-------------------------------------------------

$filepath = './images/'.$_POST["place"].'/'.uniqid().'.'.$mime; // UnixTimeからファイル名を作成
$result = move_uploaded_file($_FILES['image']['tmp_name'], $filepath); // 一時ディレクトリから移動


//-------------------------------------------------
// 結果を返却
//-------------------------------------------------

if( $result !== false ){
  sendResult(true, $filepath);
}
else{
  // 書き込みエラー
  sendResult(false, '「…あれ？ちょっもう一回やってみて。」');
}

/**
 * 結果をJSON形式で返却
 *
 * @param  boolean $status 成功:true, 失敗:false
 * @param  mixed   $result   ブラウザに返却するデータ
 * @return void
 */
function sendResult($status, $result){
  // CORS (必要に応じて指定)
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: *');

  header('Content-type: application/json');
  echo json_encode([
    "status" => $status,
    "result" => $result
  ]);
}

/**
 * 画像のファイル形式を返却する
 *
 * @param string $path 対象ファイルのパス
 * @return mixed
 */
function getMimeType($path){
  list($width, $height, $mime, $attr) = getimagesize($path);
  switch($mime){
    case IMAGETYPE_JPEG:
      return('jpeg');
    case IMAGETYPE_PNG:
      return('png');
    // case IMAGETYPE_SVG:
    //   return('svg');
      return(null);
  }
}