import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="bg-blue-400 p-6 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-6xl font-bold text-white drop-shadow-lg"
          style={{ fontFamily: "Nico Moji, sans-serif" }}
        >
          <Link href="/">ゴキゲンナビ</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <>
              <Link
                href="/login"
                className="text-lg bg-white text-gray-900 py-3 px-4 rounded-md font-medium shadow-lg hover:bg-gray-100 transition duration-300"
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                className="text-lg bg-white text-gray-900 py-3 px-4 rounded-md font-medium shadow-lg hover:bg-gray-100 transition duration-300"
              >
                サインアップ
              </Link>
            </>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
