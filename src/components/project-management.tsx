"use client"

import { useState } from "react"
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Progress,
  Tag,
  Row,
  Col,
  Typography,
  Avatar,
  Dropdown,
  message,
  Tabs,
  List,
  Statistic,
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  CalendarOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs

interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold"
  priority: "low" | "medium" | "high" | "critical"
  startDate: string
  endDate: string
  progress: number
  budget: number
  teamMembers: string[]
  tasks: {
    total: number
    completed: number
    inProgress: number
    pending: number
  }
  manager: string
  client?: string
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete redesign of the company website with modern UI/UX principles",
    status: "in-progress",
    priority: "high",
    startDate: "2024-01-15",
    endDate: "2024-03-30",
    progress: 75,
    budget: 50000,
    teamMembers: ["Sarah Chen", "Mike Johnson", "Emma Davis"],
    tasks: { total: 24, completed: 18, inProgress: 4, pending: 2 },
    manager: "Sarah Chen",
    client: "Internal",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Native mobile application for iOS and Android platforms",
    status: "in-progress",
    priority: "critical",
    startDate: "2024-02-01",
    endDate: "2024-06-15",
    progress: 45,
    budget: 120000,
    teamMembers: ["Mike Johnson", "Alex Rodriguez", "Emma Davis", "Sarah Chen"],
    tasks: { total: 48, completed: 22, inProgress: 12, pending: 14 },
    manager: "Mike Johnson",
    client: "TechCorp Inc.",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Q2 digital marketing campaign across multiple channels",
    status: "review",
    priority: "medium",
    startDate: "2024-03-01",
    endDate: "2024-05-31",
    progress: 90,
    budget: 25000,
    teamMembers: ["Emma Davis", "Sarah Chen"],
    tasks: { total: 16, completed: 14, inProgress: 2, pending: 0 },
    manager: "Emma Davis",
    client: "Marketing Dept",
  },
  {
    id: "4",
    name: "Database Migration",
    description: "Migration from legacy database to modern cloud infrastructure",
    status: "planning",
    priority: "high",
    startDate: "2024-04-01",
    endDate: "2024-07-30",
    progress: 15,
    budget: 75000,
    teamMembers: ["Alex Rodriguez", "Mike Johnson"],
    tasks: { total: 32, completed: 5, inProgress: 3, pending: 24 },
    manager: "Alex Rodriguez",
    client: "Internal",
  },
]

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [form] = Form.useForm()

  const getStatusColor = (status: string) => {
    const colors = {
      planning: "#1890ff", // blue
      "in-progress": "#fa8c16", // orange
      review: "#722ed1", // purple
      completed: "#52c41a", // green
      "on-hold": "#f5222d", // red
    }
    return colors[status as keyof typeof colors] || "default"
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

  const handleCreateProject = () => {
    setEditingProject(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    form.setFieldsValue({
      ...project,
      startDate: dayjs(project.startDate),
      endDate: dayjs(project.endDate),
    })
    setIsModalVisible(true)
  }

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
    message.success("Project deleted successfully")
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const projectData = {
        ...values,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
      }

      if (editingProject) {
        setProjects(
          projects.map((project) => (project.id === editingProject.id ? { ...project, ...projectData } : project)),
        )
        message.success("Project updated successfully")
      } else {
        const newProject: Project = {
          id: Date.now().toString(),
          ...projectData,
          progress: 0,
          tasks: { total: 0, completed: 0, inProgress: 0, pending: 0 },
          teamMembers: projectData.teamMembers || [],
        }
        setProjects([...projects, newProject])
        message.success("Project created successfully")
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.log("Validation failed:", error)
    }
  }

  const handleViewProject = (project: Project) => {
    setSelectedProject(project)
  }

  const projectMenuItems = (project: Project) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "View Details",
      onClick: () => handleViewProject(project),
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Project",
      onClick: () => handleEditProject(project),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete Project",
      onClick: () => handleDeleteProject(project.id),
      danger: true,
    },
  ]

  const renderProjectCard = (project: Project) => (
    <Card
      key={project.id}
      className="h-full"
      actions={[
        <Button key="view" type="text" icon={<EyeOutlined />} onClick={() => handleViewProject(project)} />,
        <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleEditProject(project)} />,
        <Dropdown key="more" menu={{ items: projectMenuItems(project) }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>,
      ]}
    >
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <Title level={4} className="!mb-0">
            {project.name}
          </Title>
          <Tag color={getPriorityColor(project.priority)}>{project.priority.toUpperCase()}</Tag>
        </div>
        <Paragraph ellipsis={{ rows: 2 }} className="text-muted">
          {project.description}
        </Paragraph>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <Text className="text-sm">Progress</Text>
            <Text className="text-sm font-semibold">{project.progress}%</Text>
          </div>
          <Progress percent={project.progress} size="small" />
        </div>

        <div className="flex items-center justify-between">
          <Tag color={getStatusColor(project.status)}>{project.status.replace("-", " ").toUpperCase()}</Tag>
          <div className="flex items-center gap-1">
            <TeamOutlined className="text-muted" />
            <Text className="text-sm text-muted">{project.teamMembers.length}</Text>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted">
          <div className="flex items-center gap-1">
            <CalendarOutlined />
            <span>{dayjs(project.endDate).format("MMM DD, YYYY")}</span>
          </div>
          <span>${project.budget.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  )

  const renderProjectDetails = () => {
    if (!selectedProject) return null

    return (
      <Modal
        title={selectedProject.name}
        open={!!selectedProject}
        onCancel={() => setSelectedProject(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedProject(null)}>
            Close
          </Button>,
          <Button key="edit" type="primary" onClick={() => handleEditProject(selectedProject)}>
            Edit Project
          </Button>,
        ]}
        width={800}
      >
        <Tabs defaultActiveKey="overview">
          <TabPane tab="Overview" key="overview">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small">
                  <Statistic title="Progress" value={selectedProject.progress} suffix="%" />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic title="Budget" value={selectedProject.budget} prefix="$" />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic title="Team Size" value={selectedProject.teamMembers.length} />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic title="Total Tasks" value={selectedProject.tasks.total} />
                </Card>
              </Col>
            </Row>

            <div className="mt-4">
              <Title level={5}>Description</Title>
              <Paragraph>{selectedProject.description}</Paragraph>
            </div>

            <div className="mt-4">
              <Title level={5}>Project Details</Title>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text strong>Status: </Text>
                  <Tag color={getStatusColor(selectedProject.status)}>
                    {selectedProject.status.replace("-", " ").toUpperCase()}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Priority: </Text>
                  <Tag color={getPriorityColor(selectedProject.priority)}>{selectedProject.priority.toUpperCase()}</Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Start Date: </Text>
                  <Text>{dayjs(selectedProject.startDate).format("MMM DD, YYYY")}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>End Date: </Text>
                  <Text>{dayjs(selectedProject.endDate).format("MMM DD, YYYY")}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Manager: </Text>
                  <Text>{selectedProject.manager}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Client: </Text>
                  <Text>{selectedProject.client || "N/A"}</Text>
                </Col>
              </Row>
            </div>
          </TabPane>

          <TabPane tab="Tasks" key="tasks">
            <Row gutter={[16, 16]} className="mb-4">
              <Col span={6}>
                <Card size="small" className="text-center">
                  <div className="text-lg font-bold text-chart-3">{selectedProject.tasks.completed}</div>
                  <div className="text-sm text-muted">Completed</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" className="text-center">
                  <div className="text-lg font-bold text-secondary">{selectedProject.tasks.inProgress}</div>
                  <div className="text-sm text-muted">In Progress</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" className="text-center">
                  <div className="text-lg font-bold text-chart-4">{selectedProject.tasks.pending}</div>
                  <div className="text-sm text-muted">Pending</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" className="text-center">
                  <div className="text-lg font-bold text-primary">{selectedProject.tasks.total}</div>
                  <div className="text-sm text-muted">Total</div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Team" key="team">
            <List
              dataSource={selectedProject.teamMembers}
              renderItem={(member) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<TeamOutlined />} />}
                    title={member}
                    description="Team Member"
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Modal>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-end mb-6">
        {/* <div>
          <Title level={1} className="!mb-2">
            Project Management
          </Title>
          <Text className="text-muted">Manage your projects, track progress, and coordinate teams</Text>
        </div> */}
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateProject}>
          Create Project
        </Button>
      </div>

      {/* Project Overview Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">{projects.length}</div>
            <Text className="text-muted">Total Projects</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-secondary mb-2">
              {projects.filter((p) => p.status === "in-progress").length}
            </div>
            <Text className="text-muted">In Progress</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-chart-3 mb-2">
              {projects.filter((p) => p.status === "completed").length}
            </div>
            <Text className="text-muted">Completed</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-chart-4 mb-2">
              ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
            </div>
            <Text className="text-muted">Total Budget</Text>
          </Card>
        </Col>
      </Row>

      {/* Projects Grid */}
      <Row gutter={[16, 16]}>
        {projects.map((project) => (
          <Col xs={24} sm={12} lg={8} key={project.id}>
            {renderProjectCard(project)}
          </Col>
        ))}
      </Row>

      {/* Create/Edit Project Modal */}
      <Modal
        title={editingProject ? "Edit Project" : "Create New Project"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        width={700}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Project Name"
                rules={[{ required: true, message: "Please enter project name" }]}
              >
                <Input placeholder="Enter project name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="manager"
                label="Project Manager"
                rules={[{ required: true, message: "Please select project manager" }]}
              >
                <Select placeholder="Select project manager">
                  <Option value="Sarah Chen">Sarah Chen</Option>
                  <Option value="Mike Johnson">Mike Johnson</Option>
                  <Option value="Emma Davis">Emma Davis</Option>
                  <Option value="Alex Rodriguez">Alex Rodriguez</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter project description" }]}
          >
            <TextArea rows={3} placeholder="Enter project description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
                <Select placeholder="Select status">
                  <Option value="planning">Planning</Option>
                  <Option value="in-progress">In Progress</Option>
                  <Option value="review">Review</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="on-hold">On Hold</Option>
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
              <Form.Item name="budget" label="Budget ($)" rules={[{ required: true, message: "Please enter budget" }]}>
                <Input type="number" placeholder="Enter budget" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: "Please select start date" }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: "Please select end date" }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="client" label="Client">
                <Input placeholder="Enter client name (optional)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="teamMembers" label="Team Members">
                <Select mode="multiple" placeholder="Select team members">
                  <Option value="Sarah Chen">Sarah Chen</Option>
                  <Option value="Mike Johnson">Mike Johnson</Option>
                  <Option value="Emma Davis">Emma Davis</Option>
                  <Option value="Alex Rodriguez">Alex Rodriguez</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {renderProjectDetails()}
    </div>
  )
}
