// myLibrary.js

// メイン機能を実装する関数
function processData(data) {
    // データ処理のロジックをここに実装
    return `Processed: ${data}`;
  }
  
  // ライブラリとして使用される場合のエクスポート
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
      processData: processData
    };
  }
  
  // スクリプトが直接実行された場合の処理
  if (require.main === module) {
    // コマンドライン引数を取得
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      console.log('使用方法: node myLibrary.js <data>');
    } else {
      const result = processData(args[0]);
      console.log(result);
    }
  }