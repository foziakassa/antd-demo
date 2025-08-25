"use client"

import { useState } from "react"
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tag,
  Avatar,
  Space,
  Row,
  Col,
  Typography,
  Tabs,
  Progress,
  Dropdown,
  message,
  Badge,
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
  FlagOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  EyeOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "completed"
  priority: "low" | "medium" | "high" | "critical"
  assignee: string
  reporter: string
  project: string
  dueDate: string
  createdDate: string
  estimatedHours: number
  actualHours?: number
  tags: string[]
  comments: {
    id: string
    author: string
    content: string
    timestamp: string
  }[]
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design Homepage Layout",
    description: "Create wireframes and mockups for the new homepage design",
    status: "in-progress",
    priority: "high",
    assignee: "Emma Davis",
    reporter: "Sarah Chen",
    project: "Website Redesign",
    dueDate: "2024-02-15",
    createdDate: "2024-01-20",
    estimatedHours: 16,
    actualHours: 12,
    tags: ["design", "ui/ux", "homepage"],
    comments: [
      {
        id: "1",
        author: "Sarah Chen",
        content: "Please focus on mobile-first approach",
        timestamp: "2024-01-21T10:30:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Implement User Authentication",
    description: "Set up JWT-based authentication system with login/logout functionality",
    status: "todo",
    priority: "critical",
    assignee: "Mike Johnson",
    reporter: "Sarah Chen",
    project: "Mobile App Development",
    dueDate: "2024-02-20",
    createdDate: "2024-01-22",
    estimatedHours: 24,
    tags: ["backend", "security", "authentication"],
    comments: [],
  },
  {
    id: "3",
    title: "Create Marketing Copy",
    description: "Write compelling copy for the Q2 marketing campaign",
    status: "review",
    priority: "medium",
    assignee: "Emma Davis",
    reporter: "Sarah Chen",
    project: "Marketing Campaign",
    dueDate: "2024-02-10",
    createdDate: "2024-01-18",
    estimatedHours: 8,
    actualHours: 10,
    tags: ["marketing", "copywriting", "content"],
    comments: [
      {
        id: "2",
        author: "Sarah Chen",
        content: "Looks great! Just need minor adjustments to the CTA",
        timestamp: "2024-02-08T14:15:00Z",
      },
    ],
  },
  {
    id: "4",
    title: "Database Schema Design",
    description: "Design the new database schema for user management",
    status: "completed",
    priority: "high",
    assignee: "Alex Rodriguez",
    reporter: "Mike Johnson",
    project: "Database Migration",
    dueDate: "2024-01-30",
    createdDate: "2024-01-15",
    estimatedHours: 12,
    actualHours: 14,
    tags: ["database", "schema", "backend"],
    comments: [],
  },
  {
    id: "5",
    title: "API Testing",
    description: "Comprehensive testing of all API endpoints",
    status: "in-progress",
    priority: "medium",
    assignee: "Alex Rodriguez",
    reporter: "Mike Johnson",
    project: "Mobile App Development",
    dueDate: "2024-02-25",
    createdDate: "2024-01-25",
    estimatedHours: 20,
    actualHours: 8,
    tags: ["testing", "api", "qa"],
    comments: [],
  },
]

const teamMembers = ["Sarah Chen", "Mike Johnson", "Emma Davis", "Alex Rodriguez"]
const projects = ["Website Redesign", "Mobile App Development", "Marketing Campaign", "Database Migration"]

