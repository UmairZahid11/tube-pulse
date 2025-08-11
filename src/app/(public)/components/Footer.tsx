'use client';

import ContactForm from '@/components/contactForm';
import Newsletter from '@/components/newsletter';
import {
  Facebook,
  Instagram,
  X,
  Droplet
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [islogin, setIslogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setIslogin(true);
      if (session.user.isAdmin) {
        setIsAdmin(true);
      }
    }
  }, [session]);

  return (
    <div className="footer-main">
      <ContactForm/>
      <footer className="w-full text-white">
        <div className="mx-auto py-[50px] rounded-xl">

          {/* Grid Sections */}
          <div className="container grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-10 text-sm">
            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Get In Touch</h3>
              <p className="text-gray-400">hello@youraicompany.com</p>
              <p className="font-semibold text-white mt-1">+1 (800) 123-4567</p>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-semibold mb-4">Our Location</h3>
              <p className="text-gray-400">123 Innovation Street, Tech City,</p>
              <p className="text-gray-400">NY 10001, USA</p>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold mb-4">Social Media</h3>
              <div className="flex gap-3 mt-2">
                {[X, Facebook, Instagram].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#A234FD] hover:bg-[#A234FD] hover:text-white transition"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter + Links */}
            <div>
              <h3 className="font-semibold mb-4">Subscribe Newsletter's</h3>
              <div className="w-full">
                <Newsletter />
              </div>
              <ul className="flex flex-wrap gap-3 items-center mt-4">
                <li><Link href="/privacy-policy" className="text-white font-semibold text-sm hover:text-[#A234FD]">Privacy Policy</Link></li>
                <li><Link href="/terms-&-condition" className="text-white font-semibold text-sm hover:text-[#A234FD]">Term & Conditions</Link></li>
                <li><Link href="/refund-policy" className="text-white font-semibold text-sm hover:text-[#A234FD]">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-gray-300 pt-10 text-sm">
            <div className="container">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-gradiant rounded-full flex items-center justify-center">
                    <Droplet className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-semibold text-xl">Tubepulse.</span>
                </div>
                <p className="text-gray-400">Copyright © 2025 All Rights Reserved.</p>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Footer;
