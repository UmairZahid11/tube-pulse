'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  content: string;
  image: string;
  created_at: string;
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/admin/blogs');
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="container relative">
          <div className="text-center max-w-[750px] mx-auto flex flex-col gap-[20px] items-center">
            <h1 data-aos="fade-up">Our Blogs</h1>
            <p data-aos="fade-up" className="!text-xl">Home / Blogs</p>
          </div>
        </div>
      </section>

      <section className="md:my-[100px] py-[50px]">
        <div className="container">
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <Loader2 className="animate-spin text-white w-8 h-8" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center text-white text-lg">No blogs found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.id}`} className='h-full'>
                  <div
                      className="p-[10px] md:p-[15px] lg:p-[25px] rounded-[10px] flex items-center gap-4  h-full bg-[#f7f1fc] blog-card"
                      data-aos="fade-up"
                      data-aos-delay="200"
                  >
                      <div className="overflow-hidden rounded-xl glare-img min-w-[170px] max-w-[170px] w-full min-h-[170px]">
                      <Image
                          src={blog.image || '/assets/imgs/default-img.png'}
                          width={1000}
                          height={1000}
                          className=" rounded-xl mb-4 min-w-[170px] max-w-[170px] w-full min-h-[170px] h-full object-cover"
                          alt={blog.title}
                      />
                      </div>
                      <div>
                          <h4 className="text-2xl text-white font-bold mb-4">{blog.title}</h4>
                          <p className='!text-[14px] line-clamp-3' dangerouslySetInnerHTML={{ __html: blog.content }}></p>
                          <p className='text-gray-500'>
                              {new Date(blog.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              })}
                          </p>
                      </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Blogs;
