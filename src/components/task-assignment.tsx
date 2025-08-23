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
  List,
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
        <div>
          <div className="font-semibold mb-1">{text}</div>
          <div className="text-sm text-muted">{record.project}</div>
          <div className="flex gap-1 mt-2">
            {record.tags.map((tag) => (
              <Tag
                key={tag}
                //    size="small"
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
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status.replace("-", " ").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag icon={<FlagOutlined />} color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      key: "assignee",
      render: (assignee: string) => (
        <div className="flex items-center gap-2">
          <Avatar size="small" icon={<UserOutlined />} />
          <span className="text-sm">{assignee}</span>
        </div>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string) => (
        <div className="flex items-center gap-1 text-sm">
          <CalendarOutlined />
          <span>{dayjs(date).format("MMM DD, YYYY")}</span>
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
          <div className="w-20">
            <Progress percent={Math.round(progress)} size="small" />
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
            <div className="bg-white rounded-lg p-6 h-full">
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
        title={selectedTask.title}
        open={!!selectedTask}
        onCancel={() => setSelectedTask(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedTask(null)}>
            Close
          </Button>,
          <Button key="edit" type="primary" onClick={() => handleEditTask(selectedTask)}>
            Edit Task
          </Button>,
        ]}
        width={800}
      >
        <div className="space-y-4">
          <div>
            <Title level={5}>Description</Title>
            <Paragraph>{selectedTask.description}</Paragraph>
          </div>

          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Text strong>Status: </Text>
              <Tag icon={getStatusIcon(selectedTask.status)} color={getStatusColor(selectedTask.status)}>
                {selectedTask.status.replace("-", " ").toUpperCase()}
              </Tag>
            </Col>
            <Col span={12}>
              <Text strong>Priority: </Text>
              <Tag icon={<FlagOutlined />} color={getPriorityColor(selectedTask.priority)}>
                {selectedTask.priority.toUpperCase()}
              </Tag>
            </Col>
            <Col span={12}>
              <Text strong>Assignee: </Text>
              <Text>{selectedTask.assignee}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Reporter: </Text>
              <Text>{selectedTask.reporter}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Project: </Text>
              <Text>{selectedTask.project}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Due Date: </Text>
              <Text>{dayjs(selectedTask.dueDate).format("MMM DD, YYYY")}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Estimated Hours: </Text>
              <Text>{selectedTask.estimatedHours}h</Text>
            </Col>
            <Col span={12}>
              <Text strong>Actual Hours: </Text>
              <Text>{selectedTask.actualHours || 0}h</Text>
            </Col>
          </Row>

          <div>
            <Title level={5}>Tags</Title>
            <div className="flex gap-1">
              {selectedTask.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>

          {selectedTask.comments.length > 0 && (
            <div>
              <Title level={5}>Comments</Title>
              <List
                dataSource={selectedTask.comments}
                renderItem={(comment) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar size="small" icon={<UserOutlined />} />}
                      title={comment.author}
                      description={
                        <div>
                          <div>{comment.content}</div>
                          <div className="text-xs text-muted mt-1">
                            {dayjs(comment.timestamp).format("MMM DD, YYYY HH:mm")}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
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

      <div className="bg-white rounded-lg p-6  mb-6">
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

      {/* Task Content */}
      {viewMode === "list" ? (
        <div className="bg-white rounded-lg shadow-lg">
          <Table
            columns={columns}
            dataSource={filteredTasks}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </div>
      ) : (
        renderKanbanBoard()
      )}

      {/* Create/Edit Task Modal */}
      <Modal
        title={editingTask ? "Edit Task" : "Create New Task"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        width={700}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="title" label="Task Title" rules={[{ required: true, message: "Please enter task title" }]}>
            <Input placeholder="Enter task title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter task description" }]}
          >
            <TextArea rows={3} placeholder="Enter task description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
                <Select placeholder="Select status">
                  <Option value="todo">To Do</Option>
                  <Option value="in-progress">In Progress</Option>
                  <Option value="review">Review</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: "Please select priority" }]}
              >
                <Select placeholder="Select priority">
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="critical">Critical</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="estimatedHours"
                label="Estimated Hours"
                rules={[{ required: true, message: "Please enter estimated hours" }]}
              >
                <Input type="number" placeholder="Hours" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assignee"
                label="Assignee"
                rules={[{ required: true, message: "Please select assignee" }]}
              >
                <Select placeholder="Select assignee">
                  {teamMembers.map((member) => (
                    <Option key={member} value={member}>
                      {member}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reporter"
                label="Reporter"
                rules={[{ required: true, message: "Please select reporter" }]}
              >
                <Select placeholder="Select reporter">
                  {teamMembers.map((member) => (
                    <Option key={member} value={member}>
                      {member}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="project" label="Project" rules={[{ required: true, message: "Please select project" }]}>
                <Select placeholder="Select project">
                  {projects.map((project) => (
                    <Option key={project} value={project}>
                      {project}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true, message: "Please select due date" }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Add tags">
              <Option value="frontend">Frontend</Option>
              <Option value="backend">Backend</Option>
              <Option value="design">Design</Option>
              <Option value="testing">Testing</Option>
              <Option value="documentation">Documentation</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {renderTaskDetails()}
    </div>
  )
}
