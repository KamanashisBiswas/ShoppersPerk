import React from 'react';
import { MdTrendingUp, MdShoppingBag, MdPeople, MdAttachMoney } from 'react-icons/md';

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-sm">
      <span className="text-green-400 flex items-center gap-1">
        <MdTrendingUp /> {change}
      </span>
      <span className="text-gray-500">vs last month</span>
    </div>
  </div>
);

export default function DashboardPage() {
  const stats = [
    { title: 'Total Revenue', value: '$54,239', change: '+12.5%', icon: MdAttachMoney, color: 'text-green-400 bg-green-400' },
    { title: 'Total Orders', value: '1,253', change: '+8.2%', icon: MdShoppingBag, color: 'text-blue-400 bg-blue-400' },
    { title: 'New Customers', value: '342', change: '+5.4%', icon: MdPeople, color: 'text-purple-400 bg-purple-400' },
    { title: 'Active Users', value: '8,542', change: '+2.1%', icon: MdTrendingUp, color: 'text-orange-400 bg-orange-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-400 mt-2">Welcome back to your store overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[400px]">
          <h2 className="text-xl font-bold mb-4">Revenue Analytics</h2>
          <div className="flex items-center justify-center h-full text-gray-500">
            Chart Placeholder
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[400px]">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((order) => (
              <div key={order} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <MdShoppingBag />
                  </div>
                  <div>
                    <p className="font-medium">Order #{1000 + order}</p>
                    <p className="text-sm text-gray-400">2 items • $124.00</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
