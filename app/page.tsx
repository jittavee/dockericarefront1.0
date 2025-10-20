// client/app/page.tsx
'use client';

// --- 1. เพิ่ม Imports ที่จำเป็น ---
import { useEffect, useState } from 'react';
// import api from '@/lib/api';
import Image from 'next/image';
import axios from 'axios';

// --- Imports Components เดิมของคุณ ---
import Hero from "@/components/Hero";
// import About from "@/components/About";
import Resume from "@/components/Resume";
import HeroSlider from '@/components/HeroSlider';

// --- 2. สร้าง Type และ Component ย่อยสำหรับ Announcement ---
interface Announcement {
  id: string;
  title: string;
  content?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  type: 'NEWS' | 'ADVERTISEMENT';
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  //  const API_BASE_URL_WITHOUT_API = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');
  
   const imageSrc = announcement.imageUrl
    ? `${process.env.NEXT_PUBLIC_API_URL}${announcement.imageUrl}`
    : '/placeholder.png';

  const content = (
    <div className="relative w-full h-64 rounded-lg overflow-hidden group shadow-lg">
      <Image 
        src={imageSrc}
        alt={announcement.title}
        fill
        style={{ objectFit: 'cover' }}
        className="transition-transform duration-500 group-hover:scale-110"
        unoptimized={true}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block ${announcement.type === 'NEWS' ? 'bg-blue-500' : 'bg-green-500'}`}>
          {announcement.type === 'NEWS' ? 'ข่าวสาร' : 'โฆษณา'}
        </span>
        <h3 className="text-2xl font-bold leading-tight">{announcement.title}</h3>
        {announcement.content && <p className="text-sm mt-1 opacity-90 truncate">{announcement.content}</p>}
      </div>
    </div>
  );

  return announcement.linkUrl ? (
    <a href={announcement.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    <div className="block">{content}</div>
  );
}


export default function HomePage() {
  // --- 3. เพิ่ม State และ useEffect สำหรับดึงข้อมูล Announcements ---
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  
  useEffect(() => {
    // --- แก้ไขตรงนี้ ---
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined!");
      return;
    }

    // ใช้ axios ตรงๆ หรือ api instance ก็ได้ แต่ระบุ URL เต็ม
    // เพื่อให้แน่ใจว่าเราไม่ได้ใช้ baseURL ที่อาจจะผิดพลาด
    axios.get(`${API_URL}/api/announcements/public`)
      .then(res => setAnnouncements(res.data))
      .catch(err => console.error("Failed to fetch announcements", err));
    // -----------------
  }, []);

  return (
    // ใช้ <main> แทน <></> เพื่อ Semantic HTML ที่ดีกว่า
    <main>
      <HeroSlider />
      <Hero />
      <section className="py-5 px-4">
        {/* ... (ส่วน "ฟีเจอร์เด่นของเรา" เหมือนเดิม) ... */}
      </section>
      
      {/* --- 4. แทรก Section ของ Announcements ที่นี่ --- */}
      {/* จะแสดงผลก็ต่อเมื่อมีข้อมูล announcements เท่านั้น */}
      {announcements.length > 0 && (
        <section className="pt-0 pb-10 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
              News ข่าว & Promotions ติดโฆษณา
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {announcements.map(item => (
                <AnnouncementCard key={item.id} announcement={item} />
              ))}
            </div>
          </div>
        </section>
      )}
      {/* ------------------------------------------- */}

      <div className="py-5 bg-white">
        {/* ... (ส่วน "วิธีใช้งาน?" เหมือนเดิม) ... */}
      </div>
      <hr/>

      <Resume />
      {/* <About /> */}
    </main>
  );
}
