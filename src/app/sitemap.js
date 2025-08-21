import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export default async function sitemap() {
  const baseUrl = 'https://sajidmehmoodtariq.me';

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      priority: 0.8,
    },
  ];

  // Dynamic blog routes
  let blogRoutes = [];
  try {
    await connectDB();
    const blogs = await Blog.find({ published: true })
      .select('slug updatedAt')
      .lean();

    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
      priority: 0.6,
    }));
  } catch (error) {
    console.error('❌ Sitemap error (blogs):', error);
  }

  return [...staticRoutes, ...blogRoutes];
}
