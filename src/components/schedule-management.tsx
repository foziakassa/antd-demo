"use client"

import { useState } from "react"
import { Switch } from "antd"
import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"

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
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [notificationSettings, setNotificationSettings] = useState({
    taskAssignments: true,
    deadlineReminders: true,
    projectUpdates: true,
    meetingReminders: true,
    emailNotifications: false,
  })

  const getNotificationTypeIcon = (type: string) => {
    const icons = {
      task_assigned: <UserOutlined className="text-blue-500" />,
      deadline_reminder: <ClockCircleOutlined className="text-orange-500" />,
      task_completed: <CheckCircleOutlined className="text-green-500" />,
      project_update: <ExclamationCircleOutlined className="text-purple-500" />,
      meeting_reminder: <TeamOutlined className="text-indigo-500" />,
    }
    return icons[type as keyof typeof icons] || <BellOutlined />
  }

  const getNotificationTypeColor = (type: string) => {
    const colors = {
      task_assigned: "bg-blue-50 border-blue-200",
      deadline_reminder: "bg-orange-50 border-orange-200",
      task_completed: "bg-green-50 border-green-200",
      project_update: "bg-purple-50 border-purple-200",
      meeting_reminder: "bg-indigo-50 border-indigo-200",
    }
    return colors[type as keyof typeof colors] || "bg-gray-50 border-gray-200"
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

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your project activities and reminders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BellOutlined className="text-xl text-gray-700" />
                  <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {notifications
                .sort((a, b) => dayjs(b.timestamp).unix() - dayjs(a.timestamp).unix())
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      !notification.read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getNotificationTypeColor(notification.type)}`}>
                        {getNotificationTypeIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>

                        <p className={`text-sm mb-2 ${!notification.read ? "text-gray-700" : "text-gray-600"}`}>
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{dayjs(notification.timestamp).format("MMM DD, YYYY HH:mm")}</span>
                          {notification.project && (
                            <span className="bg-gray-100 px-2 py-1 rounded">{notification.project}</span>
                          )}
                          {notification.assignee && <span>Assignee: {notification.assignee}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {notifications.length === 0 && (
              <div className="p-12 text-center">
                <BellOutlined className="text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <SettingOutlined className="text-xl text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Task Assignments</h3>
                    <p className="text-sm text-gray-600">Get notified when assigned to tasks</p>
                  </div>
                  <Switch
                    checked={notificationSettings.taskAssignments}
                    onChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, taskAssignments: checked })
                    }
                  />
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Deadline Reminders</h3>
                      <p className="text-sm text-gray-600">Reminders for upcoming deadlines</p>
                    </div>
                    <Switch
                      checked={notificationSettings.deadlineReminders}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, deadlineReminders: checked })
                      }
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Project Updates</h3>
                      <p className="text-sm text-gray-600">Updates on project progress</p>
                    </div>
                    <Switch
                      checked={notificationSettings.projectUpdates}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, projectUpdates: checked })
                      }
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Meeting Reminders</h3>
                      <p className="text-sm text-gray-600">Reminders for scheduled meetings</p>
                    </div>
                    <Switch
                      checked={notificationSettings.meetingReminders}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, meetingReminders: checked })
                      }
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
