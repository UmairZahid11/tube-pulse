import { BotMessageSquare, FileEdit, Gauge, HelpCircle, HomeIcon, Images, Lightbulb, Newspaper, QuoteIcon, ReceiptCent, ReceiptIcon, Search, ShieldCheck, User, Users2 } from "lucide-react";


export const userLinks = [
  { label: "Dashboard", href: "/user", icon: <HomeIcon /> },
  { label: "Thumbnail Genrator", href: "/user/thumbnail-generator", icon: <Images /> },
  { label: "Thumbnail Search", href: "/user/thumbnail-search", icon: <Search /> },
  // { label: "Keywords", href: "/user/keywords", icon: <WholeWord /> },
  { label: "Ai Careers", href: "/user/ai-careers", icon: <BotMessageSquare /> },
  { label: "Outlier", href: "/user/outlier", icon: <Gauge /> },
  { label: "Ai Content Generator", href: "/user/ai-content-generator", icon: <Lightbulb /> },
  { label: "Billing", href: "/user/billing", icon: <ReceiptIcon /> },
  { label: "Profile", href: "/user/profile", icon: <User /> },
];

export const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: <HomeIcon /> },
  { label: "Users", href: "/admin/users", icon: <Users2 /> },
  { label: "Plans", href: "/admin/plans", icon: <ReceiptCent /> },
  { label: "Blogs", href: "/admin/blogs", icon: <FileEdit /> },
  { label: "Testimonials", href: "/admin/testimonials", icon: <QuoteIcon /> },
  { label: "Policies", href: "/admin/policies", icon: <ShieldCheck /> },
  { label: "Newsletters", href: "/admin/newsletters", icon: <Newspaper /> },
  { label: "Inquiries", href: "/admin/inquiries", icon: <HelpCircle /> },
  { label: "Profile", href: "/admin/profile", icon: <User /> },

];