import { useState } from 'react'
import Head from 'next/head'
import CarouselGenerator from '@/components/CarouselGenerator'

export default function Home() {
  return (
    <>
      <Head>
        <title>Instagram Carousel Generator</title>
        <meta name="description" content="Generate beautiful Instagram carousels with AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <CarouselGenerator />
      </main>
    </>
  )
}
