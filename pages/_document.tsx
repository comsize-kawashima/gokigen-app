import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    // HTML ドキュメントのルート要素
    <Html lang="ja">
      <Head>
        {/* Google Fonts の事前接続設定 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Nico Moji フォントを読み込むリンク */}
        <link
          href="https://fonts.googleapis.com/earlyaccess/nicomoji.css"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        {/* ページのメインコンテンツを表示 */}
        <Main />
        {/* Next.js のスクリプトを挿入 */}
        <NextScript />
      </body>
    </Html>
  );
}
