import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">Pharmacy SaaS</h1>
        <div className="flex gap-4">
          <Link href="/login" className="text-slate-600 font-bold hover:text-blue-600 px-4 py-2 transition">
            Login
          </Link>
          <Link href="/register" className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-600/30">
            Register Store
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 max-w-4xl mx-auto">
        <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-blue-200">
          🚀 Pakistan's #1 Pharmacy Software
        </span>
        
        <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          Manage Your Medical Store <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
            Like a Pro.
          </span>
        </h2>
        
        <p className="text-xl text-slate-600 mb-10 max-w-2xl">
          Say goodbye to registers and paper slips. Track your medicine inventory, expiry dates, and sales securely from anywhere, on any device.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/register" className="bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-full hover:bg-blue-700 transition shadow-xl shadow-blue-600/30">
            Start Your Business Today
          </Link>
          <Link href="/login" className="bg-white text-slate-800 border-2 border-slate-200 text-lg font-bold px-8 py-4 rounded-full hover:border-slate-300 hover:bg-slate-50 transition">
            Access Dashboard
          </Link>
        </div>
      </main>

      {/* Pricing Section */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-slate-800 mb-12">Simple & Transparent Pricing</h3>
          
          <div className="bg-slate-900 text-left max-w-md mx-auto p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
            <h4 className="text-2xl font-bold text-white mb-2">Premium Plan</h4>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-white">Rs. 1,000</span>
              <span className="text-slate-400"> / month</span>
            </div>
            
            <ul className="space-y-4 mb-8 text-slate-300">
              <li className="flex items-center gap-3">✅ <span className="font-medium">Unlimited Medicines</span></li>
              <li className="flex items-center gap-3">✅ <span className="font-medium">Expiry Alerts & Tracking</span></li>
              <li className="flex items-center gap-3">✅ <span className="font-medium">Secure Cloud Backup</span></li>
              <li className="flex items-center gap-3">✅ <span className="font-medium">24/7 VIP Support</span></li>
            </ul>
            
            <Link href="/register" className="block w-full bg-blue-500 text-white text-center font-bold py-4 rounded-xl hover:bg-blue-400 transition">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}