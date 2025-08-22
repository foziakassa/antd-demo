"use client"

import { useState } from "react"
import {
  Card,
  Calendar,
  Badge,
  List,
  Avatar,
  Typography,
  Row,
  Col,
  Tag,
  Button,
  Select,
  Switch,
  Tabs,
  Timeline,
  Alert,
  Divider,
} from "antd"
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons"
import dayjs, { type Dayjs } from "dayjs"

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs

interface ScheduleEvent {
  id: string
  title: string
  type: "task" | "deadline" | "meeting" | "milestone"
  date: string
  time?: string
  assignee?: string
  project: string
  priority: "low" | "medium" | "high" | "critical"
  status: "upcoming" | "in-progress" | "completed" | "overdue"
  description?: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: "task_assigned" | "deadline_reminder" | "task_completed" | "project_update" | "meeting_reminder"
  timestamp: string
  read: boolean
  actionUrl?: string
  assignee?: string
  project?: string
}

const mockScheduleEvents: ScheduleEvent[] = [
  {
    id: "1",
    title: "Design Homepage Layout",
    type: "task",
    date: "2024-02-15",
    time: "09:00",
    assignee: "Emma Davis",
    project: "Website Redesign",
    priority: "high",
    status: "upcoming",
    description: "Complete wireframes and mockups for homepage",
  },
  {
    id: "2",
    title: "Project Review Meeting",
    type: "meeting",
    date: "2024-02-16",
    time: "14:00",
    project: "Website Redesign",
    priority: "medium",
    status: "upcoming",
    description: "Weekly project review with stakeholders",
  },
  {
    id: "3",
    title: "Mobile App Beta Release",
    type: "milestone",
    date: "2024-02-20",
    project: "Mobile App Development",
    priority: "critical",
    status: "upcoming",
    description: "Beta version release to testing team",
  },
  {
    id: "4",
    title: "API Testing Deadline",
    type: "deadline",
    date: "2024-02-18",
    assignee: "Alex Rodriguez",
    project: "Mobile App Development",
    priority: "high",
    status: "upcoming",
    description: "Complete comprehensive API testing",
  },
  {
    id: "5",
    title: "Marketing Copy Review",
    type: "task",
    date: "2024-02-14",
    time: "11:00",
    assignee: "Emma Davis",
    project: "Marketing Campaign",
    priority: "medium",
    status: "completed",
    description: "Review and finalize marketing copy",
  },
]

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Task Assigned",
    message: "You have been assigned to 'Design Homepage Layout'",
    type: "task_assigned",
    timestamp: "2024-02-13T10:30:00Z",
    read: false,
    assignee: "Emma Davis",
    project: "Website Redesign",
  },
  {
    id: "2",
    title: "Deadline Reminder",
    message: "API Testing is due in 2 days",
    type: "deadline_reminder",
    timestamp: "2024-02-13T09:00:00Z",
    read: false,
    assignee: "Alex Rodriguez",
    project: "Mobile App Development",
  },
  {
    id: "3",
    title: "Task Completed",
    message: "Sarah Chen completed 'Database Schema Design'",
    type: "task_completed",
    timestamp: "2024-02-12T16:45:00Z",
    read: true,
    project: "Database Migration",
  },
  {
    id: "4",
    title: "Project Update",
    message: "Website Redesign project is now 75% complete",
    type: "project_update",
    timestamp: "2024-02-12T14:20:00Z",
    read: true,
    project: "Website Redesign",
  },
  {
    id: "5",
    title: "Meeting Reminder",
    message: "Project Review Meeting starts in 1 hour",
    type: "meeting_reminder",
    timestamp: "2024-02-12T13:00:00Z",
    read: true,
    project: "Website Redesign",
  },
]

