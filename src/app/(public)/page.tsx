'use client'
import { ArrowRight, ArrowUpRight, Bot, Calendar1Icon, PhoneIcon, Video } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image";
import Link from "next/link";
import TestimonialSection from "./components/Testimonial-section";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BlogSection from "./components/blog-section";
import { faqs } from "@/constants/faq";
import BannerSlider from "./components/banner-slider";
import PricingSection from "./components/pricing-section";
import SvgDotAnimation from './components/line-dots-animation'


export default function Home() {
  const [islogin, setIslogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: session} = useSession();
  
  useEffect(()=>{
    if(session){
      setIslogin(true)
      if(session.user.isAdmin){
        setIsAdmin(true)
      }
    }
  }, [session])
  

  return (
    <>
      <section className="hero-section overflow-hidden !pb-0">
        <div className="container relative">
          <div className="absolute z-0 left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%]">          
            <SvgDotAnimation/>
          </div>

          <div
            className="text-center max-w-[750px] mx-auto flex flex-col gap-[20px] items-center"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <h1 data-aos="fade-up" data-aos-delay="800">
              AI-Driven Solutions for a Smarter Tomorrow
            </h1>
            <Link href={islogin && !isAdmin ? "/user" : "/login"}>
              <button
                className="primary-btn  mt-[50px]"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <ArrowRight />
                Get Started
              </button>
            </Link>
          </div>
        </div>
        <BannerSlider islogin={islogin} isAdmin={isAdmin} />
      </section>
      {/* <section className="md:mb-[100px] mb-[50px] md:block hidden">
        <div className="container">
          <div className="grid md:grid-cols-3  justify-center w-full md:px-[50px] lg-gap-0 gap-3">
            <div className="md:mr-[-50px] w-full" data-aos="fade-left" data-aos-delay="200">
                <Image src={'/assets/imgs/admin-dashboard-img.png'} width={1000}  height={1000} className="w-full h-full rounded-lg md:-rotate-[10deg] hover:shadow-2xl shadow-[#386bb735] transition-all duration-200 ease-in-out cursor-pointer md:min-h-[400px] object-cover object-left border border-border" alt="img"></Image>
            </div>
            <div className="relative z-[9] md:scale-110 md:mb-[50px] w-full" data-aos="zoom-in">
                <Image src={'/assets/imgs/user-dashboard-img.png'} width={1000}  height={1000} className="w-full h-full rounded-lg hover:shadow-2xl shadow-[#386bb735] transition-all duration-200 ease-in-out cursor-pointer md:min-h-[400px] object-cover object-left border border-border" alt="img"></Image>
            </div>
            <div className="md:ml-[-50px] w-full" data-aos="fade-right" data-aos-delay="200">
                <Image src={'/assets/imgs/meeting-ss-img.png'} width={1000}  height={1000} className="w-full h-full rounded-lg md:rotate-[10deg] hover:shadow-2xl shadow-[#386bb735] transition-all duration-200 ease-in-out cursor-pointer md:min-h-[400px] object-cover object-left border border-border" alt="img"></Image>
            </div>
          </div>
        </div>
        <div>

        </div>
      </section>
      <section className="md:mt-[100px] mt-[50px]" id="about">
        <div className="container">
          <div className="grid grid-cols-10 gap-10">
            <div className="col-span-full lg:col-span-3" data-aos="fade-right">
              <div className="glare-img">
                <Image src={'/assets/imgs/about-us.jpg'} width={1000} height={1000} className="w-full h-full rounded-xl aspect-[9/16] max-h-[450px] object-cover" alt="img"></Image>
              </div>
            </div>
            <div className="col-span-full lg:col-span-7">
              <h4 data-aos="fade-down" className="small-heading !mx-0 !mb-5">ABout Us</h4>
              <h2 data-aos="zoom-in">We use smart AI and human thinking to help businesses grow, work better, and fix problems easily. It’s not just about technology  it’s about making a real difference with clear, helpful ideas.</h2>
              <div className="flex gap-5 items-center mt-[50px]">
                <button className="w-[100px] h-[100px] -rotate-45 hover:rotate-0 transition-all duration-300 ease-in-out p-[15px]" data-aos="fade-right" data-aos-delay="100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="82" height="82" viewBox="0 0 82 82" fill="none"><g clipPath="url(#clip0_1181_21)"><path d="M81.014 41.014L43.9568 78.0713L37.6288 71.7432L63.9438 45.4282L1.69582 45.2535L1.67076 36.3292L63.9187 36.504L37.4556 10.0408L43.7482 3.74819L81.014 41.014Z" stroke="url(#paint0_linear_1181_21)"></path></g><defs><linearGradient id="paint0_linear_1181_21" x1="17.6675" y1="19.5589" x2="60.3419" y2="62.2333" gradientUnits="userSpaceOnUse"><stop stopColor="#386BB7"></stop><stop offset="1" stopColor="#E24C4A"></stop></linearGradient><clipPath id="clip0_1181_21"><rect width="82" height="82" fill="white"></rect></clipPath></defs></svg>
                </button>
                <p data-aos="fade-left" data-aos-delay="150">At Meetai, we blend advanced AI technology with real human understanding to create smart solutions that truly make a difference. We're not just building tools  we're transforming how businesses connect, grow, and thrive. With innovation at our core and purpose in every line of code, we help you work smarter, not harder.</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section className="" id="feature">
        <div className="md:py-[100px] py-[50px]">
          <div className="container">
            <div className="mb-10 flex justify-between items-center">
              {/* <h4 data-aos="fade-down" className="small-heading">Features</h4> */}
              <h2 data-aos="fade-up" className="!text-white">
                Services we offer
              </h2>
              <button className="primary-btn">
                <ArrowRight />
                More Services
              </button>
            </div>
            <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-5">
              <Link href={islogin && !isAdmin ? "/user" : "/login"}>
                <div
                  className="services-card xl:p-[43px]  md:p-[30px] p-[20px] border border-gray-800 rounded-2xl"
                  data-aos="fade-right"
                  data-aos-delay="100"
                >
                  <div className="feature-image">
                    <img src="/assets/imgs/service-img1.webp" alt="" />
                  </div>
                  <div className="relative z-10">
                    {/* <BotMessageSquare className="lg:mb-[130px] md:mb-[100px] sm:mb-[70px] mb-[50px] w-10 h-10 md:w-16 md:h-16 text-white" /> */}
                    <div className="flex justify-between items-center">
                      <h4 className="text-2xl !text-white mb-4 font-bold">
                        AI-Powered Meetings
                      </h4>
                      <button className="primary-btn not-svg">
                        <ArrowUpRight />
                      </button>
                    </div>
                    <p className="!text-white">
                      Your personal AI Agent joins every call to guide, listen,
                      and assist — just like a real teammate.
                    </p>
                  </div>
                </div>
              </Link>
              <Link href={islogin && !isAdmin ? "/user" : "/login"}>
                <div
                  className="services-card xl:p-[43px]  md:p-[30px] p-[20px] border border-gray-800 rounded-2xl"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="feature-image">
                    <img src="/assets/imgs/service-img1.webp" alt="" />
                  </div>
                  <div className="relative z-10">
                    {/* <Calendar1Icon className="lg:mb-[130px] md:mb-[100px] sm:mb-[70px] mb-[50px] w-10 h-10 md:w-16 md:h-16 text-white" /> */}
                    <div className="flex justify-between items-center">
                      <h4 className="text-2xl !text-white mb-4 font-bold">
                        Seamless Scheduling
                      </h4>
                      <button className="primary-btn not-svg">
                        <ArrowUpRight />
                      </button>
                    </div>
                    <p className="!text-white">
                      Connect with Google Calendar to book meetings effortlessly
                      and never miss a call.
                    </p>
                  </div>
                </div>
              </Link>
              <Link href={islogin && !isAdmin ? "/user" : "/login"}>
                <div
                  className="services-card xl:p-[43px]  md:p-[30px] p-[20px] border border-gray-800 rounded-2xl"
                  data-aos="fade-down"
                  data-aos-delay="300"
                >
                  <div className="feature-image">
                    <img src="/assets/imgs/service-img1.webp" alt="" />
                  </div>
                  <div className="relative z-10">
                    {/* <NotebookPen className="lg:mb-[130px] md:mb-[100px] sm:mb-[70px] mb-[50px] w-10 h-10 md:w-16 md:h-16 text-white" /> */}
                    <div className="flex justify-between items-center">
                      <h4 className="text-2xl !text-white mb-4 font-bold">
                        Smart Notes & Summaries
                      </h4>
                      <button className="primary-btn not-svg">
                        <ArrowUpRight />
                      </button>
                    </div>
                    <p className="!text-white">
                      No need to write things down — your AI captures key points
                      and delivers clear summaries instantly.
                    </p>
                  </div>
                </div>
              </Link>
              <Link href={islogin && !isAdmin ? "/user" : "/login"}>
                <div
                  className="services-card xl:p-[43px]  md:p-[30px] p-[20px] border border-gray-800 rounded-2xl"
                  data-aos="fade-left"
                  data-aos-delay="400"
                >
                  <div className="feature-image">
                    <img src="/assets/imgs/service-img1.webp" alt="" />
                  </div>
                  <div className="relative z-10">
                    {/* <BarChart className="lg:mb-[130px] md:mb-[100px] sm:mb-[70px] mb-[50px] w-10 h-10 md:w-16 md:h-16 text-white" /> */}
                    <div className="flex justify-between items-center">
                      <h4 className="text-2xl !text-white mb-4 font-bold">
                        All-in-One Dashboard
                      </h4>
                      <button className="primary-btn not-svg">
                        <ArrowUpRight />
                      </button>
                    </div>
                    <p className="!text-white">
                      Access recordings, notes, and insights from every meeting
                      — all in one simple, organized space.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="md:py-[100px] py-[50px] my-[100px] mx-auto">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 data-aos="fade-up">Our WorkFlow</h2>
            </div>
            <div className="grid lg:grid-cols-9 gap-2">
              <div
                data-aos="fade-left"
                className="col-span-4"
                data-aos-delay="500"
              >
                <div className="glare-img h-full max-w-[550px] mx-auto">
                  <Image
                    src={"/assets/imgs/how-it-works.jpg"}
                    width={1000}
                    height={1000}
                    className="w-full h-full rounded-xl object-center mx-auto aspect-[16/9] object-cover"
                    alt="img"
                  />
                </div>
              </div>
              <div className="h-full relative">
                <img
                  src="/assets/imgs/seed-of-life.png"
                  className="text-primary sticky top-[130px] left-0 slow-animte-spin"
                  alt=""
                />
              </div>
              <div className="flex flex-col gap-5 col-span-4">
                <div
                  className="flex gap-3 group cursor-pointer"
                  data-aos="fade-right"
                  data-aos-delay="100"
                >
                  <div className="max-w-14 max-h-14 min-h-14 min-w-14 flex justify-center items-center transition-all duration-300 ease-in-out rounded-full text-[#A234FD] group-hover:!text-white group-hover:bg-[#A234FD]">
                    <Bot />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3">
                      1. Set Up Your AI Agent
                    </h4>
                    <p>
                      {" "}
                      Quickly create and customize your AI Agent to handle
                      meetings and assist you during calls.
                    </p>
                  </div>
                </div>
                <div
                  className="flex gap-3 group cursor-pointer"
                  data-aos="fade-right"
                  data-aos-delay="200"
                >
                  <div className="max-w-14 max-h-14 min-h-14 min-w-14 flex justify-center items-center transition-all duration-300 ease-in-out rounded-full text-[#A234FD] group-hover:!text-white group-hover:bg-[#A234FD]">
                    <Calendar1Icon />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3">
                      2. Schedule a Meeting
                    </h4>
                    <p>
                      Pick a date and time using Google Calendar. Your Agent and
                      the guest get auto-invites — easy and smooth.
                    </p>
                  </div>
                </div>
                <div
                  className="flex gap-3 group cursor-pointer"
                  data-aos="fade-right"
                  data-aos-delay="300"
                >
                  <div className="max-w-14 max-h-14 min-h-14 min-w-14 flex justify-center items-center transition-all duration-300 ease-in-out rounded-full text-[#A234FD] group-hover:!text-white group-hover:bg-[#A234FD]">
                    <PhoneIcon />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3">
                      3. Join the Call
                    </h4>
                    <p>
                      {" "}
                      Connect via a secure Stream video link. Talk naturally
                      while your AI listens and takes smart notes.
                    </p>
                  </div>
                </div>
                <div
                  className="flex gap-3 group cursor-pointer"
                  data-aos="fade-right"
                  data-aos-delay="400"
                >
                  <div className="max-w-14 max-h-14 min-h-14 min-w-14 flex justify-center items-center transition-all duration-300 ease-in-out rounded-full text-[#A234FD] group-hover:!text-white group-hover:bg-[#A234FD]">
                    <Video />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3">
                      4. Get Summary & Recording
                    </h4>
                    <p>
                      Right after the call, get a full video, AI-generated
                      notes, and a clear summary — all in your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialSection />

      <PricingSection/>

      <section className="md:py-[100px] py-[50px] text-white faq-main relative overflow-hidden">
        <div className="absolute z-0 top-[100px] right-[-300px] rotate-120">          
            <SvgDotAnimation/>
        </div>
        <div className="absolute z-0 top-[200px] right-[-300px] rotate-220">          
            <SvgDotAnimation/>
        </div>
        <div className="container">
          <div className="text-center mb-10">
            <h4 data-aos="fade-down" className="small-heading">
              FAQ's
            </h4>
            <h2 data-aos="fade-up">
              Frequently asked questions <br /> about our AI services
            </h2>
          </div>
          <Accordion type="single" collapsible defaultValue="item-1">
            <div className="grid md:grid-cols-1 gap-5 max-w-[1100px] mx-auto">
              {faqs.map((elem, index) => {
                return (
                  <AccordionItem
                    key={index}
                    value={`items-${index + 1}`}
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
                  >
                    <AccordionTrigger>{elem.question}</AccordionTrigger>
                    <AccordionContent>{elem.answer}</AccordionContent>
                  </AccordionItem>
                );
              })}
            </div>
          </Accordion>
        </div>
      </section>

      <BlogSection />
    </>
  );
}
