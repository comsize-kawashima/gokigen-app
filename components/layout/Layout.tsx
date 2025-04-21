import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from '../navigation/Navbar';

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'ゴキゲンアプリ',
  description = 'あなたの一日をより良く管理するためのアプリ',
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50">{children}</main>

      </div>
    </>
  );
};

export default Layout; 