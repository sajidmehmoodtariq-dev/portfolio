import { cookies } from 'next/headers';
import BlogPost from './BlogPost';

// Dynamic metadata for SEO
export async function generateMetadata({ params }) {
  // SSR fetch for the blog post
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${params.slug}`, {
    headers: { Cookie: cookies().toString() },
    cache: 'no-store',
  });
  if (!res.ok) {
    return {
      title: 'Blog Not Found | Sajid Mehmood Tariq',
      description: 'This blog post could not be found.'
    };
  }
  const data = await res.json();
  const blog = data?.data?.blog;
  if (!blog) {
    return {
      title: 'Blog Not Found | Sajid Mehmood Tariq',
      description: 'This blog post could not be found.'
    };
  }
  return {
    title: `${blog.title} | Sajid Mehmood Tariq`,
    description: blog.excerpt || blog.title,
    openGraph: {
      title: `${blog.title} | Sajid Mehmood Tariq`,
      description: blog.excerpt || blog.title,
      images: blog.imageUrl ? [blog.imageUrl] : ['/logo.png'],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${blog.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${blog.title} | Sajid Mehmood Tariq`,
      description: blog.excerpt || blog.title,
      images: blog.imageUrl ? [blog.imageUrl] : ['/logo.png'],
    },
  };
}

export default function Page({ params }) {
  return <BlogPost params={params} />;
}
