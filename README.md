デモ：http://moteamasu.jp/<br>
<br>
アップロードに関連するファイル：<br>
・script.js<br>
・checkPassword.php<br>
・recieveImage.php<br>
・receiveHTML.php<br>
<br>
アップロード処理のおおまかな流れ：<br>
【住民認証】<br>
・モテアマスの間取りを再現したページ間をスクロールで移動し、3Fのカズキタ部屋に行く<br>
・カズキタさんをクリックして話しかけ、合言葉を入力<br>
・jsがcheckPassword.phpに合言葉をpostし、php内でハッシュして正解のハッシュ値と照合<br>
・合っていればアップロードボタンを見えるようにする、同時にlocal storageに生の合言葉を保存<br>
【アップロード】<br>
・好きな部屋に移動してボタンをクリックし、会話形式でコンテンツとその見た目を設定する<br>
・アップロードできるコンテンツは文字、リンク、HTML、画像の4種類<br>
・文字入力をhttpで始めるとリンクボタンに、<で始めて>で終えるとHTMLに整形される<br>
・最終確認を押すと、jsがcheckPassword.phpに各パラメータをjsonでpost<br>
・それをreceiveHTML.phpで受け取り、各種エスケープを施し、1行のHTML要素に整形し、htmls > 部屋名.htmlに追記<br>
・このときlocal storageの合言葉もjsonに含めてpostし、再度checkPasswordする（ハック対策）<br>
【画像アップロード】<br>
・画像をアップロードする際は上記処理の直前にファイルの送信を挟む<br>
・jsで画像サイズを最大800*800pxに圧縮し、FormDataでpost<br>
・それをrecieveImage.phpで受け取り、images > 部屋名フォルダに保存、完了したらパスを返す<br>
・それを含めたjsonをreceiveHTML.phpに送る<br>
<br>
アップロード制限突破の方法：<br>
・local storageの「userID」を消す。これはただの日付<br>
