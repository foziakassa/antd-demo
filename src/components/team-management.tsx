"use client"

import { useState } from "react"
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Avatar,
  Tag,
  Space,
  Popconfirm,
  message,
  Row,
  Col,
  Typography,
} from "antd"
import { UserOutlined, EditOutlined, DeleteOutlined, PlusOutlined, MailOutlined } from "@ant-design/icons"
import { Plus } from "lucide-react"

const { Title, Text } = Typography
const { Option } = Select

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  status: "active" | "inactive"
  avatar?: string
  joinDate: string
  tasksCompleted: number
  currentTasks: number
}

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    phone: "+1 (555) 123-4567",
    role: "Project Manager",
    department: "Engineering",
    status: "active",
    joinDate: "2023-01-15",
    tasksCompleted: 45,
    currentTasks: 8,
  },
  {
    id: "2",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    phone: "+1 (555) 234-5678",
    role: "Senior Developer",
    department: "Engineering",
    status: "active",
    joinDate: "2022-08-20",
    tasksCompleted: 78,
    currentTasks: 12,
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma.davis@company.com",
    phone: "+1 (555) 345-6789",
    role: "UX Designer",
    department: "Design",
    status: "active",
    joinDate: "2023-03-10",
    tasksCompleted: 32,
    currentTasks: 6,
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@company.com",
    phone: "+1 (555) 456-7890",
    role: "QA Engineer",
    department: "Quality Assurance",
    status: "inactive",
    joinDate: "2022-11-05",
    tasksCompleted: 56,
    currentTasks: 0,
  },
]

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [form] = Form.useForm()

  const handleAddMember = () => {
    setEditingMember(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
    form.setFieldsValue(member)
    setIsModalVisible(true)
  }

  const handleDeleteMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
    message.success("Team member removed successfully")
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()

      if (editingMember) {
        // Update existing member
        setTeamMembers(
          teamMembers.map((member) => (member.id === editingMember.id ? { ...member, ...values } : member)),
        )
        message.success("Team member updated successfully")
      } else {
        // Add new member
        const newMember: TeamMember = {
          id: Date.now().toString(),
          ...values,
          joinDate: new Date().toISOString().split("T")[0],
          tasksCompleted: 0,
          currentTasks: 0,
        }
        setTeamMembers([...teamMembers, newMember])
        message.success("Team member added successfully")
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.log("Validation failed:", error)
    }
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setEditingMember(null)
  }

  const columns = [
    {
      title: "Member",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: TeamMember) => (
        <div className="flex items-center gap-3">
          <Avatar size="large" icon={<UserOutlined />} />
          <div>
            <div className="font-semibold">{text}</div>
            <div className="text-sm text-muted flex items-center gap-1">
              <MailOutlined className="text-xs" />
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Role & Department",
      dataIndex: "role",
      key: "role",
      render: (text: string, record: TeamMember) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-muted">{record.department}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={status === "active" ? "#52c41a" : "#f5222d"}>{status.toUpperCase()}</Tag>,
    },
    {
      title: "Tasks",
      key: "tasks",
      render: (record: TeamMember) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-secondary">{record.currentTasks}</div>
          <div className="text-xs text-muted">Current</div>
          <div className="text-sm text-muted mt-1">{record.tasksCompleted} completed</div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: TeamMember) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEditMember(record)} />
          <Popconfirm
            title="Are you sure you want to remove this team member?"
            onConfirm={() => handleDeleteMember(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-end mb-6">
        {/* <div>
          <Title level={1} className="!mb-2">
            Team Management
          </Title>
          <Text className="text-muted">Manage your team members, roles, and assignments</Text>
        </div> */}
        {/* <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMember}>
          Add Team Member
        </Button> */}
        <div className="flex items-center justify-end mb-6">
                <button
                  onClick={handleAddMember}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
          Add Team Member
                  
                </button>
              </div>
      </div>

      {/* Team Overview Cards */}
      {/* <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">
              {teamMembers.filter((m) => m.status === "active").length}
            </div>
            <Text className="text-muted">Active Members</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-secondary mb-2">
              {teamMembers.reduce((sum, m) => sum + m.currentTasks, 0)}
            </div>
            <Text className="text-muted">Active Tasks</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-chart-3 mb-2">
              {teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)}
            </div>
            <Text className="text-muted">Completed Tasks</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-chart-4 mb-2">
              {new Set(teamMembers.map((m) => m.department)).size}
            </div>
            <Text className="text-muted">Departments</Text>
          </Card>
        </Col>
      </Row> */}

      {/* Team Members Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={teamMembers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* Add/Edit Member Modal */}
      <Modal
        title={editingMember ? "Edit Team Member" : "Add Team Member"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Please enter the full name" }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter the email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: "Please enter the phone number" }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role" label="Role" rules={[{ required: true, message: "Please select a role" }]}>
                <Select placeholder="Select role">
                  <Option value="Project Manager">Project Manager</Option>
                  <Option value="Senior Developer">Senior Developer</Option>
                  <Option value="Developer">Developer</Option>
                  <Option value="UX Designer">UX Designer</Option>
                  <Option value="UI Designer">UI Designer</Option>
                  <Option value="QA Engineer">QA Engineer</Option>
                  <Option value="DevOps Engineer">DevOps Engineer</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: "Please select a department" }]}
              >
                <Select placeholder="Select department">
                  <Option value="Engineering">Engineering</Option>
                  <Option value="Design">Design</Option>
                  <Option value="Quality Assurance">Quality Assurance</Option>
                  <Option value="Product">Product</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Operations">Operations</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select a status" }]}>
                <Select placeholder="Select status">
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
