// lib/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { profileUpdateSchema, inquiryStatusSchema } from "./validations";

export async function getSession() {
  return await auth();
}

export async function getDashboardStats(userId: string) {
  const [total, newCount, confirmed, upcoming, recent] = await Promise.all([
    prisma.eventInquiry.count({ where: { vendorId: userId } }),
    prisma.eventInquiry.count({ where: { vendorId: userId, status: "NEW" } }),
    prisma.eventInquiry.count({ where: { vendorId: userId, status: "CONFIRMED" } }),
    prisma.eventInquiry.count({
      where: {
        vendorId: userId,
        status: "CONFIRMED",
        eventDate: { gte: new Date() },
      },
    }),
    prisma.activityLog.findMany({
      where: { vendorId: userId },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return { total, newCount, confirmed, upcoming, recent };
}

export async function getVendorProfile(userId: string) {
  const [user, profile] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } }),
    prisma.vendorProfile.findUnique({ where: { userId } }),
  ]);
  return { user, profile };
}

export async function updateVendorProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const data = {
    vendorName: formData.get("vendorName") as string,
    category: formData.get("category") as string,
    location: formData.get("location") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    description: formData.get("description") as string,
    imageUrl: formData.get("imageUrl") as string,
  };

  const parsed = profileUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    await prisma.$transaction([
      prisma.vendorProfile.upsert({
        where: { userId: session.user.id },
        update: {
          vendorName: parsed.data.vendorName,
          category: parsed.data.category,
          location: parsed.data.location,
          phone: parsed.data.phone,
          description: parsed.data.description,
          imageUrl: parsed.data.imageUrl || null,
        },
        create: {
          userId: session.user.id,
          vendorName: parsed.data.vendorName,
          category: parsed.data.category,
          location: parsed.data.location,
          phone: parsed.data.phone,
          description: parsed.data.description,
          imageUrl: parsed.data.imageUrl || null,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { email: parsed.data.email },
      }),
      prisma.activityLog.create({
        data: {
          vendorId: session.user.id,
          action: "PROFILE_UPDATED",
          description: "Updated vendor profile information",
        },
      }),
    ]);

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch {
    return { error: "Failed to update profile" };
  }
}

export async function getInquiries(userId: string, page = 1, status?: string) {
  const take = 10;
  const skip = (page - 1) * take;

  const where = {
    vendorId: userId,
    ...(status && status !== "ALL" ? { status: status as never } : {}),
  };

  const [inquiries, total] = await Promise.all([
    prisma.eventInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    prisma.eventInquiry.count({ where }),
  ]);

  return { inquiries, total, pages: Math.ceil(total / take) };
}

export async function getInquiryById(id: string, userId: string) {
  return prisma.eventInquiry.findFirst({
    where: { id, vendorId: userId },
  });
}

export async function updateInquiryStatus(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const data = { status: formData.get("status") as string };
  const parsed = inquiryStatusSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid status" };

  try {
    const inquiry = await prisma.eventInquiry.findFirst({
      where: { id, vendorId: session.user.id },
    });
    if (!inquiry) return { error: "Inquiry not found" };

    await prisma.$transaction([
      prisma.eventInquiry.update({
        where: { id },
        data: { status: parsed.data.status },
      }),
      prisma.activityLog.create({
        data: {
          vendorId: session.user.id,
          action: `INQUIRY_${parsed.data.status}`,
          description: `Updated ${inquiry.clientName}'s inquiry status to ${parsed.data.status}`,
        },
      }),
    ]);

    revalidatePath(`/dashboard/inquiries/${id}`);
    revalidatePath("/dashboard/inquiries");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to update status" };
  }
}
