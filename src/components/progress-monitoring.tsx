"use client"

import { useState } from "react"
import {
  Card,
  Row,
  Col,
  Typography,
  Progress,
  Table,
  Tag,
  Avatar,
  Select,
  DatePicker,
  Alert,
  Statistic,
  Timeline,
  Tabs,
} from "antd"
import {
  CalendarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  TeamOutlined,
  WarningOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

interface ProgressData {
  projects: {
    id: string
    name: string
    progress: number
    deadline: string
    status: "on-track" | "at-risk" | "delayed"
    tasksCompleted: number
    totalTasks: number
    teamSize: number
  }[]
  tasks: {
    id: string
    title: string
    project: string
    assignee: string
    progress: number
    deadline: string
    status: "on-track" | "at-risk" | "overdue"
    priority: "low" | "medium" | "high" | "critical"
  }[]
  teamPerformance: {
    member: string
    tasksCompleted: number
    tasksInProgress: number
    averageCompletionTime: number
    onTimeDelivery: number
  }[]
  deadlines: {
    id: string
    title: string
    type: "project" | "task"
    deadline: string
    daysRemaining: number
    status: "upcoming" | "due-today" | "overdue"
    assignee?: string
  }[]
}

const mockProgressData: ProgressData = {
  projects: [
    {
      id: "1",
      name: "Website Redesign",
      progress: 75,
      deadline: "2024-03-30",
      status: "on-track",
      tasksCompleted: 18,
      totalTasks: 24,
      teamSize: 4,
    },
    {
      id: "2",
      name: "Mobile App Development",
      progress: 45,
      deadline: "2024-06-15",
      status: "at-risk",
      tasksCompleted: 22,
      totalTasks: 48,
      teamSize: 6,
    },
    {
      id: "3",
      name: "Marketing Campaign",
      progress: 90,
      deadline: "2024-05-31",
      status: "on-track",
      tasksCompleted: 14,
      totalTasks: 16,
      teamSize: 3,
    },
    {
      id: "4",
      name: "Database Migration",
      progress: 15,
      deadline: "2024-07-30",
      status: "delayed",
      tasksCompleted: 5,
      totalTasks: 32,
      teamSize: 2,
    },
  ],
  tasks: [
    {
      id: "1",
      title: "Design Homepage Layout",
      project: "Website Redesign",
      assignee: "Emma Davis",
      progress: 80,
      deadline: "2024-02-15",
      status: "on-track",
      priority: "high",
    },
    {
      id: "2",
      title: "Implement User Authentication",
      project: "Mobile App Development",
      assignee: "Mike Johnson",
      progress: 30,
      deadline: "2024-02-20",
      status: "at-risk",
      priority: "critical",
    },
    {
      id: "3",
      title: "Create Marketing Copy",
      project: "Marketing Campaign",
      assignee: "Emma Davis",
      progress: 100,
      deadline: "2024-02-10",
      status: "on-track",
      priority: "medium",
    },
    {
      id: "4",
      title: "Database Schema Design",
      project: "Database Migration",
      assignee: "Alex Rodriguez",
      progress: 100,
      deadline: "2024-01-30",
      status: "overdue",
      priority: "high",
    },
  ],
  teamPerformance: [
    {
      member: "Sarah Chen",
      tasksCompleted: 45,
      tasksInProgress: 8,
      averageCompletionTime: 3.2,
      onTimeDelivery: 92,
    },
    {
      member: "Mike Johnson",
      tasksCompleted: 38,
      tasksInProgress: 12,
      averageCompletionTime: 4.1,
      onTimeDelivery: 85,
    },
    {
      member: "Emma Davis",
      tasksCompleted: 32,
      tasksInProgress: 6,
      averageCompletionTime: 2.8,
      onTimeDelivery: 95,
    },
    {
      member: "Alex Rodriguez",
      tasksCompleted: 28,
      tasksInProgress: 4,
      averageCompletionTime: 3.5,
      onTimeDelivery: 88,
    },
  ],
  deadlines: [
    {
      id: "1",
      title: "Design Homepage Layout",
      type: "task",
      deadline: "2024-02-15",
      daysRemaining: 2,
      status: "upcoming",
      assignee: "Emma Davis",
    },
    {
      id: "2",
      title: "User Authentication Implementation",
      type: "task",
      deadline: "2024-02-13",
      daysRemaining: 0,
      status: "due-today",
      assignee: "Mike Johnson",
    },
    {
      id: "3",
      title: "Website Redesign Project",
      type: "project",
      deadline: "2024-03-30",
      daysRemaining: 45,
      status: "upcoming",
    },
    {
      id: "4",
      title: "Database Schema Review",
      type: "task",
      deadline: "2024-02-10",
      daysRemaining: -3,
      status: "overdue",
      assignee: "Alex Rodriguez",
    },
  ],
}

export default function ProgressMonitoring() {
  const [progressData] = useState<ProgressData>(mockProgressData)
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("week")
  const [selectedProject, setSelectedProject] = useState<string>("all")

  const getStatusColor = (status: string) => {
    const colors = {
      "on-track": "green",
      "at-risk": "orange",
      delayed: "red",
      overdue: "red",
      "due-today": "orange",
      upcoming: "blue",
    }
    return colors[status as keyof typeof colors] || "default"
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      "on-track": <CheckCircleOutlined />,
      "at-risk": <ExclamationCircleOutlined />,
      delayed: <WarningOutlined />,
      overdue: <WarningOutlined />,
      "due-today": <ClockCircleOutlined />,
      upcoming: <CalendarOutlined />,
    }
    return icons[status as keyof typeof icons] || <ClockCircleOutlined />
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "green",
      medium: "blue",
      high: "orange",
      critical: "red",
    }
    return colors[priority as keyof typeof colors] || "default"
  }

  const projectColumns = [
    {
      title: "Project",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div>
          <div className="font-semibold">{text}</div>
          <div className="text-sm text-muted">
            {record.tasksCompleted}/{record.totalTasks} tasks • {record.teamSize} members
          </div>
        </div>
      ),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress: number) => (
        <div className="w-32">
          <Progress percent={progress} size="small" />
          <Text className="text-xs text-muted">{progress}% complete</Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status.replace("-", " ").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (date: string) => (
        <div className="flex items-center gap-1">
          <CalendarOutlined />
          <span>{dayjs(date).format("MMM DD, YYYY")}</span>
          {/* <Text className="text-xs text-muted">({dayjs(date).fromNow()})</Text> */}
        </div>
      ),
    },
  ]

  const taskColumns = [
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <div>
          <div className="font-semibold">{text}</div>
          <div className="text-sm text-muted">{record.project}</div>
        </div>
      ),
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      key: "assignee",
      render: (assignee: string) => (
        <div className="flex items-center gap-2">
          <Avatar size="small" icon={<TeamOutlined />} />
          <span className="text-sm">{assignee}</span>
        </div>
      ),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress: number) => (
        <div className="w-24">
          <Progress percent={progress} size="small" />
        </div>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => <Tag color={getPriorityColor(priority)}>{priority.toUpperCase()}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status.replace("-", " ").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (date: string) => (
        <div className="text-sm">
          {dayjs(date).format("MMM DD")}
          {/* <div className="text-xs text-muted">{dayjs(date).fromNow()}</div> */}
        </div>
      ),
    },
  ]

  const teamPerformanceColumns = [
    {
      title: "Team Member",
      dataIndex: "member",
      key: "member",
      render: (member: string) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<TeamOutlined />} />
          <span className="font-semibold">{member}</span>
        </div>
      ),
    },
    {
      title: "Completed",
      dataIndex: "tasksCompleted",
      key: "tasksCompleted",
      render: (count: number) => <Text className="font-semibold text-chart-3">{count}</Text>,
    },
    {
      title: "In Progress",
      dataIndex: "tasksInProgress",
      key: "tasksInProgress",
      render: (count: number) => <Text className="font-semibold text-secondary">{count}</Text>,
    },
    {
      title: "Avg. Completion Time",
      dataIndex: "averageCompletionTime",
      key: "averageCompletionTime",
      render: (time: number) => <Text>{time} days</Text>,
    },
    {
      title: "On-Time Delivery",
      dataIndex: "onTimeDelivery",
      key: "onTimeDelivery",
      render: (percentage: number) => (
        <div className="flex items-center gap-2">
          <Progress percent={percentage} size="small" className="w-16" />
          <Text className="text-sm">{percentage}%</Text>
        </div>
      ),
    },
  ]

  const renderOverviewCards = () => (
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={24} sm={12} lg={6}>
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary mb-2">{progressData.projects.length}</div>
          <Text className="text-muted">Active Projects</Text>
          <div className="mt-2">
            <Text className="text-xs text-chart-3">
              {progressData.projects.filter((p) => p.status === "on-track").length} on track
            </Text>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="text-center">
          <div className="text-2xl font-bold text-secondary mb-2">
            {progressData.tasks.filter((t) => t.status !== "overdue").length}
          </div>
          <Text className="text-muted">Tasks On Track</Text>
          <div className="mt-2">
            <Text className="text-xs text-chart-5">
              {progressData.tasks.filter((t) => t.status === "overdue").length} overdue
            </Text>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="text-center">
          <div className="text-2xl font-bold text-chart-3 mb-2">
            {Math.round(progressData.projects.reduce((sum, p) => sum + p.progress, 0) / progressData.projects.length)}%
          </div>
          <Text className="text-muted">Avg. Progress</Text>
          <div className="mt-2">
            <Progress
              percent={Math.round(
                progressData.projects.reduce((sum, p) => sum + p.progress, 0) / progressData.projects.length,
              )}
              size="small"
              className="w-16"
            />
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="text-center">
          <div className="text-2xl font-bold text-chart-4 mb-2">
            {progressData.deadlines.filter((d) => d.status === "upcoming" && d.daysRemaining <= 7).length}
          </div>
          <Text className="text-muted">Due This Week</Text>
          <div className="mt-2">
            <Text className="text-xs text-chart-5">
              {progressData.deadlines.filter((d) => d.status === "overdue").length} overdue
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  )

  const renderDeadlineAlerts = () => {
    const criticalDeadlines = progressData.deadlines.filter(
      (d) => d.status === "due-today" || d.status === "overdue" || (d.status === "upcoming" && d.daysRemaining <= 3),
    )

    if (criticalDeadlines.length === 0) return null

    return (
      <Card className="mb-6">
        <Title level={4} className="!mb-4">
          Deadline Alerts
        </Title>
        <div className="space-y-3">
          {criticalDeadlines.map((deadline) => (
            <Alert
              key={deadline.id}
              type={deadline.status === "overdue" ? "error" : deadline.status === "due-today" ? "warning" : "info"}
              message={
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold">{deadline.title}</span>
                    {deadline.assignee && <span className="text-muted"> - {deadline.assignee}</span>}
                  </div>
                  <div className="text-sm">
                    {deadline.status === "overdue"
                      ? `${Math.abs(deadline.daysRemaining)} days overdue`
                      : deadline.status === "due-today"
                        ? "Due today"
                        : `Due in ${deadline.daysRemaining} days`}
                  </div>
                </div>
              }
              showIcon
            />
          ))}
        </div>
      </Card>
    )
  }

  const renderProgressTimeline = () => (
    <Card>
      <Title level={4} className="!mb-4">
        Project Timeline
      </Title>
      <Timeline>
        {progressData.projects
          .sort((a, b) => dayjs(a.deadline).unix() - dayjs(b.deadline).unix())
          .map((project) => (
            <Timeline.Item key={project.id} color={getStatusColor(project.status)} dot={getStatusIcon(project.status)}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{project.name}</div>
                  <div className="text-sm text-muted">
                    {project.tasksCompleted}/{project.totalTasks} tasks completed
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{dayjs(project.deadline).format("MMM DD, YYYY")}</div>
                  {/* <div className="text-xs text-muted">{dayjs(project.deadline).fromNow()}</div> */}
                </div>
              </div>
              <Progress percent={project.progress} size="small" className="mt-2" />
            </Timeline.Item>
          ))}
      </Timeline>
    </Card>
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={1} className="!mb-2">
            Progress Monitoring & Deadlines
          </Title>
          <Text className="text-muted">Track project progress, monitor deadlines, and analyze team performance</Text>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onChange={setSelectedTimeRange} style={{ width: 120 }}>
            <Option value="week">This Week</Option>
            <Option value="month">This Month</Option>
            <Option value="quarter">This Quarter</Option>
          </Select>
          <Select value={selectedProject} onChange={setSelectedProject} style={{ width: 150 }}>
            <Option value="all">All Projects</Option>
            {progressData.projects.map((project) => (
              <Option key={project.id} value={project.id}>
                {project.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {renderOverviewCards()}
      {renderDeadlineAlerts()}

      <Tabs defaultActiveKey="projects">
        <TabPane tab="Project Progress" key="projects">
          <Card>
            <Table
              columns={projectColumns}
              dataSource={progressData.projects}
              rowKey="id"
              pagination={false}
              className="mb-6"
            />
          </Card>
        </TabPane>

        <TabPane tab="Task Progress" key="tasks">
          <Card>
            <Table columns={taskColumns} dataSource={progressData.tasks} rowKey="id" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>

        <TabPane tab="Team Performance" key="performance">
          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Card>
                <Table
                  columns={teamPerformanceColumns}
                  dataSource={progressData.teamPerformance}
                  rowKey="member"
                  pagination={false}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="mb-4">
                <Statistic
                  title="Team Productivity"
                  value={Math.round(
                    progressData.teamPerformance.reduce((sum, member) => sum + member.onTimeDelivery, 0) /
                      progressData.teamPerformance.length,
                  )}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                />
              </Card>
              <Card>
                <Statistic
                  title="Average Completion Time"
                  value={
                    Math.round(
                      (progressData.teamPerformance.reduce((sum, member) => sum + member.averageCompletionTime, 0) /
                        progressData.teamPerformance.length) *
                        10,
                    ) / 10
                  }
                  suffix="days"
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Timeline" key="timeline">
          <Row gutter={16}>
            <Col span={16}>{renderProgressTimeline()}</Col>
            <Col span={8}>
              <Card>
                <Title level={4} className="!mb-4">
                  Upcoming Deadlines
                </Title>
                <div className="space-y-3">
                  {progressData.deadlines
                    .filter((d) => d.status === "upcoming")
                    .sort((a, b) => a.daysRemaining - b.daysRemaining)
                    .slice(0, 5)
                    .map((deadline) => (
                      <div key={deadline.id} className="flex items-center justify-between p-3 bg-card rounded-lg">
                        <div>
                          <div className="font-semibold text-sm">{deadline.title}</div>
                          {deadline.assignee && <div className="text-xs text-muted">{deadline.assignee}</div>}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{deadline.daysRemaining} days</div>
                          <div className="text-xs text-muted">{dayjs(deadline.deadline).format("MMM DD")}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  )
}
