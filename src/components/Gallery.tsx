import React from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';

// To add your own images:
// 1. Place your image files in the public folder (e.g., /public/images/)
// 2. Update the images array below with your image paths and titles
// 3. Use paths like: '/images/your-image.jpg' or '/your-image.jpg' if placed directly in public

const images = [
  { url: '/images/AEROBICS.png', title: 'AEROBICS' },
  { url: '/images/skating-certificates.png', title: 'Skating Certificates' },
  { url: '/images/skating.png', title: 'Academy Grounds' },
  { url: '/images/summer-crafts.png', title: 'Summer Crafts' },
  { url: '/images/summer.jpg', title: 'Summer Crafts' },
  { url: '/images/team-strategy.jpg', title: 'Team Strategy' },
];

export function Gallery() {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-violet-900 tracking-tight">Academy Gallery</h2>
        <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Glimpses of excellence and champion moments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative h-60 sm:h-72 rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden shadow-lg bento-card bento-card-hover cursor-pointer touch-target"
          >
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 md:p-6">
              <p className="text-white font-black uppercase text-xs md:text-sm tracking-widest mb-1">{img.title}</p>
              <div className="flex items-center gap-2 text-primary">
                <Maximize2 size={12} className="md:w-3.5 md:h-3.5" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Enlarge Moment</span>
              </div>
            </div>
            <div className="absolute top-4 sm:top-5 right-4 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
              <ImageIcon size={16} className="sm:w-4.5 sm:h-4.5" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}