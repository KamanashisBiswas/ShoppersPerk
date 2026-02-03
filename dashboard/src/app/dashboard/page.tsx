import React from 'react';
import { MdTrendingUp, MdShoppingBag, MdPeople, MdAttachMoney, MdArrowOutward } from 'react-icons/md';

const StatCard = ({ title, value, change, icon: Icon, color, trend }: any) => (
  <div className="relative overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-300 group">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color.split('-')[1]}-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50`} />
    
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl ${color.replace('text-', 'bg-').replace('400', '500/10')} border border-${color.split('-')[1]}-500/20`}>
        <Icon size={24} className={color} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${trend === 'up' ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
        {trend === 'up' ? '+' : ''}{change}
        <MdTrendingUp size={16} className={trend === 'down' ? 'rotate-180' : ''} />
      </div>
    </div>
    
    <div>
      <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3>
      <p className="text-gray-500 font-medium">{title}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const stats = [
    { title: 'Total Revenue', value: '$54,239', change: '12.5%', icon: MdAttachMoney, color: 'text-green-400', trend: 'up' },
    { title: 'Total Orders', value: '1,253', change: '8.2%', icon: MdShoppingBag, color: 'text-blue-400', trend: 'up' },
    { title: 'New Customers', value: '342', change: '5.4%', icon: MdPeople, color: 'text-purple-400', trend: 'down' },
    { title: 'Active Users', value: '8,542', change: '2.1%', icon: MdTrendingUp, color: 'text-orange-400', trend: 'up' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent tracking-tight mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 text-lg">Detailed analytics and performance metrics</p>
        </div>
        <button className="px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-white/5">
          Download Report
          <MdArrowOutward />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 h-[400px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-xl font-bold text-white">Revenue Analytics</h2>
            <select className="bg-white/5 border border-white/10 text-gray-400 text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex items-center justify-center h-[280px] text-gray-600 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
            Chart Visualization Placeholder
          </div>
        </div>
        
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">See All</button>
          </div>
          <div className="space-y-4 overflow-y-auto h-[290px] pr-2 custom-scrollbar">
            {[1, 2, 3, 4, 5].map((order) => (
              <div key={order} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] rounded-2xl transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <MdShoppingBag />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Order #{1000 + order}</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
                <span className="text-right">
                  <p className="text-white font-medium">$124.00</p>
                  <p className="text-xs text-green-400">Paid</p>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
