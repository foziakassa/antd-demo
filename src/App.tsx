

import { useState } from "react"
import { Layout, Menu, Card, Button, Typography, Space, Badge, Avatar, Dropdown } from "antd"
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  CalendarOutlined,
  BugOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  PlusOutlined,
  CheckSquareOutlined,
  BarChartOutlined,

  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons"
import TeamManagement from "./components/team-management"
import ProjectManagement from "./components/project-management"
import TaskAssignment from "./components/task-assignment"
import ProgressMonitoring from "./components/progress-monitoring"
import IssueTracking from "./components/issue-tracking"
import ScheduleManagement from "./components/schedule-management"
import React from "react"

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKey, setSelectedKey] = useState("1")

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "2",
      icon: <ProjectOutlined />,
      label: "Projects",
    },
    {
      key: "3",
      icon: <TeamOutlined />,
      label: "Team",
    },
    {
      key: "4",
      icon: <CheckSquareOutlined />,
      label: "Tasks",
    },
    {
      key: "5",
      icon: <BarChartOutlined />,
      label: "Progress",
    },
    {
      key: "6",
      icon: <CalendarOutlined />,
      label: "Schedule",
    },
    {
      key: "7",
      icon: <BugOutlined />,
      label: "Issues",
    },
  ]

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ]

  const renderDashboardContent = () => (
    <div className="p-6">

      {/* welcom */}
      <div className="mb-6">
        <Title level={1} className="!mb-2">
          Welcome back, John!
        </Title>
        <h1 className="text-red-950 text-xl">nnn</h1>
        <p className="text-red-600">mmm</p>
        <Text className="text-muted">Here's what's happening with your projects today.</Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center bg-white">
          <div className="text-2xl font-bold text-primary mb-2">12</div>
          <Text className=" text-lg">Active Projects</Text>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-secondary mb-2">48</div>
          <Text className="text-xl">Tasks in Progress</Text>
          <p></p>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-chart-3 mb-2">156</div>
          <Text className="text-muted">Completed Tasks</Text>
        </Card>
        <Card className="text-center ">
          <div className="text-2xl font-bold text-chart-4 mb-2">8</div>
          <Text className="text-muted">Team Members</Text>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Projects" extra={<Button type="link">View All</Button>}>
          <div className="space-y-4">
            {[
              { name: "Website Redesign", progress: 75, team: 4, status: "In Progress" },
              { name: "Mobile App Development", progress: 45, team: 6, status: "In Progress" },
              { name: "Marketing Campaign", progress: 90, team: 3, status: "Review" },
            ].map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold">{project.name}</div>
                  <div className="text-sm text-muted mt-1">
                    Progress: {project.progress}% • Team: {project.team} members
                  </div>
                </div>
                <Badge status={project.status === "In Progress" ? "processing" : "success"} text={project.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Team Activity" extra={<Button type="link">View All</Button>}>
          <div className="space-y-4">
            {[
              { user: "Sarah Chen", action: 'completed task "UI Design Review"', time: "2 hours ago" },
              { user: "Mike Johnson", action: 'created new project "API Integration"', time: "4 hours ago" },
              { user: "Emma Davis", action: 'updated deadline for "Testing Phase"', time: "6 hours ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <Avatar size="small" icon={<UserOutlined />} />
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </div>
                  <div className="text-xs text-muted mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
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

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="!bg-sidebar border-r border-sidebar-border"
        width={240}
      >
        <div className="p-4">
          {/* <Title level={3} className="text-white !important">
            {collapsed ? "TF" : "TaskFlow"}
            
          </Title> */}
         <p className="text-center text-2xl font-bold text-white">
         {collapsed ? "TF" : "TaskFlow"}

         </p>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }:any) => setSelectedKey(key)}
          className="border-r-0"
        />
      </Sider>

      <Layout>
        <Header className="!bg-background border-b border-border !px-6 flex items-center justify-between">
          {/* <Button type="text" onClick={() => setCollapsed(!collapsed)} className="!text-foreground">
            {collapsed ? "→" : "←"}
          </Button> */}
          <Button type="text" onClick={() => setCollapsed(!collapsed)} className="text-red-950 text-3xl">
    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
  </Button>

          <Space size="middle">
            <Button type="primary" icon={<PlusOutlined />}>
              New Task
            </Button>
            <Badge count={5}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} className="cursor-pointer" />
            </Dropdown>
          </Space>
        </Header>

        <Content className="!bg-background">{renderContent()}</Content>
      </Layout>
    </Layout>
  )
}
