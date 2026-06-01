// lib/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { profileUpdateSchema, inquiryStatusSchema, manualEventSchema, userStatusSchema } from "./validations";
import { requirePermission } from "./rbac";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthedSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getDashboardStats(userId: string) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo  = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [
    total, newCount, contacted, confirmed, rejected, upcoming,
    recent, upcomingEvents,
    totalLast30, totalPrev30, confirmedLast30, confirmedPrev30,
    totalBudget,
  ] = await Promise.all([
    prisma.eventInquiry.count({ where: { vendorId: userId } }),
    prisma.eventInquiry.count({ where: { vendorId: userId, status: "NEW" } }),
    prisma.eventInquiry.count({ where: { vendorId: userId, status: "CONTACTED" } }),
    prisma.eventInquiry.count({ where: { vendorId: userId, status: "CONFIRMED" } }),
    prisma.eventInquiry.count({ where: { vendorId: userId, status: "REJECTED" } }),
    prisma.eventInquiry.count({ where: { vendorId: userId, status: "CONFIRMED", eventDate: { gte: now } } }),
    prisma.activityLog.findMany({ where: { vendorId: userId }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.eventInquiry.findMany({
      where: { vendorId: userId, status: "CONFIRMED", eventDate: { gte: now } },
      orderBy: { eventDate: "asc" }, take: 5,
      select: { id: true, clientName: true, eventType: true, eventDate: true, eventLocation: true, guestCount: true, budget: true },
    }),
    prisma.eventInquiry.count({ where: { vendorId: userId, createdAt: { gte: thirtyDaysAgo } } }),
    prisma.eventInquiry.count({ where: { vendorId: userId, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.eventInquiry.count({ where: { vendorId: userId, status: "CONFIRMED", createdAt: { gte: thirtyDaysAgo } } }),
    prisma.eventInquiry.count({ where: { vendorId: userId, status: "CONFIRMED", createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.eventInquiry.aggregate({ where: { vendorId: userId, status: "CONFIRMED" }, _sum: { budget: true } }),
  ]);

  const inquiryTrend  = totalPrev30 > 0     ? Math.round(((totalLast30 - totalPrev30) / totalPrev30) * 100)         : 0;
  const confirmedTrend = confirmedPrev30 > 0 ? Math.round(((confirmedLast30 - confirmedPrev30) / confirmedPrev30) * 100) : 0;

  return { total, newCount, contacted, confirmed, rejected, upcoming, recent, upcomingEvents, inquiryTrend, confirmedTrend, totalRevenue: totalBudget._sum.budget || 0 };
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getVendorProfile(userId: string) {
  const [user, profile] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } }),
    prisma.vendorProfile.findUnique({ where: { userId } }),
  ]);
  return { user, profile };
}

export async function updateVendorProfile(formData: FormData) {
  const session = await getAuthedSession();
  requirePermission(session.user.role, "profile:update:own");

  const data = {
    vendorName:  formData.get("vendorName")  as string,
    category:    formData.get("category")    as string,
    location:    formData.get("location")    as string,
    email:       formData.get("email")       as string,
    phone:       formData.get("phone")       as string,
    description: formData.get("description") as string,
    imageUrl:    formData.get("imageUrl")    as string,
  };

  const parsed = profileUpdateSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  try {
    await prisma.$transaction([
      prisma.vendorProfile.upsert({
        where: { userId: session.user.id },
        update: { vendorName: parsed.data.vendorName, category: parsed.data.category, location: parsed.data.location, phone: parsed.data.phone, description: parsed.data.description, imageUrl: parsed.data.imageUrl || null },
        create: { userId: session.user.id, vendorName: parsed.data.vendorName, category: parsed.data.category, location: parsed.data.location, phone: parsed.data.phone, description: parsed.data.description, imageUrl: parsed.data.imageUrl || null },
      }),
      prisma.user.update({ where: { id: session.user.id }, data: { email: parsed.data.email } }),
      prisma.activityLog.create({ data: { vendorId: session.user.id, action: "PROFILE_UPDATED", description: "Updated vendor profile information" } }),
    ]);
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch {
    return { error: "Failed to update profile" };
  }
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export async function getInquiries(userId: string, page = 1, status?: string) {
  const take = 10;
  const skip = (page - 1) * take;
  const where = { vendorId: userId, ...(status && status !== "ALL" ? { status: status as never } : {}) };
  const [inquiries, total] = await Promise.all([
    prisma.eventInquiry.findMany({ where, orderBy: { createdAt: "desc" }, take, skip }),
    prisma.eventInquiry.count({ where }),
  ]);
  return { inquiries, total, pages: Math.ceil(total / take) };
}

export async function getInquiryById(id: string, userId: string) {
  return prisma.eventInquiry.findFirst({ where: { id, vendorId: userId } });
}

export async function updateInquiryStatus(id: string, formData: FormData) {
  const session = await getAuthedSession();
  requirePermission(session.user.role, "inquiry:update:own");

  const data   = { status: formData.get("status") as string };
  const parsed = inquiryStatusSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid status" };

  try {
    const inquiry = await prisma.eventInquiry.findFirst({ where: { id, vendorId: session.user.id } });
    if (!inquiry) return { error: "Inquiry not found" };

    await prisma.$transaction([
      prisma.eventInquiry.update({ where: { id }, data: { status: parsed.data.status } }),
      prisma.activityLog.create({ data: { vendorId: session.user.id, action: `INQUIRY_${parsed.data.status}`, description: `Updated ${inquiry.clientName}'s inquiry status to ${parsed.data.status}` } }),
    ]);
    revalidatePath(`/dashboard/inquiries/${id}`);
    revalidatePath("/dashboard/inquiries");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to update status" };
  }
}

// ─── Manual Calendar Events ───────────────────────────────────────────────────

export async function getManualEvents(userId: string) {
  return prisma.manualEvent.findMany({
    where: { userId },
    orderBy: { eventDate: "asc" },
  });
}

export async function createManualEvent(formData: FormData) {
  const session = await getAuthedSession();
  requirePermission(session.user.role, "event:create");

  const data = {
    title:       formData.get("title")       as string,
    description: formData.get("description") as string,
    eventDate:   formData.get("eventDate")   as string,
    endDate:     formData.get("endDate")     as string | undefined,
    location:    formData.get("location")    as string,
    color:       (formData.get("color") || "purple") as string,
    allDay:      formData.get("allDay") === "true",
  };

  const parsed = manualEventSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  try {
    const event = await prisma.manualEvent.create({
      data: {
        userId:      session.user.id,
        title:       parsed.data.title,
        description: parsed.data.description,
        eventDate:   new Date(parsed.data.eventDate),
        endDate:     parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        location:    parsed.data.location,
        color:       parsed.data.color,
        allDay:      parsed.data.allDay,
      },
    });
    await prisma.activityLog.create({
      data: { vendorId: session.user.id, action: "EVENT_CREATED", description: `Created manual event: ${parsed.data.title}` },
    });
    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard");
    return { success: true, event };
  } catch {
    return { error: "Failed to create event" };
  }
}

export async function updateManualEvent(id: string, formData: FormData) {
  const session = await getAuthedSession();
  requirePermission(session.user.role, "event:update:own");

  // Ownership check
  const existing = await prisma.manualEvent.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) return { error: "Event not found or access denied" };

  const data = {
    title:       formData.get("title")       as string,
    description: formData.get("description") as string,
    eventDate:   formData.get("eventDate")   as string,
    endDate:     formData.get("endDate")     as string | undefined,
    location:    formData.get("location")    as string,
    color:       (formData.get("color") || "purple") as string,
    allDay:      formData.get("allDay") === "true",
  };

  const parsed = manualEventSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  try {
    await prisma.manualEvent.update({
      where: { id },
      data: {
        title:       parsed.data.title,
        description: parsed.data.description,
        eventDate:   new Date(parsed.data.eventDate),
        endDate:     parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        location:    parsed.data.location,
        color:       parsed.data.color,
        allDay:      parsed.data.allDay,
      },
    });
    revalidatePath("/dashboard/calendar");
    return { success: true };
  } catch {
    return { error: "Failed to update event" };
  }
}

export async function deleteManualEvent(id: string) {
  const session = await getAuthedSession();
  requirePermission(session.user.role, "event:delete:own");

  const existing = await prisma.manualEvent.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) return { error: "Event not found or access denied" };

  try {
    await prisma.manualEvent.delete({ where: { id } });
    await prisma.activityLog.create({
      data: { vendorId: session.user.id, action: "EVENT_DELETED", description: `Deleted manual event: ${existing.title}` },
    });
    revalidatePath("/dashboard/calendar");
    return { success: true };
  } catch {
    return { error: "Failed to delete event" };
  }
}

// ─── Admin: User Management ───────────────────────────────────────────────────

export async function getAllVendors() {
  const session = await getAuthedSession();
  requirePermission(session.user.role, "user:list");

  return prisma.user.findMany({
    where: { role: "VENDOR" },
    select: {
      id: true, email: true, name: true, accountStatus: true, createdAt: true,
      vendorProfile: { select: { vendorName: true, category: true, location: true, rating: true, totalEvents: true } },
      _count: { select: { inquiries: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserStatus(userId: string, formData: FormData) {
  const session = await getAuthedSession();
  requirePermission(session.user.role, "user:suspend");

  const data = { accountStatus: formData.get("accountStatus") as string };
  const parsed = userStatusSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid status" };

  // Admins cannot suspend themselves
  if (userId === session.user.id) return { error: "Cannot change your own account status" };

  try {
    await prisma.user.update({ where: { id: userId }, data: { accountStatus: parsed.data.accountStatus } });
    await prisma.activityLog.create({
      data: { vendorId: session.user.id, action: "USER_STATUS_CHANGED", description: `Set user ${userId} status to ${parsed.data.accountStatus}` },
    });
    revalidatePath("/admin/vendors");
    return { success: true };
  } catch {
    return { error: "Failed to update user status" };
  }
}

export async function getAdminStats() {
  const session = await getAuthedSession();
  requirePermission(session.user.role, "admin:access");

  const [totalVendors, activeVendors, suspendedVendors, totalInquiries, confirmedInquiries, totalRevenue] = await Promise.all([
    prisma.user.count({ where: { role: "VENDOR" } }),
    prisma.user.count({ where: { role: "VENDOR", accountStatus: "ACTIVE" } }),
    prisma.user.count({ where: { role: "VENDOR", accountStatus: "SUSPENDED" } }),
    prisma.eventInquiry.count(),
    prisma.eventInquiry.count({ where: { status: "CONFIRMED" } }),
    prisma.eventInquiry.aggregate({ where: { status: "CONFIRMED" }, _sum: { budget: true } }),
  ]);

  return { totalVendors, activeVendors, suspendedVendors, totalInquiries, confirmedInquiries, totalRevenue: totalRevenue._sum.budget || 0 };
}

export async function createVendor(formData: FormData) {
  const session = await getAuthedSession();
  requirePermission(session.user.role, "user:list");

  const name       = (formData.get("name")       as string)?.trim();
  const email      = (formData.get("email")      as string)?.trim();
  const password   = (formData.get("password")   as string)?.trim();
  const vendorName = (formData.get("vendorName") as string)?.trim();
  const category   = (formData.get("category")   as string)?.trim();
  const location   = (formData.get("location")   as string)?.trim();

  if (!email || !password || !vendorName || !category || !location)
    return { error: "All required fields must be filled" };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters" };

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "A user with this email already exists" };

  const bcrypt = await import("bcryptjs");
  const hashed = await bcrypt.hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || vendorName,
        role: "VENDOR",
        accountStatus: "ACTIVE",
        vendorProfile: {
          create: { vendorName, category, location },
        },
      },
    });
    revalidatePath("/admin/vendors");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { error: "Failed to create vendor" };
  }
}
