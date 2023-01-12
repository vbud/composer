import React from 'react';
import Head from 'next/head';

import Composer from 'src/Composer';

export default function Home() {
  return (
    <>
      <Head>
        <title>composer</title>
        <meta name="description" content="Design + engineering = ❤️" />
      </Head>

      <Composer />
    </>
  );
}