export default function TaskAssignment() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterAssignee, setFilterAssignee] = useState<string>("all")
  const [form] = Form.useForm()

  const getStatusColor = (status: string) => {
    const colors = {
      todo: "#1890ff",
      "in-progress": "#fa8c16",
      review: "#722ed1",
      completed: "#52c41a",
    }
    return colors[status as keyof typeof colors] || "default"
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      todo: <ClockCircleOutlined />,
      "in-progress": <ExclamationCircleOutlined />,
      review: <EyeOutlined />,
      completed: <CheckCircleOutlined />,
    }
    return icons[status as keyof typeof icons] || <ClockCircleOutlined />
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "#52c41a",
      medium: "#1890ff",
      high: "#fa8c16",
      critical: "#ff4d4f",
    }
    return colors[priority as keyof typeof colors] || "default"
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    form.setFieldsValue({
      ...task,
      dueDate: dayjs(task.dueDate),
    })
    setIsModalVisible(true)
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
    message.success("Task deleted successfully")
  }

  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const taskData = {
        ...values,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
        tags: values.tags || [],
      }

      if (editingTask) {
        setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task)))
        message.success("Task updated successfully")
      } else {
        const newTask: Task = {
          id: Date.now().toString(),
          ...taskData,
          createdDate: new Date().toISOString().split("T")[0],
          comments: [],
        }
        setTasks([...tasks, newTask])
        message.success("Task created successfully")
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.log("Validation failed:", error)
    }
  }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus as Task["status"] } : task)))
    message.success("Task status updated")
  }

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === "all" || task.status === filterStatus
    const assigneeMatch = filterAssignee === "all" || task.assignee === filterAssignee
    return statusMatch && assigneeMatch
  })

  const taskMenuItems = (task: Task) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "View Details",
      onClick: () => handleViewTask(task),
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Task",
      onClick: () => handleEditTask(task),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete Task",
      onClick: () => handleDeleteTask(task.id),
      danger: true,
    },
  ]

  const columns = [
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Task) => (
        <div className="py-2">
          <div className="text-base font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer leading-tight">
            {text}
          </div>
          <div className="text-sm font-medium text-gray-600 mb-3 bg-gray-50 px-2 py-1 rounded-md inline-block">
            📁 {record.project}
          </div>
          <div className="flex gap-1 mt-2">
            {record.tags.map((tag) => (
              <Tag
                key={tag}
                className="text-xs font-medium border-0 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)} className="font-semibold text-xs px-3 py-1">
          {status.replace("-", " ").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag icon={<FlagOutlined />} color={getPriorityColor(priority)} className="font-bold text-xs px-3 py-1">
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      key: "assignee",
      render: (assignee: string) => (
        <div className="flex items-center gap-3 py-1">
          <Avatar size="small" icon={<UserOutlined />} className="border-2 border-gray-200" />
          <span className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors">{assignee}</span>
        </div>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string) => (
        <div className="flex items-center gap-2 py-1">
          <CalendarOutlined className="text-gray-500" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">{dayjs(date).format("MMM DD")}</span>
            <span className="text-xs text-gray-500 font-medium">{dayjs(date).format("YYYY")}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Progress",
      key: "progress",
      render: (record: Task) => {
        const progress =
          record.actualHours && record.estimatedHours
            ? Math.min((record.actualHours / record.estimatedHours) * 100, 100)
            : 0
        return (
          <div className="w-24">
            <Progress percent={Math.round(progress)} size="small" strokeColor="#3b82f6" />
            <div className="text-xs text-gray-600 mt-1 font-medium">
              {record.actualHours || 0}h / {record.estimatedHours}h
            </div>
          </div>
        )
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Task) => (
        <Space>
          <Select
            size="small"
            value={record.status}
            onChange={(value) => handleStatusChange(record.id, value)}
            style={{ width: 120 }}
          >
            <Option value="todo">To Do</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="review">Review</Option>
            <Option value="completed">Completed</Option>
          </Select>
          <Dropdown menu={{ items: taskMenuItems(record) }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ]

  const renderKanbanBoard = () => {
    const statusColumns = [
      { key: "todo", title: "To Do", color: "blue" },
      { key: "in-progress", title: "In Progress", color: "orange" },
      { key: "review", title: "Review", color: "purple" },
      { key: "completed", title: "Completed", color: "green" },
    ]

    return (
      <Row gutter={16}>
        {statusColumns.map((column) => (
          <Col span={6} key={column.key}>
            <div className="bg-white rounded-lg p-6 shadow-lg h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-900">{column.title}</span>
                <Badge
                  count={filteredTasks.filter((task) => task.status === column.key).length}
                  style={{ backgroundColor: `var(--color-${column.color})` }}
                />
              </div>
              <div className="space-y-3">
                {filteredTasks
                  .filter((task) => task.status === column.key)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
                      onClick={() => handleViewTask(task)}
                    >
                      <div className="mb-2">
                        <div className="font-semibold text-sm mb-1">{task.title}</div>
                        <div className="text-xs text-gray-600">{task.project}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>
                        <Avatar size="small" icon={<UserOutlined />} />
                      </div>
                      <div className="mt-2 text-xs text-gray-600 flex items-center gap-1">
                        <CalendarOutlined />
                        {dayjs(task.dueDate).format("MMM DD")}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    )
  }

  const renderTaskDetails = () => {
    if (!selectedTask) return null

    return (
      <Modal
        title={
          <div className="pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedTask.title}</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Project:</span>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {selectedTask.project}
              </span>
            </div>
          </div>
        }
        open={!!selectedTask}
        onCancel={() => setSelectedTask(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedTask(null)} className="h-10 px-6 font-medium">
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => handleEditTask(selectedTask)}
            className="h-10 px-6 font-medium bg-blue-600 hover:bg-blue-700"
          >
            Edit Task
          </Button>,
        ]}
        width={900}
        className="task-detail-modal"
      >
        <div className="space-y-8 pt-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">{selectedTask.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Status & Priority</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <Tag
                    icon={getStatusIcon(selectedTask.status)}
                    color={getStatusColor(selectedTask.status)}
                    className="font-semibold px-3 py-1"
                  >
                    {selectedTask.status.replace("-", " ").toUpperCase()}
                  </Tag>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Priority</span>
                  <Tag
                    icon={<FlagOutlined />}
                    color={getPriorityColor(selectedTask.priority)}
                    className="font-semibold px-3 py-1"
                  >
                    {selectedTask.priority.toUpperCase()}
                  </Tag>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Team & Timeline</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Assignee</span>
                  <div className="flex items-center gap-2">
                    <Avatar size="small" icon={<UserOutlined />} className="border border-gray-300" />
                    <span className="text-sm font-semibold text-gray-900">{selectedTask.assignee}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Reporter</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedTask.reporter}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <CalendarOutlined className="text-blue-500" />
              Timeline & Progress
            </h4>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Created Date</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {dayjs(selectedTask.createdDate).format("MMM DD, YYYY")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Due Date</span>
                  <span
                    className={`text-sm font-semibold ${dayjs(selectedTask.dueDate).isBefore(dayjs()) && selectedTask.status !== "completed" ? "text-red-600" : "text-gray-900"}`}
                  >
                    {dayjs(selectedTask.dueDate).format("MMM DD, YYYY")}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Estimated Hours</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedTask.estimatedHours}h</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Actual Hours</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedTask.actualHours || 0}h</span>
                </div>
              </div>
            </div>
            {selectedTask.actualHours && selectedTask.estimatedHours && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.round((selectedTask.actualHours / selectedTask.estimatedHours) * 100)}%
                  </span>
                </div>
                <Progress
                  percent={Math.min((selectedTask.actualHours / selectedTask.estimatedHours) * 100, 100)}
                  strokeColor="#3b82f6"
                  className="mb-2"
                />
              </div>
            )}
          </div>

          {selectedTask.tags.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTask.tags.map((tag) => (
                  <Tag
                    key={tag}
                    className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 border-blue-200 rounded-full"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {selectedTask.comments.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                Comments ({selectedTask.comments.length})
              </h4>
              <div className="space-y-4">
                {selectedTask.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <Avatar size="small" icon={<UserOutlined />} className="mt-1 border border-gray-300" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
                          <span className="text-xs text-gray-500 font-medium">
                            {dayjs(comment.timestamp).format("MMM DD, YYYY • HH:mm")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <style jsx global>{`
          .task-detail-modal .ant-modal-content {
            border-radius: 12px;
            overflow: hidden;
          }
          .task-detail-modal .ant-modal-header {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-bottom: 1px solid #e2e8f0;
          }
          .task-detail-modal .ant-modal-body {
            padding: 0 24px 24px 24px;
            max-height: 70vh;
            overflow-y: auto;
          }
        `}</style>
      </Modal>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={handleCreateTask}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusOutlined />
          Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-blue-600">{tasks.length}</div>
              <div className="text-gray-400 text-lg font-bold">Total Tasks</div>
            </div>
            <button className="p-1">
              <MoreOutlined className="text-gray-400" />
            </button>
          </div>
          <button className="text-blue-500 text-sm font-medium hover:text-blue-600">View</button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {tasks.filter((t) => t.status === "in-progress").length}
              </div>
              <div className="text-gray-400 font-bold text-lg">In Progress</div>
            </div>
            <button className="p-1">
              <MoreOutlined className="text-gray-400" />
            </button>
          </div>
          <button className="text-blue-500 text-sm font-medium hover:text-blue-600">View</button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-green-600">
                {tasks.filter((t) => t.status === "completed").length}
              </div>
              <div className="text-gray-400 text-lg font-bold">Completed</div>
            </div>
            <button className="p-1">
              <MoreOutlined className="text-gray-400" />
            </button>
          </div>
          <button className="text-blue-500 text-sm font-medium hover:text-blue-600">View</button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-red-600">
                {tasks.filter((t) => dayjs(t.dueDate).isBefore(dayjs()) && t.status !== "completed").length}
              </div>
              <div className="text-gray-400 font-bold text-lg">Overdue</div>
            </div>
            <button className="p-1">
              <MoreOutlined className="text-gray-400" />
            </button>
          </div>
          <button className="text-blue-500 text-sm font-medium hover:text-blue-600">View</button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filters:</span>
          <Select placeholder="All Statuses" value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
            <Option value="all">All Statuses</Option>
            <Option value="todo">To Do</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="review">Review</Option>
            <Option value="completed">Completed</Option>
          </Select>
          <Select
            placeholder="All Assignees"
            value={filterAssignee}
            onChange={setFilterAssignee}
            style={{ width: 150 }}
          >
            <Option value="all">All Assignees</Option>
            {teamMembers.map((member) => (
              <Option key={member} value={member}>
                {member}
              </Option>
            ))}
          </Select>
          <div className="flex-1" />
          <Button.Group>
            <Button type={viewMode === "list" ? "primary" : "default"} onClick={() => setViewMode("list")}>
              List View
            </Button>
            <Button type={viewMode === "kanban" ? "primary" : "default"} onClick={() => setViewMode("kanban")}>
              Kanban Board
            </Button>
          </Button.Group>
        </div>
      </div>

      {/* Create/Edit Task Modal */}
      <Modal
        title={
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{editingTask ? "Edit Task" : "Create New Task"}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {editingTask ? "Update task details and assignments" : "Add a new task to your project"}
            </p>
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        width={700}
        okText={editingTask ? "Update Task" : "Create Task"}
        okButtonProps={{
          className: "bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 h-10 px-6 font-medium",
        }}
        cancelButtonProps={{
          className: "h-10 px-6 font-medium border-gray-300 text-gray-700 hover:border-gray-400",
        }}
      >
        <Form form={form} layout="vertical" className="mt-6">
          <Form.Item
            name="title"
            label={<span className="text-sm font-medium text-gray-700">Task Title</span>}
            rules={[{ required: true, message: "Please enter task title" }]}
          >
            <Input
              placeholder="Enter task title"
              className="h-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="text-sm font-medium text-gray-700">Description</span>}
            rules={[{ required: true, message: "Please enter task description" }]}
          >
            <TextArea
              rows={3}
              placeholder="Enter task description"
              className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="status"
              label={<span className="text-sm font-medium text-gray-700">Status</span>}
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select status" className="h-10">
                <Option value="todo">To Do</Option>
                <Option value="in-progress">In Progress</Option>
                <Option value="review">Review</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="priority"
              label={<span className="text-sm font-medium text-gray-700">Priority</span>}
              rules={[{ required: true, message: "Please select priority" }]}
            >
              <Select placeholder="Select priority" className="h-10">
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
                <Option value="critical">Critical</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="assignee"
              label={<span className="text-sm font-medium text-gray-700">Assignee</span>}
              rules={[{ required: true, message: "Please select assignee" }]}
            >
              <Select placeholder="Select assignee" className="h-10">
                {teamMembers.map((member) => (
                  <Option key={member} value={member}>
                    {member}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="dueDate"
              label={<span className="text-sm font-medium text-gray-700">Due Date</span>}
              rules={[{ required: true, message: "Please select due date" }]}
            >
              <DatePicker className="w-full h-10 border-gray-300 focus:border-blue-500" placeholder="Select due date" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="project"
              label={<span className="text-sm font-medium text-gray-700">Project</span>}
              rules={[{ required: true, message: "Please select project" }]}
            >
              <Select placeholder="Select project" className="h-10">
                {projects.map((project) => (
                  <Option key={project} value={project}>
                    {project}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="estimatedHours"
              label={<span className="text-sm font-medium text-gray-700">Estimated Hours</span>}
              rules={[{ required: true, message: "Please enter estimated hours" }]}
            >
              <Input
                type="number"
                placeholder="0"
                className="h-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </Form.Item>
          </div>

          <Form.Item name="tags" label={<span className="text-sm font-medium text-gray-700">Tags</span>}>
            <Select mode="tags" placeholder="Add tags" className="min-h-10">
              <Option value="frontend">Frontend</Option>
              <Option value="backend">Backend</Option>
              <Option value="design">Design</Option>
              <Option value="testing">Testing</Option>
              <Option value="urgent">Urgent</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Task Content */}
      {viewMode === "list" ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Task Management</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {filteredTasks.length} of {tasks.length} tasks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Total Progress:</span>
                <Progress
                  percent={Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100)}
                  size="small"
                  strokeColor="#10b981"
                  className="w-24"
                />
              </div>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredTasks}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tasks`,
            }}
            className="professional-table"
            size="middle"
          />

          <style jsx global>{`
            .professional-table .ant-table {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            }
            .professional-table .ant-table-thead > tr > th {
              background-color: #f9fafb;
              border-bottom: 1px solid #e5e7eb;
              font-weight: 600;
              font-size: 13px;
              color: #374151;
              padding: 16px;
            }
            .professional-table .ant-table-tbody > tr > td {
              padding: 16px;
              border-bottom: 1px solid #f3f4f6;
            }
            .professional-table .ant-table-tbody > tr:hover > td {
              background-color: #f9fafb;
            }
            .professional-table .ant-table-tbody > tr:last-child > td {
              border-bottom: none;
            }
            .professional-table .ant-pagination {
              padding: 16px;
              border-top: 1px solid #e5e7eb;
              background-color: #f9fafb;
            }
          `}</style>
        </div>
      ) : (
        renderKanbanBoard()
      )}

      {renderTaskDetails()}
    </div>
  )
}
