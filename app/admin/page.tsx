"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthService } from "@/services/AuthService";
import { sessionService } from "@/services/sessionServices";
import { historiqueService } from "@/services/historiqueService";
import { User } from "@/types/user";
import { HistoriqueItem, HistoriqueValueUser, HistoriqueValueCategorie, HistoriqueValueProduit } from "@/types/historique";
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();


  const [recentActivity, setRecentActivity] = useState<HistoriqueItem[]>([]);
  const [me, setMe] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userData = null;
        if (sessionStorage.getItem("user")) {
          userData = sessionService.getUser();
          setMe(userData);
        } else {
          userData = await AuthService.me();
          setMe(userData);
          sessionService.setUser(userData);
        }

        const logs = await historiqueService.getAll();
        setRecentActivity(logs);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (sessionStorage.getItem("access_token")) {
          // Optional: handle token expiry or errors silently/gracefully
          // window.location.reload(); // logic from previous code, kept if desired
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: me?.datas?.produitsCount ? me.datas.produitsCount.toString() : "0",
      change: "+12%",
      trend: "up",
      icon: Package,
    },
    {
      title: "Total Users",
      value: me?.datas?.usersCount ? me.datas.usersCount.toString() : "0",
      change: "+18%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Orders",
      value: "342",
      change: "-5%",
      trend: "down",
      icon: ShoppingCart,
    },
    {
      title: "Revenue",
      value: "$24,580",
      change: "+23%",
      trend: "up",
      icon: DollarSign,
    },
  ]

  const formatActivityLog = (activity: HistoriqueItem) => {
    let actionText = "";
    let details = "";

    switch (activity.entity) {
      case "User":
        const userVal = activity.value as HistoriqueValueUser;
        actionText = `User "${userVal.nom} ${userVal.prenom}" ${activity.action}d`; // e.g. created/updated
        details = userVal.email;
        break;
      case "Categorie":
        const catVal = activity.value as HistoriqueValueCategorie;
        actionText = `Category "${catVal.nom}" ${activity.action}d`;
        break;
      case "Produit":
        const prodVal = activity.value as HistoriqueValueProduit;
        actionText = `Product "${prodVal.nom}" ${activity.action}d`;
        break;
      default:
        actionText = `${activity.entity} ${activity.action}d`;
    }
    return { actionText, details };
  }

  if (isLoading) {
    return (
      <>Loading....</>
    )
  }
  return sessionService.isLoggedIn() ? (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const { actionText, details } = formatActivityLog(activity);
                return (
                  <div key={index} className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{actionText}</p>
                      {details && <p className="text-xs text-muted-foreground mt-1">{details}</p>}
                      {/* Timestamp is missing in API response currently */}
                      {/* <p className="text-xs text-muted-foreground mt-1">
                                by {activity.user} • {activity.time}
                            </p> */}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground">No recent activity.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    router.push("/")
  )
}
