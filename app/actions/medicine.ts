"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"

export async function addMedicine(formData: FormData) {
  const session = await getServerSession()
  
  // 1. سیکیورٹی چیک: ای میل موجود ہے یا نہیں؟
  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized access!")
  }

  // 2. ماسٹر مائنڈ ٹرک: ای میل کے ذریعے ڈیٹا بیس سے دکان کی اصلی آئی ڈی نکالیں
  const store = await prisma.store.findUnique({
    where: { email: session.user.email }
  })

  if (!store) {
    throw new Error("Store not found!")
  }

  const realStoreId = store.id

  // 3. باقی سارا ڈیٹا فارم سے لیں
  const name = formData.get("name") as string
  const formula = formData.get("formula") as string
  const stock = parseInt(formData.get("stock") as string)
  const costPrice = parseFloat(formData.get("costPrice") as string)
  const salePrice = parseFloat(formData.get("salePrice") as string)
  const expiryDate = new Date(formData.get("expiryDate") as string)

  // 4. ڈیٹا بیس میں فائنل انٹری
  await prisma.medicine.create({
    data: {
      name,
      formula,
      stock,
      costPrice,
      salePrice,
      expiryDate,
      storeId: realStoreId // اب یہ آئی ڈی 100 فیصد پرفیکٹ جائے گی!
    }
  })

  // پیج کو ریفریش کریں تاکہ نئی دوائی فوراً نظر آ جائے
  revalidatePath("/inventory") 
}
// ڈیلیٹ کرنے کا فنکشن (اسی فائل کے آخر میں پیسٹ کریں)
export async function deleteMedicine(formData: FormData) {
  const session = await getServerSession()
  if (!session || !session.user || !session.user.email) throw new Error("Unauthorized")

  const store = await prisma.store.findUnique({ where: { email: session.user.email } })
  if (!store) throw new Error("Store not found")

  const medicineId = formData.get("id") as string

  // ہیکر لیول سیکیورٹی: ہم چیک کر رہے ہیں کہ کیا یہ دوائی واقعی اسی دکان کی ہے؟
  await prisma.medicine.deleteMany({
    where: {
      id: medicineId,
      storeId: store.id 
    }
  })

  revalidatePath("/inventory")
}