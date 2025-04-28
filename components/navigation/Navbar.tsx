import Link from "next/link";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <header className="bg-emerald-500 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg"
          style={{ fontFamily: "'Nico Moji', sans-serif" }}
        >
          <Link href="/" onClick={() => window.location.reload()}>
            ゴキゲンアプリ
          </Link>
        </h1>
        <nav>
          <ul className="flex space-x-2 md:space-x-4">
            <li>
              <Link
                href="/login"
                className="text-sm md:text-base bg-white text-emerald-600 py-2 px-3 rounded-md font-medium shadow-lg hover:bg-gray-100 transition duration-300"
              >
                ログイン
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="text-sm md:text-base bg-white text-emerald-600 py-2 px-3 rounded-md font-medium shadow-lg hover:bg-gray-100 transition duration-300"
              >
                サインアップ
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
