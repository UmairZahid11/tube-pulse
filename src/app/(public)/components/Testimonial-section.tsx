'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Testimonial {
  id: number;
  rating: number;
  text: string;
  author: string;
  title: string;
  avatar: string;
}

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [laoding, setlaoding] = useState(false);

  useEffect(() => {
    setlaoding(true);
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/admin/testimonials');
        const data = await res.json();
        const formatted = data.map((item: any) => ({
          id: item.id,
          rating: item.rating,
          text: item.description,
          author: item.name,
          title: item.position,
          avatar: item.image || '/assets/imgs/default-avatar.jpg', // fallback if no image
        }));
        setTestimonials(formatted);
        setlaoding(false);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setlaoding(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="my-[100px] testimonial-main">
      <div className="py-[100px] relative overflow-hidden">
        <div className="">
          <div className="">
            <div className="text-center mb-10">
              <h2 className="mb-8" data-aos="fade-up" data-aos-delay="100">
                Client share their experience with our AI
              </h2>
            </div>

            <div className="relative" data-aos="zoom-in" data-aos-delay="100">
              <div>
                {
                  laoding ?
                  <Loader2  className='text-primary animate-spin py-4'/>
                  :
                  <>
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      spaceBetween={24}
                      slidesPerView={2.5}
                      centeredSlides={true}
                      loop={true}
                      autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                      }}
                      pagination={{
                        clickable: true,
                        el: '.swiper-pagination',
                      }}
                      navigation={{
                        prevEl: '.swiper-button-prev',
                        nextEl: '.swiper-button-next',
                      }}
                      breakpoints={{
                        768: { slidesPerView: 1.5 },
                        992: { slidesPerView: 2 },
                      }}
                      className="mySwiper"
                    >
                      {testimonials.map((testimonial) => (
                        <SwiperSlide key={testimonial.id} className='h-full'>
                          <div className="flex flex-col justify-between">
                            <div className='flex justify-center items-center flex-col gap-3'>
                              <img className="w-20 h-20 border border-white rounded-full mr-4" src={testimonial.avatar} alt={testimonial.author} />
                              <div className='flex gap-3 items-center'>
                                <p className="font-semibold !text-xl capitalize">{testimonial.author}</p>
                                <p>/</p>
                                <p className="!text-xl">{testimonial.title}</p>
                              </div>
                            </div>
                            <div className="flex text-black my-4 justify-center">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.908-7.416 3.908 1.48-8.279-6.064-5.828 8.332-1.151z" />
                                  </svg>
                              ))}
                              {[...Array(5 - testimonial.rating)].map((_, i) => (
                                  <svg key={i} className="w-5 h-5 fill-none stroke-1 stroke-white" viewBox="0 0 24 24">
                                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.908-7.416 3.908 1.48-8.279-6.064-5.828 8.332-1.151z" />
                                  </svg>
                              ))}
                            </div>
                            <div className='text-center'>
                              <h3>
                              {testimonial.text.split(" ").slice(0, 5).join(" ")}...

                              </h3>
                              <p className="text-gray-300 pt-3 line-clamp-4 text-center">
                                {testimonial.text}
                              </p>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div className="flex justify-between !mt-8 gap-4 items-center max-w-[700px] mx-auto">
                      <div className='bg-primary rounded-md py-1 px-2 text-sm font-semibold text-white'>Testimonials</div>   
                      <div className="swiper-pagination"></div>                        
                      <div className="flex justify-center gap-5">
                        <button className="swiper-button-prev p-3 rounded-full text-white hover:bg-opacity-20 transition">
                          <ArrowLeft />
                        </button>
                        <button className="swiper-button-next p-3 rounded-full text-white hover:bg-opacity-20 transition">
                          <ArrowRight />
                        </button>
                      </div>
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
