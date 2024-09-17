あなたは優秀なプログラマです。
私はLinux上で、node.jsでプログラミングしている。

data/source/json/kanajo_*json の最新のファイルを読み込む。「JSON（抜粋）」を参照。
「images」の値が、「https://kanajo.com/public/thread/img/?id=*&type=comment&no=*」のパターンの時は、以下の処理をする。
例）
"https://kanajo.com/public/thread/img/?id=9320735&type=comment&no=1"

リンク先のページで画像が表示されている。
例）
<img width="80%" src="http://kanajo.com/public/assets/img/bbs/00000001/ed938cfe9d93fd22fd79ea23c443a5d9.jpg?1726547483" alt="" />   
この画像をファイルとして data/source/image/ に保存する。
ファイル名は、URL中のid（id=9320735の部分）とno（no=1の部分）を用いて「kanajo_{id}-{no}.拡張子」とする。
拡張子はMIMEを適切に判断して付ける。

画像を保存した「images」の値は、 data/source/image/ファイル名 に変更する。

JSONは、上書き保存する。
これらはバッチ処理で行うため不要な非同期処理は行わずシンプルに実装する。
全てのコードを示せ。


###JSON（抜粋）
  {
    "postTime": "2024-09-17(火) 12:18",
    "name": "りな",
    "email": "love33rlna@docomo.ne.jp",
    "images": [
      "https://kanajo.com/public/thread/img/?id=9320603&type=comment&no=1",
      "https://kanajo.com/public/thread/img/?id=9320603&type=comment&no=3"
    ],
    "message": "エッチしましょう場所アリで台東区にすんでます<br />黒肌のニューハーフです<br />技術は、エッチ好きなのでそれなりにあります<br /><br />希望: 即ｴｯﾁ希望",
    "sexuality": "ニューハーフ",
    "age": "35～44歳",
    "area": "台東区",
    "bodyShape": null,
    "source": "<a href=\"https://kanajo.com/public/thread/index?id=1\">カナジョ 即ヤリ東日本</a>"
  },


