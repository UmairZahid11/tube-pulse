"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const images = [
  "/assets/imgs/slider-img1.webp",
  "/assets/imgs/slider-img2.webp",
  "/assets/imgs/slider-img3.webp",
  "/assets/imgs/slider-img4.webp",
  "/assets/imgs/slider-img5.webp",
  "/assets/imgs/slider-img6.webp",
  "/assets/imgs/slider-img1.webp",
  "/assets/imgs/slider-img2.webp",
  "/assets/imgs/slider-img3.webp",
  "/assets/imgs/slider-img4.webp",
  "/assets/imgs/slider-img5.webp",
  "/assets/imgs/slider-img6.webp",
  "/assets/imgs/slider-img1.webp",
  "/assets/imgs/slider-img2.webp",
];

export default function BannerSlider({ isAdmin, islogin }:any) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.3); // slower speed (was +1)
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex justify-center items-center mt-[400px]">
      {/* Rotating wrapper */}
      <div
        className="absolute flex justify-center items-center mb-[-80%] xl:mb-[-70%] 2xl:mb-[-60%] 3xl:mb-[-50%]"
        style={{
          transform: `rotate(${rotation}deg)`,
        //   transition: "transform 0.5s linear",
          transformOrigin: "center center",
        }}
      >
        {images.map((src, i) => {
          const angle = (i / images.length) * 360;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                // counter-rotate by wrapper's rotation so image stays upright
                transform: `rotate(${angle}deg) translate(900px) rotate(${
                  -angle - rotation
                }deg)`,
              }}
            >
              <div className="overflow-hidden rounded-2xl shadow-lg w-[280px] h-[340px]">
                <Image
                  src={src}
                  alt={`Slide ${i}`}
                  width={350}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Center content */}
      <div className="z-10 text-center flex justify-center items-center h-[500px] w-full banner-slider-main">
        <div className="flex gap-3 items-center flex-col p-4 max-w-[700px]">
          <h1 className="text-4xl font-bold">We’re Creative AI Design</h1>
          <p className="text-lg text-gray-600">
            Artificial Intelligence encompasses the creation of computer systems capable of executing tasks usually necessitating human intelligence
          </p>
          <Link href={islogin && !isAdmin ? "/user" : "/login"}>
              <button
                className="primary-btn  mt-[50px]"
                data-aos="zoom-in"
                data-aos-delay="1000"
              >
                <ArrowRight />
                Try us Today
              </button>
            </Link>
        </div>
      </div>
    </div>
  );
}
