import Home from '@/components/home';
import { seo } from '@/constants';
import { fetchMetadata } from 'frames.js/next';
import { Metadata } from 'next';

export async function generateMetadata(){
  return{
    metadataBase: new URL(seo.url),
    title: {
      default: seo.title,
      template: `%s | ${seo.title}`,
    },
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
      url: seo.url,
      siteName: seo.title,
      locale: 'en_US',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      ...(await fetchMetadata(
        new URL(
          "/frames",
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000"
        )
      )),
    },
  } as Metadata
}

export default function Page(){
  return <Home />
}