export default function ScheduleManagement() {
  const [scheduleEvents] = useState<ScheduleEvent[]>(mockScheduleEvents)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [notificationSettings, setNotificationSettings] = useState({
    taskAssignments: true,
    deadlineReminders: true,
    projectUpdates: true,
    meetingReminders: true,
    emailNotifications: false,
  })

  const getEventTypeColor = (type: string) => {
    const colors = {
      task: "#1890ff", // blue
      deadline: "#f5222d", // red
      meeting: "#52c41a", // green
      milestone: "#722ed1", // purple
    }
    return colors[type as keyof typeof colors] || "default"
  }

  const getEventTypeIcon = (type: string) => {
    const icons = {
      task: <CheckCircleOutlined />,
      deadline: <ExclamationCircleOutlined />,
      meeting: <TeamOutlined />,
      milestone: <CalendarOutlined />,
    }
    return icons[type as keyof typeof icons] || <CalendarOutlined />
  }

  const getNotificationTypeIcon = (type: string) => {
    const icons = {
      task_assigned: <UserOutlined />,
      deadline_reminder: <ClockCircleOutlined />,
      task_completed: <CheckCircleOutlined />,
      project_update: <ExclamationCircleOutlined />,
      meeting_reminder: <TeamOutlined />,
    }
    return icons[type as keyof typeof icons] || <BellOutlined />
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "#52c41a", // green
      medium: "#1890ff", // blue
      high: "#fa8c16", // orange
      critical: "#f5222d", // red
    }
    return colors[priority as keyof typeof colors] || "default"
  }

  const getEventsForDate = (date: Dayjs) => {
    return scheduleEvents.filter((event) => dayjs(event.date).isSame(date, "day"))
  }

  const dateCellRender = (value: Dayjs) => {
    const events = getEventsForDate(value)
    return (
      <div className="space-y-1">
        {events.slice(0, 2).map((event) => (
          <Badge
            key={event.id}
            status={event.status === "completed" ? "success" : event.status === "overdue" ? "error" : "processing"}
            text={
              <span className="text-xs truncate" title={event.title}>
                {event.title.length > 15 ? `${event.title.substring(0, 15)}...` : event.title}
              </span>
            }
          />
        ))}
        {events.length > 2 && <div className="text-xs text-muted">+{events.length - 2} more</div>}
      </div>
    )
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const renderCalendarView = () => (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Title level={4} className="!mb-0">
          Schedule Calendar
        </Title>
        <Select value={viewMode} onChange={setViewMode} style={{ width: 120 }}>
          <Option value="calendar">Calendar</Option>
          <Option value="list">List View</Option>
        </Select>
      </div>
      <Calendar
        dateCellRender={dateCellRender}
        onSelect={setSelectedDate}
        onPanelChange={(value) => setSelectedDate(value)}
      />
    </Card>
  )

  const renderListView = () => (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Title level={4} className="!mb-0">
          Schedule List
        </Title>
        <Select value={viewMode} onChange={setViewMode} style={{ width: 120 }}>
          <Option value="calendar">Calendar</Option>
          <Option value="list">List View</Option>
        </Select>
      </div>
      <List
        dataSource={scheduleEvents.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())}
        renderItem={(event) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={getEventTypeIcon(event.type)} />}
              title={
                <div className="flex items-center gap-2">
                  <span>{event.title}</span>
                  <Tag icon={getEventTypeIcon(event.type)} color={getEventTypeColor(event.type)}>
                    {event.type.toUpperCase()}
                  </Tag>
                  <Tag color={getPriorityColor(event.priority)}>{event.priority.toUpperCase()}</Tag>
                </div>
              }
              description={
                <div>
                  <div className="text-sm text-muted mb-1">{event.project}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <CalendarOutlined />
                      {dayjs(event.date).format("MMM DD, YYYY")}
                    </span>
                    {event.time && (
                      <span className="flex items-center gap-1">
                        <ClockCircleOutlined />
                        {event.time}
                      </span>
                    )}
                    {event.assignee && (
                      <span className="flex items-center gap-1">
                        <UserOutlined />
                        {event.assignee}
                      </span>
                    )}
                  </div>
                  {event.description && <div className="text-sm text-muted mt-2">{event.description}</div>}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  )

  const renderSelectedDateEvents = () => {
    const events = getEventsForDate(selectedDate)

    return (
      <Card>
        <Title level={4} className="!mb-4">
          Events for {selectedDate.format("MMM DD, YYYY")}
        </Title>
        {events.length > 0 ? (
          <Timeline>
            {events
              .sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00"))
              .map((event) => (
                <Timeline.Item key={event.id} dot={getEventTypeIcon(event.type)} color={getEventTypeColor(event.type)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{event.title}</span>
                        <Tag color={getPriorityColor(event.priority)}>{event.priority}</Tag>
                      </div>
                      <div className="text-sm text-muted mb-1">{event.project}</div>
                      {event.time && (
                        <div className="text-sm flex items-center gap-1 mb-1">
                          <ClockCircleOutlined />
                          {event.time}
                        </div>
                      )}
                      {event.assignee && (
                        <div className="text-sm flex items-center gap-1 mb-1">
                          <UserOutlined />
                          {event.assignee}
                        </div>
                      )}
                      {event.description && <div className="text-sm text-muted">{event.description}</div>}
                    </div>
                  </div>
                </Timeline.Item>
              ))}
          </Timeline>
        ) : (
          <div className="text-center text-muted py-8">No events scheduled for this date</div>
        )}
      </Card>
    )
  }

  const renderNotifications = () => (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Title level={4} className="!mb-0">
          Notifications ({notifications.filter((n) => !n.read).length} unread)
        </Title>
        <Button type="link" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      <List
        dataSource={notifications.sort((a, b) => dayjs(b.timestamp).unix() - dayjs(a.timestamp).unix())}
        renderItem={(notification) => (
          <List.Item
            className={`cursor-pointer transition-colors ${!notification.read ? "bg-blue-50" : ""}`}
            onClick={() => markNotificationAsRead(notification.id)}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={getNotificationTypeIcon(notification.type)}
                  className={!notification.read ? "bg-blue-500" : ""}
                />
              }
              title={
                <div className="flex items-center gap-2">
                  <span className={!notification.read ? "font-semibold" : ""}>{notification.title}</span>
                  {!notification.read && <Badge status="processing" />}
                </div>
              }
              description={
                <div>
                  <div className={`text-sm ${!notification.read ? "text-foreground" : "text-muted"}`}>
                    {notification.message}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted mt-1">
                    <span>{dayjs(notification.timestamp).format("MMM DD, YYYY HH:mm")}</span>
                    {notification.project && <span>Project: {notification.project}</span>}
                    {notification.assignee && <span>Assignee: {notification.assignee}</span>}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  )

  const renderNotificationSettings = () => (
    <Card>
      <Title level={4} className="!mb-4">
        Notification Settings
      </Title>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Text strong>Task Assignments</Text>
            <div className="text-sm text-muted">Get notified when you're assigned to a task</div>
          </div>
          <Switch
            checked={notificationSettings.taskAssignments}
            onChange={(checked) => setNotificationSettings({ ...notificationSettings, taskAssignments: checked })}
          />
        </div>

        <Divider />

        <div className="flex items-center justify-between">
          <div>
            <Text strong>Deadline Reminders</Text>
            <div className="text-sm text-muted">Get reminded about upcoming deadlines</div>
          </div>
          <Switch
            checked={notificationSettings.deadlineReminders}
            onChange={(checked) => setNotificationSettings({ ...notificationSettings, deadlineReminders: checked })}
          />
        </div>

        <Divider />

        <div className="flex items-center justify-between">
          <div>
            <Text strong>Project Updates</Text>
            <div className="text-sm text-muted">Get notified about project progress updates</div>
          </div>
          <Switch
            checked={notificationSettings.projectUpdates}
            onChange={(checked) => setNotificationSettings({ ...notificationSettings, projectUpdates: checked })}
          />
        </div>

        <Divider />

        <div className="flex items-center justify-between">
          <div>
            <Text strong>Meeting Reminders</Text>
            <div className="text-sm text-muted">Get reminded about upcoming meetings</div>
          </div>
          <Switch
            checked={notificationSettings.meetingReminders}
            onChange={(checked) => setNotificationSettings({ ...notificationSettings, meetingReminders: checked })}
          />
        </div>

        <Divider />

        <div className="flex items-center justify-between">
          <div>
            <Text strong>Email Notifications</Text>
            <div className="text-sm text-muted">Receive notifications via email</div>
          </div>
          <Switch
            checked={notificationSettings.emailNotifications}
            onChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
          />
        </div>
      </div>
    </Card>
  )

  const upcomingDeadlines = scheduleEvents
    .filter((event) => event.type === "deadline" && dayjs(event.date).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())
    .slice(0, 3)

  return (
    <div className="p-6">
      <div className="flex items-center justify-end mb-6">
        {/* <div>
          <Title level={1} className="!mb-2">
            Schedule & Notifications
          </Title>
          <Text className="text-muted">Manage your schedule and stay updated with notifications</Text>
        </div> */}
      </div>

      {/* Upcoming Deadlines Alert */}
      {upcomingDeadlines.length > 0 && (
        <Alert
          type="info"
          message="Upcoming Deadlines"
          description={
            <div className="space-y-1">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between">
                  <span>
                    {deadline.title} - {deadline.project}
                  </span>
                  <span className="text-sm">
                    {/* {dayjs(deadline.date).format("MMM DD")} ({dayjs(deadline.date).fromNow()}) */}
                  </span>
                </div>
              ))}
            </div>
          }
          className="mb-6"
          showIcon
        />
      )}

      <Tabs defaultActiveKey="schedule">
        <TabPane tab="Schedule" key="schedule">
          <Row gutter={[16, 16]}>
            <Col span={16}>{viewMode === "calendar" ? renderCalendarView() : renderListView()}</Col>
            <Col span={8}>{renderSelectedDateEvents()}</Col>
          </Row>
        </TabPane>

        <TabPane tab={`Notifications (${notifications.filter((n) => !n.read).length})`} key="notifications">
          <Row gutter={[16, 16]}>
            <Col span={16}>{renderNotifications()}</Col>
            <Col span={8}>{renderNotificationSettings()}</Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  )
}
