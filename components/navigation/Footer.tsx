import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ゴキゲンアプリ</h3>
            <p className="text-gray-300 text-sm">
              あなたの日々をより充実したものにするためのスケジュール管理アプリです。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">リンク</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition">
                  サービスについて
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">お問い合わせ</h3>
            <address className="not-italic text-gray-300 text-sm">
              <p>〒100-0001</p>
              <p>東京都千代田区1-1-1</p>
              <p>メール: info@gokigen-app.com</p>
              <p>電話: 03-1234-5678</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} ゴキゲンアプリ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 