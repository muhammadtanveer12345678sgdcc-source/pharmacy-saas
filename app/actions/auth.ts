"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

// 1. رجسٹر فنکشن
export async function registerStore(formData: FormData) {
  const name = formData.get("name") as string
  const ownerName = formData.get("ownerName") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.store.create({
    data: { name, ownerName, phone, email, password: hashedPassword }
  })
  redirect("/login")
}

// 2. گیلری سے تصویر اپلوڈ کرنے کا فنکشن
export async function submitPayment(formData: FormData) {
  const session = await getServerSession()
  if (!session?.user?.email) return
  
  // تصویر کی فائل کو پکڑ رہے ہیں
  const file = formData.get("screenshotFile") as File
  if (!file || file.size === 0) throw new Error("File not found")

  // تصویر کو ڈیٹا بیس میں سیو کرنے کے قابل بنا رہے ہیں (Base64 Encoding)
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`

  await prisma.store.update({
    where: { email: session.user.email },
    data: { 
      paymentScreenshot: base64Image, // اب اصل تصویر سیو ہو رہی ہے
      paymentStatus: "VERIFYING" 
    }
  })
  revalidatePath("/inventory")
}

// 3. اپروو کرنے پر 30 دن کی ایکسٹینشن (سپر ایڈمن)
export async function approveStore(formData: FormData) {
  const storeId = formData.get("storeId") as string
  
  // آج سے پورے 30 دن بعد کی تاریخ نکال رہے ہیں
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 30)
  
  await prisma.store.update({
    where: { id: storeId },
    data: { 
      paymentStatus: "PAID", 
      subscriptionStatus: "ACTIVE",
      subscriptionExpiry: expiryDate // 30 دن کی لمٹ لگ گئی
    }
  })
  revalidatePath("/admin")
}