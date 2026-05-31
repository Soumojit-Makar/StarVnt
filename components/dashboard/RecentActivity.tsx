// components/dashboard/RecentActivity.tsx
import { formatDate } from "@/lib/utils";
import { Activity, CheckCircle2, XCircle, Phone, Star, User } from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  createdAt: Date;
}

function getActivityIcon(action: string) {
  if (action.includes("CONFIRMED")) return { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" };
  if (action.includes("REJECTED")) return { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" };
  if (action.includes("CONTACTED")) return { icon: Phone, color: "text-amber-400", bg: "bg-amber-500/10" };
  if (action.includes("PROFILE")) return { icon: User, color: "text-violet-400", bg: "bg-violet-500/10" };
  if (action.includes("RECEIVED")) return { icon: Star, color: "text-blue-400", bg: "bg-blue-500/10" };
  return { icon: Activity, color: "text-white/50", bg: "bg-white/5" };
}

export default function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-white">Recent Activity</h3>
        <span className="text-xs text-white/30 font-medium">{activities.length} events</span>
      </div>

      {activities.length === 0 ? (
        <div className="py-12 text-center">
          <Activity size={32} className="text-white/15 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.map((activity, i) => {
            const { icon: Icon, color, bg } = getActivityIcon(activity.action);
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={14} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 leading-snug">{activity.description}</p>
                  <p className="text-xs text-white/30 mt-1">{formatDate(activity.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
