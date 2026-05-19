import React from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';

const images = [
  { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80', title: 'Champions League Final' },
  { url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80', title: 'Summer Camp Training' },
  { url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80', title: 'Academy Grounds' },
  { url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80', title: 'Football Practice' },
  { url: 'https://images.unsplash.com/photo-1461891263873-d81ca1d3293c?auto=format&fit=crop&q=80', title: 'Athlete Sprint' },
  { url: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&q=80', title: 'Team Strategy' },
];

export function Gallery() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Academy Gallery</h2>
        <p className="text-slate-500 font-medium mt-1">Glimpses of excellence and champion moments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative h-72 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
          >
            <img 
              src={img.url} 
              alt={img.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
              <p className="text-white font-black uppercase text-xs tracking-widest mb-1">{img.title}</p>
              <div className="flex items-center gap-2 text-white/60">
                <Maximize2 size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Enlarge Moment</span>
              </div>
            </div>
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ImageIcon size={18} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
