// components/dashboard/SettingsPanel.tsx
"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  User, Mail, Lock, Bell, Shield, Trash2,
  Eye, EyeOff, Loader2, Save, CheckCircle2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  email: string;
  name: string;
  vendorName: string;
  memberSince: Date;
}

export default function SettingsPanel({ email, name, vendorName, memberSince }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);
  const [notifications, setNotifications] = useState({
    newInquiry: true,
    statusChange: true,
    weeklyReport: false,
    marketing: false,
  });

  function handleNotifToggle(key: keyof typeof notifications) {
    setNotifications((n) => ({ ...n, [key]: !n[key] }));
    toast.success("Preference saved");
  }

  function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Password updated successfully");
    });
  }

  const sections = [
    {
      id: "account",
      icon: User,
      title: "Account Information",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      id: "security",
      icon: Lock,
      title: "Password & Security",
      color: "text-brand-400",
      bg: "bg-brand-500/10",
      border: "border-brand-500/20",
    },
    {
      id: "notifications",
      icon: Bell,
      title: "Notifications",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      id: "danger",
      icon: Shield,
      title: "Account & Data",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 max-w-5xl">
      {/* Sidebar nav */}
      <nav className="lg:col-span-1 space-y-1">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.04] transition-all"
          >
            <div className={`w-7 h-7 ${s.bg} border ${s.border} rounded-lg flex items-center justify-center shrink-0`}>
              <s.icon size={13} className={s.color} />
            </div>
            {s.title}
          </a>
        ))}
      </nav>

      {/* Content */}
      <div className="lg:col-span-3 space-y-5">
        {/* Account info */}
        <div id="account" className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center">
              <User size={16} className="text-violet-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">Account Information</h3>
              <p className="text-xs text-white/35">Read-only summary of your account</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", value: name, icon: User },
              { label: "Email Address", value: email, icon: Mail },
              { label: "Vendor Name", value: vendorName, icon: Shield },
              { label: "Member Since", value: formatDate(memberSince), icon: CheckCircle2 },
            ].map((f) => (
              <div key={f.label} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <f.icon size={12} className="text-white/30" />
                  <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">{f.label}</p>
                </div>
                <p className="text-sm font-medium text-white/80">{f.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/25 mt-4">
            To update your name or email, visit{" "}
            <a href="/dashboard/profile" className="text-brand-400 hover:text-brand-300 transition-colors">Profile Settings</a>.
          </p>
        </div>

        {/* Password */}
        <div id="security" className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center">
              <Lock size={16} className="text-brand-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">Password & Security</h3>
              <p className="text-xs text-white/35">Update your password regularly for security</p>
            </div>
          </div>
          <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
            <div>
              <label className="label">Current Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">New Password</label>
              <input type="password" className="input" placeholder="Min. 8 characters" required minLength={8} />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input type="password" className="input" placeholder="Repeat new password" required minLength={8} />
            </div>
            <div className="pt-1">
              <button type="submit" disabled={isPending} className="btn-primary">
                {isPending ? <><Loader2 size={14} className="animate-spin" />Updating…</> : <><Save size={14} />Update Password</>}
              </button>
            </div>
          </form>
        </div>

        {/* Notifications */}
        <div id="notifications" className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <Bell size={16} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">Notification Preferences</h3>
              <p className="text-xs text-white/35">Choose what you want to be notified about</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { key: "newInquiry" as const, label: "New Inquiry Alerts", desc: "Get notified when a new inquiry is submitted" },
              { key: "statusChange" as const, label: "Status Change Updates", desc: "Alerts when inquiry status is updated" },
              { key: "weeklyReport" as const, label: "Weekly Summary Report", desc: "Receive a weekly performance digest" },
              { key: "marketing" as const, label: "Tips & Product Updates", desc: "Platform news and feature announcements" },
            ].map((n) => (
              <div key={n.key} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div>
                  <p className="text-sm font-semibold text-white">{n.label}</p>
                  <p className="text-xs text-white/35 mt-0.5">{n.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotifToggle(n.key)}
                  className={`relative w-10 h-5.5 rounded-full border transition-all shrink-0 mt-0.5 ${
                    notifications[n.key]
                      ? "bg-brand-500/30 border-brand-500/50"
                      : "bg-white/[0.05] border-white/[0.1]"
                  }`}
                  style={{ height: "22px", width: "40px" }}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
                      notifications[n.key] ? "left-5 bg-brand-400" : "left-0.5 bg-white/30"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div id="danger" className="card p-6 border-red-500/10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
              <Shield size={16} className="text-red-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">Account & Data</h3>
              <p className="text-xs text-white/35">Danger zone — irreversible actions</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/15">
              <div>
                <p className="text-sm font-semibold text-white">Export My Data</p>
                <p className="text-xs text-white/35 mt-0.5">Download all your inquiries and profile data as JSON</p>
              </div>
              <button
                onClick={() => toast.success("Export started — you'll receive it via email")}
                className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/60 hover:text-white text-xs font-medium transition-all"
              >
                Export
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/15">
              <div>
                <p className="text-sm font-semibold text-red-400">Delete Account</p>
                <p className="text-xs text-white/35 mt-0.5">Permanently delete your account and all data</p>
              </div>
              <button
                onClick={() => toast.error("Please contact support to delete your account")}
                className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-all flex items-center gap-1.5"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
