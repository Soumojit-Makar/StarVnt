// components/dashboard/ProfileForm.tsx
"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { updateVendorProfile } from "@/lib/actions";
import { Save, Loader2, User, Building2, MapPin, Mail, Phone, FileText, Image } from "lucide-react";

const CATEGORIES = [
  "Full Event Management",
  "Wedding Planner",
  "Corporate Events",
  "Entertainment & Shows",
  "Concert & Music Events",
  "DJ & Audio Services",
  "Photography & Videography",
  "Catering & Food",
  "Decor & Styling",
  "Other",
];

interface ProfileFormProps {
  defaults: {
    vendorName: string;
    category: string;
    location: string;
    email: string;
    phone: string;
    description: string;
    imageUrl: string;
  };
}

export default function ProfileForm({ defaults }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState(defaults);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateVendorProfile(fd);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Profile updated successfully!");
      }
    });
  }

  const fields = [
    {
      name: "vendorName",
      label: "Vendor / Business Name",
      type: "text",
      placeholder: "e.g. StarVnt Entertainment",
      icon: User,
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "vendor@starvnt.com",
      icon: Mail,
      required: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "+91 98765 43210",
      icon: Phone,
    },
    {
      name: "location",
      label: "Location / City",
      type: "text",
      placeholder: "Mumbai, Maharashtra",
      icon: MapPin,
      required: true,
    },
    {
      name: "imageUrl",
      label: "Profile Image URL",
      type: "url",
      placeholder: "https://example.com/image.jpg",
      icon: Image,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h3 className="font-display font-semibold text-white mb-6">Edit Information</h3>

      <div className="space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="label">{field.label}</label>
            <div className="relative">
              <field.icon
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              />
              <input
                type={field.type}
                name={field.name}
                value={values[field.name as keyof typeof values]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                className="input pl-9"
              />
            </div>
          </div>
        ))}

        {/* Category */}
        <div>
          <label className="label">Category</label>
          <div className="relative">
            <Building2
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none z-10"
            />
            <select
              name="category"
              value={values.category}
              onChange={handleChange}
              required
              className="input pl-9 appearance-none"
              style={{ backgroundColor: "#111111", colorScheme: "dark" }}
            >
              <option value="" style={{ background: "#1a1a1a", color: "#fff" }}>
                Select a category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} style={{ background: "#1a1a1a", color: "#fff" }}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label">Business Description</label>
          <div className="relative">
            <FileText
              size={14}
              className="absolute left-3.5 top-3.5 text-white/30 pointer-events-none"
            />
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Describe your business, services, and expertise…"
              rows={4}
              className="input pl-9 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center gap-3">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save size={14} />
              Save Profile
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setValues(defaults)}
          className="btn-secondary"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
