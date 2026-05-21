import prisma from "@/lib/prisma"
import { addMedicine, deleteMedicine } from "../actions/medicine"
import { submitPayment } from "../actions/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function InventoryPage() {
  const session = await getServerSession()
  if (!session || !session.user || !session.user.email) redirect("/login")

  const store = await prisma.store.findUnique({ where: { email: session.user.email } })
  if (!store) redirect("/login")

  // چیک کر رہے ہیں کہ کیا اکاؤنٹ ایکٹو ہے اور 30 دن ختم تو نہیں ہو گئے؟
  const isExpired = !store.subscriptionExpiry || new Date(store.subscriptionExpiry) < new Date()
  const isLocked = store.paymentStatus !== "PAID" || isExpired

  const medicines = await prisma.medicine.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800">Inventory 💊</h1>
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">{session.user.email}</div>
          <Link href="/api/auth/signout" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition">Logout</Link>
        </div>
      </div>

      {/* اگر لاک ہے تو صرف یہ ڈبہ نظر آئے گا (باقی سب غائب) */}
      {isLocked ? (
        <div className="bg-yellow-50 p-8 rounded-xl border-2 border-yellow-300 shadow-lg text-center max-w-2xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-yellow-800 mb-4">Account Locked 🔒</h2>
          <p className="text-yellow-700 mb-6 text-lg">
            Your monthly subscription is inactive. Please send <strong>PKR 1,000</strong> to <strong>JazzCash: 03243816183 Name Muhammad Tanveer</strong> and upload the screenshot below to unlock your inventory for 30 days.
          </p>
          
          <form action={submitPayment} className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg border border-yellow-200">
            {/* گیلری سے اپلوڈ کرنے کا بٹن */}
            <input type="file" name="screenshotFile" accept="image/*" required className="w-full text-slate-700 border p-2 rounded" />
            <button type="submit" className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-700 transition">
              Upload Payment Proof
            </button>
          </form>
          
          <p className="mt-4 text-yellow-800 font-bold text-lg">
            Status: <span className="uppercase">{store.paymentStatus}</span>
          </p>
        </div>
      ) : (
        /* اگر لاک نہیں ہے (پیسے دیے ہوئے ہیں) تو انوینٹری نظر آئے گی */
        <>
          <div className="bg-green-100 text-green-800 p-4 rounded-xl mb-6 font-bold flex justify-between">
            <span>✅ Subscription Active</span>
            <span>Expires on: {store.subscriptionExpiry?.toLocaleDateString()}</span>
          </div>

          {/* ADD MEDICINE FORM */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-10">
            <h2 className="text-xl font-semibold mb-4">Add New Medicine</h2>
            <form action={addMedicine} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="name" placeholder="Medicine Name" className="p-2 border rounded" required />
              <input name="formula" placeholder="Formula (Optional)" className="p-2 border rounded" />
              <input name="stock" type="number" placeholder="Initial Stock" className="p-2 border rounded" required />
              <input name="costPrice" type="number" step="0.01" placeholder="Cost Price" className="p-2 border rounded" required />
              <input name="salePrice" type="number" step="0.01" placeholder="Sale Price" className="p-2 border rounded" required />
              <input name="expiryDate" type="date" className="p-2 border rounded" required />
              <button type="submit" className="md:col-span-3 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">Add to Inventory</button>
            </form>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4">Name</th><th className="p-4">Stock</th><th className="p-4">Price</th><th className="p-4">Expiry</th><th className="p-4">Status</th><th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => (
                  <tr key={med.id} className="border-t">
                    <td className="p-4">{med.name}</td><td className="p-4">{med.stock}</td><td className="p-4">Rs. {med.salePrice}</td>
                    <td className="p-4">{new Date(med.expiryDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      {new Date(med.expiryDate) < new Date() ? <span className="text-red-600">Expired</span> : <span className="text-green-600">Active</span>}
                    </td>
                    <td className="p-4">
                      <form action={deleteMedicine}><input type="hidden" name="id" value={med.id} /><button className="text-red-500 font-bold">Delete</button></form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}