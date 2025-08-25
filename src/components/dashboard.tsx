import { Link } from "react-router-dom"
import { useState } from "react"
import {
  Home,
  Users,
  Bell,
  User,
  Search,
  MoreHorizontal,
  Menu,
  ChevronRight,
  FolderOpen,
  CheckSquare,
  BarChart3,
  Calendar,
  Bug,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts"
import TeamManagement from "./team-management"
import ProjectManagement from "./project-management"
import TaskAssignment from "./task-assignment"
import ProgressMonitoring from "./progress-monitoring"
import IssueTracking from "./issue-tracking"
import ScheduleManagement from "./schedule-management"

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKey, setSelectedKey] = useState("1")

  const menuItems = [
    {
      key: "1",
      icon: Home,
      label: "Dashboard",
      section: "overview",
    },
    {
      key: "2",
      icon: FolderOpen,
      label: "Projects",
      section: "projects",
    },
    {
      key: "3",
      icon: Users,
      label: "Team",
      section: "teamManagement",
    },
    {
      key: "4",
      icon: CheckSquare,
      label: "Tasks",
      section: "projects",
    },
    {
      key: "5",
      icon: BarChart3,
      label: "Progress",
      section: "projects",
    },
    {
      key: "6",
      icon: Calendar,
      label: "Schedule",
      section: "teamManagement",
    },
    {
      key: "7",
      icon: Bug,
      label: "Issues",
      section: "teamManagement",
    },
  ]

  const taskStatusData = [
    { name: "Completed", value: 156, color: "#10B981" },
    { name: "In Progress", value: 48, color: "#3B82F6" },
    { name: "To Do", value: 32, color: "#F59E0B" },
    { name: "Review", value: 18, color: "#EF4444" },
  ]

  const progressData = [
    { month: "Jan", completed: 45, planned: 50, efficiency: 90 },
    { month: "Feb", completed: 52, planned: 55, efficiency: 95 },
    { month: "Mar", completed: 48, planned: 60, efficiency: 80 },
    { month: "Apr", completed: 30, planned: 65, efficiency: 94 },
    { month: "May", completed: 55, planned: 58, efficiency: 95 },
    { month: "Jun", completed: 67, planned: 70, efficiency: 96 },
  ]

  const renderDashboardContent = () => (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-blue-800">12</div>
              <div className="text-gray-400 text-lg font-bold">Active Projects</div>
            </div>
            <button className="p-1">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <button className="text-red-500 text-sm font-medium hover:text-red-600">View</button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-purple-600">48</div>
              <div className="text-gray-400 font-bold text-lg">Tasks in Progress</div>
            </div>
            <button className="p-1">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <button className="text-red-500 text-sm font-medium hover:text-red-600">View</button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-green-600">156</div>
              <div className="text-gray-400 text-lg font-bold">Completed Tasks</div>
            </div>
            <button className="p-1">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <button className="text-red-500 text-sm font-medium hover:text-red-600">View</button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-yellow-600">8</div>
              <div className="text-gray-400 font-bold text-lg">Team Members</div>
            </div>
            <button className="p-1">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <button className="text-red-500 text-sm font-medium hover:text-red-600">View</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Project Progress Tracking</h3>
            <button className="p-1">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value, name) => [`${value} tasks`, name === "completed" ? "Completed" : "Planned"]}
                />
                <Area
                  type="monotone"
                  dataKey="planned"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#plannedGradient)"
                  name="planned"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#completedGradient)"
                  name="completed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Completed Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Planned Tasks</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm ">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Task Status</h3>
            <button className="p-1">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} tasks`, name]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color, fontSize: "12px" }}>
                      {value}: {entry.payload.value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg p-6 shadow-sm ">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                <Link to='#projects'>View All</Link>
                </button>
          </div>
          <div className="space-y-4">
            {[
              { name: "Website Redesign", progress: 75, team: 4, status: "In Progress" },
              { name: "Mobile App Development", progress: 45, team: 6, status: "In Progress" },
              { name: "Marketing Campaign", progress: 90, team: 3, status: "Review" },
            ].map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold text-md text-gray-900 p-2">{project.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Progress: {project.progress}% • Team: {project.team} members
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    project.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm ">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Team Activity</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { user: "Sarah Chen", action: 'completed task "UI Design Review"', time: "2 hours ago" },
              { user: "Mike Johnson", action: 'created new project "API Integration"', time: "4 hours ago" },
              { user: "Emma Davis", action: 'updated deadline for "Testing Phase"', time: "6 hours ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-md bg-gray-50">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">
                    <span className="font-semibold ">{activity.user}</span> {activity.action}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return renderDashboardContent()
      case "2":
        return <ProjectManagement />
      case "3":
        return <TeamManagement />
      case "4":
        return <TaskAssignment />
      case "5":
        return <ProgressMonitoring />
      case "6":
        return <ScheduleManagement />
      case "7":
        return <IssueTracking />
      default:
        return renderDashboardContent()
    }
  }

  const adminItems = menuItems.filter((item) => item.section === "overview")
  const blogItems = menuItems.filter((item) => item.section === "projects")
  const personalItems = menuItems.filter((item) => item.section === "teamManagement")

  return (
    <div className="flex h-screen bg-gray-50 ">
      <div className={`bg-amber-50  transition-all duration-300 ${collapsed ? "w-24" : "w-72"}`}>
        <div className="px-6 border-xl border-gray-800 ">
          <div className="flex items-center py-4 gap-3 border-b">
            <div className="text-black  px-2 py-1 rounded text-3xl font-bold">{collapsed ? "TS" : "Task"}</div>
            {!collapsed && <div className="text-red-500  px-2 py-1 rounded text-3xl font-bold">MG</div>}
          </div>
        </div>

        <nav
          className="p-4
         bg-amber-50 
         h-full px-6 z-20"
        >
          <div className="mb-6">
            <div className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-3 pt-2">
              {collapsed ? "" : "overview"}
            </div>
            <div className="space-y-1">
              {adminItems.map((item) => {
                const Icon = item.icon
                const isActive = selectedKey === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => setSelectedKey(item.key)}
                    className={`w-full flex items-center gap-5
                      px-3 py-2 rounded-lg   text-left transition-colors ${
                        isActive ? "bg-gray-100 text-gray-900" : "text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.hasSubmenu && <ChevronRight className="w-4 h-4" />}
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-3">
              {collapsed ? "" : "projects"}
            </div>
            <div className="space-y-1">
              {blogItems.map((item) => {
                const Icon = item.icon
                const isActive = selectedKey === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => setSelectedKey(item.key)}
                    className={`w-full flex items-center gap-5 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.hasSubmenu && <ChevronRight className="w-4 h-4" />}
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-3">
              {collapsed ? "" : "team Management"}
            </div>
            <div className="space-y-1">
              {personalItems.map((item) => {
                const Icon = item.icon
                const isActive = selectedKey === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => setSelectedKey(item.key)}
                    className={`w-full flex items-center gap-5 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          typeof item.badge === "number" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-amber-50 z-20 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-8 h-7 text-gray-600" />
            </button>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">John Doe</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}
