// prisma/seed.ts
import { PrismaClient, InquiryStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function future(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(10, 0, 0, 0);
  return d;
}
function past(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(10, 0, 0, 0);
  return d;
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clean
  await prisma.activityLog.deleteMany();
  await prisma.manualEvent.deleteMany();
  await prisma.eventInquiry.deleteMany();
  await prisma.vendorProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const vendorPassword = await bcrypt.hash("Vendor@123", 12);
  const adminPassword  = await bcrypt.hash("Admin@123",  12);

  // ── Admin user ────────────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: "admin@starvnt.com",
      password: adminPassword,
      name: "Platform Admin",
      role: "ADMIN",
      accountStatus: "ACTIVE",
    },
  });

  // ── Vendor user ───────────────────────────────────────────────────────────
  const user = await prisma.user.create({
    data: {
      email: "vendor@starvnt.com",
      password: vendorPassword,
      name: "Arjun Sharma",
      role: "VENDOR",
      accountStatus: "ACTIVE",
    },
  });

  await prisma.vendorProfile.create({
    data: {
      userId: user.id,
      vendorName: "StarVnt Entertainment",
      category: "Full Event Management",
      location: "Mumbai, Maharashtra",
      phone: "+91 98765 43210",
      description:
        "Premium event management company specializing in corporate events, weddings, and entertainment shows. With over 10 years of experience, we bring your vision to life with unmatched creativity and professionalism.",
      imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=starvnt",
      rating: 4.8,
      totalEvents: 142,
    },
  });

  // ── Inquiries ──────────────────────────────────────────────────────────────
  const inquiries: Array<{
    clientName: string; clientEmail: string; clientPhone: string;
    eventType: string; eventDate: Date; eventLocation: string;
    guestCount: number; budget: number; message: string;
    status: InquiryStatus; createdAt: Date;
  }> = [
    // CONFIRMED FUTURE
    { clientName: "Priya Mehta",   clientEmail: "priya.mehta@gmail.com",        clientPhone: "+91 99001 23456", eventType: "Wedding",          eventDate: future(12), eventLocation: "The Taj Mahal Palace, Mumbai",  guestCount: 350,  budget: 1500000, message: "Complete wedding management including decor, catering, and entertainment.",             status: "CONFIRMED", createdAt: past(20) },
    { clientName: "Vikram Singh",  clientEmail: "vikram.s@startupventures.com", clientPhone: "+91 77889 00112", eventType: "Product Launch",   eventDate: future(5),  eventLocation: "WeWork BKC, Mumbai",           guestCount: 150,  budget: 500000,  message: "Tech product launch with media presence. AV setup, live streaming, cocktail reception.", status: "CONFIRMED", createdAt: past(15) },
    { clientName: "Ananya Reddy",  clientEmail: "ananya.r@fashionweek.com",     clientPhone: "+91 88990 01122", eventType: "Fashion Show",     eventDate: future(28), eventLocation: "NSCI Dome, Mumbai",            guestCount: 500,  budget: 2000000, message: "Seasonal fashion show with 30 designers. Runway, lighting, celebrity management.",        status: "CONFIRMED", createdAt: past(10) },
    { clientName: "Kavya Nair",    clientEmail: "kavya.nair@musiclabel.com",    clientPhone: "+91 90123 45678", eventType: "Concert",          eventDate: future(45), eventLocation: "Jio World Garden, Mumbai",     guestCount: 2000, budget: 5000000, message: "Valentine's Day concert with 5 artists. Full production and ticketing coordination.",     status: "CONFIRMED", createdAt: past(8)  },
    { clientName: "Ishaan Verma",  clientEmail: "ishaan.v@collegefest.edu",     clientPhone: "+91 75319 86420", eventType: "College Fest",     eventDate: future(60), eventLocation: "IIT Bombay Campus, Powai",     guestCount: 1500, budget: 750000,  message: "3-day tech and cultural festival. Performer booking, stage and crowd management.",        status: "CONFIRMED", createdAt: past(5)  },
    { clientName: "Nisha Kapoor",  clientEmail: "nisha.k@weddings.com",         clientPhone: "+91 91234 56789", eventType: "Anniversary Gala", eventDate: future(18), eventLocation: "ITC Grand Central, Mumbai",    guestCount: 200,  budget: 900000,  message: "Silver jubilee gala. Live band, floral decor, 5-course dinner.",                         status: "CONFIRMED", createdAt: past(12) },
    // CONFIRMED PAST (revenue, not upcoming)
    { clientName: "Rajan Malhotra",clientEmail: "rajan.m@enterprise.co.in",     clientPhone: "+91 86420 97531", eventType: "Awards Ceremony",  eventDate: past(30),   eventLocation: "Grand Hyatt, Mumbai",          guestCount: 300,  budget: 1200000, message: "Annual industry awards night. Stage, celebrity host, media.",                            status: "CONFIRMED", createdAt: past(50) },
    { clientName: "Deepa Menon",   clientEmail: "deepa.m@corporategala.com",    clientPhone: "+91 98234 11223", eventType: "Corporate Gala",   eventDate: past(15),   eventLocation: "Trident Hotel, Nariman Point", guestCount: 450,  budget: 1800000, message: "Year-end corporate celebration with live entertainment and awards.",                     status: "CONFIRMED", createdAt: past(40) },
    { clientName: "Suresh Iyer",   clientEmail: "suresh.i@events.com",          clientPhone: "+91 77123 99001", eventType: "Music Festival",   eventDate: past(7),    eventLocation: "Carter Road, Bandra, Mumbai",  guestCount: 3000, budget: 7500000, message: "2-day outdoor music festival with 10 artists. Full production and security.",              status: "CONFIRMED", createdAt: past(35) },
    // CONTACTED
    { clientName: "Rohan Kapoor",  clientEmail: "rohan.k@techcorp.in",          clientPhone: "+91 98765 11223", eventType: "Corporate Gala",   eventDate: future(35), eventLocation: "Hyatt Regency, Pune",          guestCount: 200,  budget: 800000,  message: "Annual gala dinner. Stage setup, DJ, award ceremony.",                                   status: "CONTACTED", createdAt: past(7)  },
    { clientName: "Amit Joshi",    clientEmail: "amit.joshi@gmail.com",         clientPhone: "+91 97531 24680", eventType: "Engagement",       eventDate: future(22), eventLocation: "The Oberoi, Mumbai",           guestCount: 120,  budget: 600000,  message: "Traditional Marathi engagement + cocktail. Decor and photography.",                      status: "CONTACTED", createdAt: past(6)  },
    { clientName: "Meera Iyer",    clientEmail: "meera.iyer@gmail.com",         clientPhone: "+91 98010 23456", eventType: "Baby Shower",      eventDate: future(14), eventLocation: "Bandra West, Mumbai",          guestCount: 40,   budget: 80000,   message: "Elegant garden-themed baby shower. Decor, photo booth, catering.",                      status: "CONTACTED", createdAt: past(4)  },
    // NEW
    { clientName: "Sneha Patel",   clientEmail: "sneha.patel@yahoo.com",        clientPhone: "+91 87654 32109", eventType: "Birthday",         eventDate: future(20), eventLocation: "Private Villa, Lonavala",      guestCount: 80,   budget: 250000,  message: "Surprise 50th birthday. Vintage Bollywood theme.",                                       status: "NEW",       createdAt: past(2)  },
    { clientName: "Arjun Das",     clientEmail: "arjun.d@startup.io",           clientPhone: "+91 90011 22334", eventType: "Startup Demo Day", eventDate: future(40), eventLocation: "91springboard, Andheri",       guestCount: 250,  budget: 350000,  message: "Annual startup showcase with investors. Stage, projectors, networking dinner.",           status: "NEW",       createdAt: past(1)  },
    { clientName: "Pooja Sharma",  clientEmail: "pooja.s@ngo.org",              clientPhone: "+91 88112 33445", eventType: "Charity Gala",     eventDate: future(50), eventLocation: "NCPA, Mumbai",                 guestCount: 600,  budget: 1100000, message: "Annual charity fundraiser. Celebrity host, silent auction, gourmet dinner.",              status: "NEW",       createdAt: past(0)  },
    // REJECTED
    { clientName: "Farhan Sheikh", clientEmail: "farhan.s@media.com",           clientPhone: "+91 99887 66554", eventType: "Film Premiere",    eventDate: past(5),    eventLocation: "PVR Icon, Versova",            guestCount: 400,  budget: 900000,  message: "Film premiere with red carpet, media, and after party.",                                 status: "REJECTED",  createdAt: past(25) },
  ];

  for (const inquiry of inquiries) {
    await prisma.eventInquiry.create({ data: { ...inquiry, vendorId: user.id } });
  }

  // ── Manual Events ──────────────────────────────────────────────────────────
  const manualEvents = [
    { title: "Venue Site Visit — Taj",    description: "Walk-through for Priya Mehta wedding setup. Check stage and decor points.",           eventDate: future(3),  location: "Taj Mahal Palace, Mumbai",     color: "purple" },
    { title: "Vendor Meeting — AV Team",  description: "Review AV requirements for Vikram Singh product launch.",                             eventDate: future(5),  location: "Office, BKC",                  color: "sky"    },
    { title: "Team Briefing",             description: "Internal team sync before the product launch event.",                                  eventDate: future(5),  location: "StarVnt Office, Andheri",      color: "amber"  },
    { title: "Contract Signing — Kavya",  description: "Sign final concert contract with Kavya Nair and music label team.",                   eventDate: future(8),  location: "StarVnt Office",               color: "rose"   },
    { title: "Decor Trial — Fashion Show",description: "Test runway decor setup before full install. Lighting check with team.",              eventDate: future(20), location: "NSCI Dome, Mumbai",            color: "purple" },
    { title: "Budget Review",             description: "Monthly P&L review with accounts team.",                                               eventDate: future(7),  location: "StarVnt Office",               color: "amber"  },
    { title: "Client Call — Rohan Kapoor",description: "Follow-up call to discuss corporate gala requirements and finalise package.",          eventDate: future(2),  location: null,                           color: "sky"    },
    { title: "Personal: Gym",             description: null,                                                                                    eventDate: future(1),  location: "Gold's Gym, Andheri",          color: "rose"   },
  ];

  for (const ev of manualEvents) {
    await prisma.manualEvent.create({ data: { userId: user.id, ...ev, allDay: true } });
  }

  // ── Activity logs ──────────────────────────────────────────────────────────
  const now = new Date();
  const activities = [
    { action: "INQUIRY_CONFIRMED",  description: "Confirmed booking for Priya Mehta — Wedding at Taj Mahal Palace",            hoursAgo: 2   },
    { action: "INQUIRY_RECEIVED",   description: "New inquiry received from Pooja Sharma for Charity Gala",                    hoursAgo: 5   },
    { action: "EVENT_CREATED",      description: "Created manual event: Client Call — Rohan Kapoor",                           hoursAgo: 10  },
    { action: "INQUIRY_CONFIRMED",  description: "Confirmed Nisha Kapoor — Anniversary Gala at ITC Grand Central",             hoursAgo: 36  },
    { action: "INQUIRY_CONTACTED",  description: "Contacted Amit Joshi regarding Engagement Ceremony at The Oberoi",           hoursAgo: 48  },
    { action: "INQUIRY_CONFIRMED",  description: "Confirmed Kavya Nair — Concert at Jio World Garden",                         hoursAgo: 72  },
    { action: "INQUIRY_CONTACTED",  description: "Contacted Rohan Kapoor regarding Corporate Gala at Hyatt Regency Pune",      hoursAgo: 96  },
    { action: "EVENT_CREATED",      description: "Created manual event: Venue Site Visit — Taj",                               hoursAgo: 100 },
    { action: "INQUIRY_CONFIRMED",  description: "Confirmed Ishaan Verma — College Fest at IIT Bombay",                        hoursAgo: 144 },
    { action: "INQUIRY_CONFIRMED",  description: "Confirmed Vikram Singh — Product Launch at WeWork BKC",                      hoursAgo: 168 },
    { action: "PROFILE_UPDATED",    description: "Updated vendor profile — added business description",                         hoursAgo: 200 },
    { action: "INQUIRY_REJECTED",   description: "Rejected Farhan Sheikh — schedule conflict with another event",               hoursAgo: 240 },
    { action: "INQUIRY_CONFIRMED",  description: "Confirmed Ananya Reddy — Fashion Show at NSCI Dome",                         hoursAgo: 288 },
    { action: "INQUIRY_CONTACTED",  description: "Contacted Meera Iyer regarding Baby Shower event",                           hoursAgo: 310 },
  ];

  for (const a of activities) {
    const createdAt = new Date(now.getTime() - a.hoursAgo * 60 * 60 * 1000);
    await prisma.activityLog.create({ data: { vendorId: user.id, action: a.action, description: a.description, createdAt } });
  }

  console.log("✅ Seeding complete!");
  console.log("   📦 16 inquiries  (6 confirmed-future, 3 confirmed-past, 3 contacted, 3 new, 1 rejected)");
  console.log("   📅  8 manual events");
  console.log("   📋 14 activity logs");
  console.log("");
  console.log("👤 Vendor  — vendor@starvnt.com  / Vendor@123");
  console.log("🛡  Admin   — admin@starvnt.com   / Admin@123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
