import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Users,
  ShoppingBag,
  Bell,
  Settings,
  Menu,
  Plus,
  Eye,
  CheckCircle,
  AlertCircle,
  Timer,
  Star,
  BarChart3,
  Calendar,
  MapPin,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Navigate, redirect } from "react-router";
import ProtectedRoute from "@/lib/ProtectedRoute";

export default function BusinessDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  // Mock data
  const stats = {
    todayOrders: 47,
    todayRevenue: 1247.5,
    avgOrderValue: 26.54,
    customerSatisfaction: 4.8,
    pendingOrders: 8,
    completedOrders: 39,
  };

  const recentOrders = [
    {
      id: "QB-001",
      customer: "Sarah Johnson",
      items: "2x Burger Combo, 1x Fries",
      amount: 34.5,
      pickupTime: "12:30 PM",
      status: "preparing",
      timeLeft: "8 min",
    },
    {
      id: "QB-002",
      customer: "Mike Chen",
      items: "1x Pizza Margherita",
      amount: 18.99,
      pickupTime: "12:45 PM",
      status: "ready",
      timeLeft: "Ready",
    },
    {
      id: "QB-003",
      customer: "Emma Davis",
      items: "3x Tacos, 1x Drink",
      amount: 22.75,
      pickupTime: "1:00 PM",
      status: "pending",
      timeLeft: "15 min",
    },
    {
      id: "QB-004",
      customer: "John Smith",
      items: "1x Salad Bowl, 1x Smoothie",
      amount: 16.5,
      pickupTime: "1:15 PM",
      status: "pending",
      timeLeft: "25 min",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="w-4 h-4" />;
      case "preparing":
        return <Timer className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const { loading, logoutUser, user } = useAuthStore();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        {loading ? (
          <div className="h-screen flex flex-col justify-center items-center">
            <img
              src="foodly_logo-removebg-preview.png"
              width={300}
              height={300}
              className="animate-pulse"
            />
            <Loader2 className="animate-spin mb-5" color="orange" size={50} />
            <p>Hold on! We are setting you up...</p>
          </div>
        ) : (
          <>
            <header className="bg-white border-b sticky top-0 z-50">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src="foodly_logo-removebg-preview.png"
                      width={70}
                      height={70}
                    />
                    <span className="text-xl font-bold text-gray-900 -ml-3">
                      Business
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Online
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="/placeholder.svg?height=32&width=32"
                            alt="Restaurant"
                          />
                          <AvatarFallback>
                            {user?.firstname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{`${user?.firstname} ${user?.lastname}`}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Team</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logoutUser}>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>

            <div className="flex">
              {/* Sidebar */}
              <aside className="w-64 bg-white border-r min-h-screen p-6">
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start bg-orange-50 text-orange-600"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Menu className="mr-2 h-4 w-4" />
                    Menu Management
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Customers
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </aside>

              {/* Main Content */}
              <main className="flex-1 p-6">
                {/* Welcome Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        Good morning, {`${user?.firstname} ${user?.lastname}`}!
                        👋
                      </h1>
                      <p className="text-gray-600 mt-1">
                        Here's what's happening with your restaurant today.
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Today
                      </Button>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Menu Item
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Today's Orders
                      </CardTitle>
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.todayOrders}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +12% from yesterday
                        </span>
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Today's Revenue
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${stats.todayRevenue.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +8% from yesterday
                        </span>
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Avg Order Value
                      </CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${stats.avgOrderValue.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-red-600 flex items-center">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          -2% from yesterday
                        </span>
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Customer Rating
                      </CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.customerSatisfaction}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +0.2 from last week
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Orders */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>
                              Manage your incoming orders
                            </CardDescription>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View All
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentOrders.map((order) => (
                            <div
                              key={order.id}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex items-center space-x-4">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <p className="font-medium">
                                      {order.customer}
                                    </p>
                                    <Badge
                                      className={getStatusColor(order.status)}
                                    >
                                      {getStatusIcon(order.status)}
                                      <span className="ml-1 capitalize">
                                        {order.status}
                                      </span>
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {order.items}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Pickup: {order.pickupTime}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  ${order.amount.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {order.timeLeft}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Stats & Actions */}
                  <div className="space-y-6">
                    {/* Order Status Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                        <CardDescription>
                          Current order pipeline
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">Pending</span>
                          </div>
                          <span className="font-semibold">
                            {stats.pendingOrders}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm">Preparing</span>
                          </div>
                          <span className="font-semibold">3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Ready</span>
                          </div>
                          <span className="font-semibold">2</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            <span className="text-sm">Completed</span>
                          </div>
                          <span className="font-semibold">
                            {stats.completedOrders}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Peak Hours */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Peak Hours Today</CardTitle>
                        <CardDescription>
                          Busiest times for orders
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>12:00 PM - 1:00 PM</span>
                              <span>18 orders</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>6:00 PM - 7:00 PM</span>
                              <span>15 orders</span>
                            </div>
                            <Progress value={70} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>7:00 PM - 8:00 PM</span>
                              <span>12 orders</span>
                            </div>
                            <Progress value={55} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button
                          className="w-full justify-start bg-transparent"
                          variant="outline"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Menu Item
                        </Button>
                        <Button
                          className="w-full justify-start bg-transparent"
                          variant="outline"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Update Hours
                        </Button>
                        <Button
                          className="w-full justify-start bg-transparent"
                          variant="outline"
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Analytics
                        </Button>
                        <Button
                          className="w-full justify-start bg-transparent"
                          variant="outline"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Update Location
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </main>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
