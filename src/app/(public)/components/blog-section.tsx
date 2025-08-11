'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2, Star } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  content: string;
  image: string;
  created_at: string;
}

const BlogSection = () => {

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchBlogs = async () => {
        try {
        const res = await fetch('/api/admin/blogs/limit/3');
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
     <section className="my-[100px]">
        <div className="container">
            <div className="grid lg:grid-cols-2 gap-3 relative overflow-visible">
                <div className="flex flex-col gap-4 sticky top-[130px] left-0 h-fit">
                    <h2 data-aos="fade-up" data-aos-delay="100">Latest Blog</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi tempora fugiat aliquam reiciendis odit exercitationem in sint, doloribus laboriosam velit.</p>
                    <Link href={'/blogs'}>
                        <button className="primary-btn w-fit">
                            <ArrowRight/>
                            More BLogs
                        </button>
                    </Link>
                    <div className="flex gap-3 items-center">
                        <div className="flex">
                            <img src="/assets/imgs/author-2.jpg" alt=""  className='w-16 h-16 rounded-full border border-white ml-[-15px]'/>
                            <img src="/assets/imgs/author-2.jpg" alt=""  className='w-16 h-16 rounded-full border border-white ml-[-15px]'/>
                            <img src="/assets/imgs/author-2.jpg" alt=""  className='w-16 h-16 rounded-full border border-white ml-[-15px]'/>
                            <img src="/assets/imgs/author-2.jpg" alt=""  className='w-16 h-16 rounded-full border border-white ml-[-15px]'/>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <Star size={30} className='text-yellow-400'/>
                                <Star size={30} className='text-yellow-400'/>
                                <Star size={30} className='text-yellow-400'/>
                                <Star size={30} className='text-yellow-400'/>
                                <Star size={30} className='text-yellow-400'/>
                            </div>
                            <p>Trusted by 20k Clients</p>
                        </div>
                    </div>
                </div>
                <div className="">
                {loading ? (
                    <div className="flex justify-center items-center h-[200px]">
                    <Loader2 className="animate-spin text-white w-8 h-8" />
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center text-white text-lg">No blogs found.</div>
                ) : (
                    <div className="flex flex-col gap-7">
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
            </div>
        </div>
      </section> 
    </>
  )
}

export default BlogSection
