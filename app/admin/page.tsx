import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { approveStore } from "../actions/auth" 

const SUPER_ADMIN_EMAIL = "ameermuslim@1gmail.com" 

export default async function SuperAdminPage() {
  const session = await getServerSession()
  
  if (!session || !session.user || session.user.email !== SUPER_ADMIN_EMAIL) {
    redirect("/inventory") 
  }

  const allStores = await prisma.store.findMany({
    include: {
      _count: {
        select: { medicines: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const totalStores = allStores.length
  const totalMedicinesAcrossSaaS = allStores.reduce((sum, store) => sum + store._count.medicines, 0)

  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      
      <div className="flex justify-between items-center mb-8 bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
        <div>
          <h1 className="text-3xl font-bold text-white">Super Admin Console 👑</h1>
          <p className="text-slate-400 mt-1">Welcome back, Boss. Here is the overview of your SaaS.</p>
        </div>
        <Link href="/api/auth/signout" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold transition shadow-lg shadow-red-500/30">
          Logout Admin
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <p className="text-slate-400 font-semibold mb-2">Total Registered Stores</p>
          <p className="text-5xl font-bold text-blue-400">{totalStores}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <p className="text-slate-400 font-semibold mb-2">Total Medicines Logged</p>
          <p className="text-5xl font-bold text-green-400">{totalMedicinesAcrossSaaS}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <p className="text-slate-400 font-semibold mb-2">System Status</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">100% Online 🚀</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-xl font-bold text-white">All Registered Pharmacies</h2>
        </div>
        <table className="w-full text-left text-slate-300">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="p-4 font-semibold">Store Name</th>
              <th className="p-4 font-semibold">Owner</th>
              <th className="p-4 font-semibold">Contact / Email</th>
              <th className="p-4 font-semibold">Medicines Added</th>
              <th className="p-4 font-semibold">Payment Proof</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {allStores.map((store) => (
              <tr key={store.id} className="border-t border-slate-700 hover:bg-slate-700/50 transition">
                <td className="p-4 font-bold text-white">{store.name}</td>
                <td className="p-4">{store.ownerName}</td>
                <td className="p-4 text-sm">
                  <div className="text-slate-300">{store.phone}</div>
                  <div className="text-slate-500">{store.email}</div>
                </td>
                <td className="p-4">
                  <span className="bg-blue-900/50 text-blue-400 px-3 py-1 rounded-full text-sm font-bold border border-blue-800">
                    {store._count.medicines} items
                  </span>
                </td>
                
                {/* یہ حصہ ہم نے اپڈیٹ کیا ہے: اب لنک کی جگہ سیدھا تصویر نظر آئے گی */}
                <td className="p-4">
                  {store.paymentScreenshot ? (
                    <a href={store.paymentScreenshot} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={store.paymentScreenshot} 
                        alt="Payment Proof" 
                        className="w-16 h-16 object-cover rounded border border-slate-600 hover:scale-150 transition-transform cursor-pointer" 
                      />
                    </a>
                  ) : (
                    <span className="text-slate-500 italic">No proof yet</span>
                  )}
                </td>

                <td className="p-4">
                  {store.paymentStatus !== "PAID" ? (
                    <form action={approveStore}>
                      <input type="hidden" name="storeId" value={store.id} />
                      <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold transition shadow-lg shadow-green-600/20">
                        Approve Store
                      </button>
                    </form>
                  ) : (
                    <span className="text-green-400 font-bold bg-green-900/30 px-3 py-1 rounded-full border border-green-800">
                      ✓ Verified
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {allStores.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">No stores registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}