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
  Tag,
  Avatar,
  Space,
  Row,
  Col,
  Typography,
  Tabs,
  Dropdown,
  message,
  Timeline,
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BugOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  MoreOutlined,
  EyeOutlined,
  CommentOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs

interface Issue {
  id: string
  title: string
  description: string
  type: "bug" | "feature" | "improvement" | "task"
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  severity: "minor" | "major" | "critical" | "blocker"
  assignee: string
  reporter: string
  project: string
  createdDate: string
  updatedDate: string
  resolvedDate?: string
  dueDate?: string
  tags: string[]
  attachments: string[]
  comments: {
    id: string
    author: string
    content: string
    timestamp: string
    type: "comment" | "status_change" | "assignment"
  }[]
  stepsToReproduce?: string
  expectedBehavior?: string
  actualBehavior?: string
  environment?: string
}

const initialIssues: Issue[] = [
  {
    id: "1",
    title: "Login button not responsive on mobile",
    description: "The login button becomes unclickable on mobile devices with screen width less than 768px",
    type: "bug",
    status: "open",
    priority: "high",
    severity: "major",
    assignee: "Mike Johnson",
    reporter: "Sarah Chen",
    project: "Website Redesign",
    createdDate: "2024-02-10",
    updatedDate: "2024-02-12",
    tags: ["mobile", "ui", "login"],
    attachments: [],
    comments: [
      {
        id: "1",
        author: "Sarah Chen",
        content: "This is affecting user registration rates significantly",
        timestamp: "2024-02-10T14:30:00Z",
        type: "comment",
      },
      {
        id: "2",
        author: "Mike Johnson",
        content: "Investigating the CSS media queries",
        timestamp: "2024-02-12T09:15:00Z",
        type: "comment",
      },
    ],
    stepsToReproduce: "1. Open website on mobile device\n2. Navigate to login page\n3. Try to click login button",
    expectedBehavior: "Login button should be clickable and responsive",
    actualBehavior: "Button appears but is not clickable",
    environment: "Mobile Safari, Chrome Mobile",
  },
  {
    id: "2",
    title: "Add dark mode support",
    description: "Implement dark mode theme across the entire application",
    type: "feature",
    status: "in-progress",
    priority: "medium",
    severity: "minor",
    assignee: "Emma Davis",
    reporter: "Sarah Chen",
    project: "Website Redesign",
    createdDate: "2024-01-25",
    updatedDate: "2024-02-08",
    dueDate: "2024-03-15",
    tags: ["ui", "theme", "accessibility"],
    attachments: [],
    comments: [
      {
        id: "3",
        author: "Emma Davis",
        content: "Working on the color palette and component updates",
        timestamp: "2024-02-08T11:20:00Z",
        type: "comment",
      },
    ],
  },
  {
    id: "3",
    title: "Database connection timeout",
    description: "API requests are timing out due to database connection issues",
    type: "bug",
    status: "resolved",
    priority: "critical",
    severity: "blocker",
    assignee: "Alex Rodriguez",
    reporter: "Mike Johnson",
    project: "Mobile App Development",
    createdDate: "2024-02-05",
    updatedDate: "2024-02-09",
    resolvedDate: "2024-02-09",
    tags: ["database", "api", "performance"],
    attachments: [],
    comments: [
      {
        id: "4",
        author: "Alex Rodriguez",
        content: "Fixed by optimizing connection pool settings",
        timestamp: "2024-02-09T16:45:00Z",
        type: "status_change",
      },
    ],
  },
  {
    id: "4",
    title: "Improve page load performance",
    description: "Optimize images and reduce bundle size to improve page load times",
    type: "improvement",
    status: "open",
    priority: "medium",
    severity: "minor",
    assignee: "Emma Davis",
    reporter: "Sarah Chen",
    project: "Website Redesign",
    createdDate: "2024-02-01",
    updatedDate: "2024-02-01",
    tags: ["performance", "optimization"],
    attachments: [],
    comments: [],
  },
]

const teamMembers = ["Sarah Chen", "Mike Johnson", "Emma Davis", "Alex Rodriguez"]
const projects = ["Website Redesign", "Mobile App Development", "Marketing Campaign", "Database Migration"]

export default function IssueTracking() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [form] = Form.useForm()

  const getStatusColor = (status: string) => {
    const colors = {
      open: "blue",
      "in-progress": "orange",
      resolved: "green",
      closed: "gray",
    }
    return colors[status as keyof typeof colors] || "default"
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      open: <ExclamationCircleOutlined />,
      "in-progress": <CloseCircleOutlined />,
      resolved: <CheckCircleOutlined />,
      closed: <CheckCircleOutlined />,
    }
    return icons[status as keyof typeof icons] || <ExclamationCircleOutlined />
  }

  const getTypeColor = (type: string) => {
    const colors = {
      bug: "red",
      feature: "blue",
      improvement: "green",
      task: "purple",
    }
    return colors[type as keyof typeof colors] || "default"
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      bug: <BugOutlined />,
      feature: <PlusOutlined />,
      improvement: <ExclamationCircleOutlined />,
      task: <FileTextOutlined />,
    }
    return icons[type as keyof typeof icons] || <BugOutlined />
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

  const getSeverityColor = (severity: string) => {
    const colors = {
      minor: "green",
      major: "orange",
      critical: "red",
      blocker: "red",
    }
    return colors[severity as keyof typeof colors] || "default"
  }

  const handleCreateIssue = () => {
    setEditingIssue(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditIssue = (issue: Issue) => {
    setEditingIssue(issue)
    form.setFieldsValue({
      ...issue,
      dueDate: issue.dueDate ? dayjs(issue.dueDate) : null,
    })
    setIsModalVisible(true)
  }

  const handleDeleteIssue = (id: string) => {
    setIssues(issues.filter((issue) => issue.id !== id))
    message.success("Issue deleted successfully")
  }

  const handleViewIssue = (issue: Issue) => {
    setSelectedIssue(issue)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const issueData = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : undefined,
        tags: values.tags || [],
      }

      if (editingIssue) {
        setIssues(
          issues.map((issue) =>
            issue.id === editingIssue.id
              ? { ...issue, ...issueData, updatedDate: new Date().toISOString().split("T")[0] }
              : issue,
          ),
        )
        message.success("Issue updated successfully")
      } else {
        const newIssue: Issue = {
          id: Date.now().toString(),
          ...issueData,
          createdDate: new Date().toISOString().split("T")[0],
          updatedDate: new Date().toISOString().split("T")[0],
          comments: [],
          attachments: [],
        }
        setIssues([...issues, newIssue])
        message.success("Issue created successfully")
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.log("Validation failed:", error)
    }
  }

  const handleStatusChange = (issueId: string, newStatus: string) => {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              status: newStatus as Issue["status"],
              updatedDate: new Date().toISOString().split("T")[0],
              resolvedDate: newStatus === "resolved" ? new Date().toISOString().split("T")[0] : issue.resolvedDate,
            }
          : issue,
      ),
    )
    message.success("Issue status updated")
  }

  const filteredIssues = issues.filter((issue) => {
    const statusMatch = filterStatus === "all" || issue.status === filterStatus
    const typeMatch = filterType === "all" || issue.type === filterType
    const priorityMatch = filterPriority === "all" || issue.priority === filterPriority
    return statusMatch && typeMatch && priorityMatch
  })

  const issueMenuItems = (issue: Issue) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "View Details",
      onClick: () => handleViewIssue(issue),
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Issue",
      onClick: () => handleEditIssue(issue),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete Issue",
      onClick: () => handleDeleteIssue(issue.id),
      danger: true,
    },
  ]

  const columns = [
    {
      title: "Issue",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Issue) => (
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getTypeIcon(record.type)}
            <span className="font-semibold">{text}</span>
          </div>
          <div className="text-sm text-muted">{record.project}</div>
          <div className="flex gap-1 mt-2">
            {record.tags.map((tag) => (
              <Tag key={tag} 
            //   size="small"
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag icon={getTypeIcon(type)} color={getTypeColor(type)}>
          {type.toUpperCase()}
        </Tag>
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
      render: (priority: string) => <Tag color={getPriorityColor(priority)}>{priority.toUpperCase()}</Tag>,
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity: string) => <Tag color={getSeverityColor(severity)}>{severity.toUpperCase()}</Tag>,
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
      title: "Created",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date: string) => (
        <div className="text-sm">
          {dayjs(date).format("MMM DD")}
          {/* <div className="text-xs text-muted">{dayjs(date).fromNow()}</div> */}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Issue) => (
        <Space>
          <Select
            size="small"
            value={record.status}
            onChange={(value) => handleStatusChange(record.id, value)}
            style={{ width: 120 }}
          >
            <Option value="open">Open</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="resolved">Resolved</Option>
            <Option value="closed">Closed</Option>
          </Select>
          <Dropdown menu={{ items: issueMenuItems(record) }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ]

  const renderIssueDetails = () => {
    if (!selectedIssue) return null

    return (
      <Modal
        title={
          <div className="flex items-center gap-2">
            {getTypeIcon(selectedIssue.type)}
            <span>{selectedIssue.title}</span>
          </div>
        }
        open={!!selectedIssue}
        onCancel={() => setSelectedIssue(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedIssue(null)}>
            Close
          </Button>,
          <Button key="edit" type="primary" onClick={() => handleEditIssue(selectedIssue)}>
            Edit Issue
          </Button>,
        ]}
        width={900}
      >
        <Tabs defaultActiveKey="details">
          <TabPane tab="Details" key="details">
            <div className="space-y-4">
              <div>
                <Title level={5}>Description</Title>
                <Paragraph>{selectedIssue.description}</Paragraph>
              </div>

              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text strong>Type: </Text>
                  <Tag icon={getTypeIcon(selectedIssue.type)} color={getTypeColor(selectedIssue.type)}>
                    {selectedIssue.type.toUpperCase()}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Status: </Text>
                  <Tag icon={getStatusIcon(selectedIssue.status)} color={getStatusColor(selectedIssue.status)}>
                    {selectedIssue.status.replace("-", " ").toUpperCase()}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Priority: </Text>
                  <Tag color={getPriorityColor(selectedIssue.priority)}>{selectedIssue.priority.toUpperCase()}</Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Severity: </Text>
                  <Tag color={getSeverityColor(selectedIssue.severity)}>{selectedIssue.severity.toUpperCase()}</Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Assignee: </Text>
                  <Text>{selectedIssue.assignee}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Reporter: </Text>
                  <Text>{selectedIssue.reporter}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Project: </Text>
                  <Text>{selectedIssue.project}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Created: </Text>
                  <Text>{dayjs(selectedIssue.createdDate).format("MMM DD, YYYY")}</Text>
                </Col>
              </Row>

              {selectedIssue.type === "bug" && (
                <div className="space-y-3">
                  {selectedIssue.stepsToReproduce && (
                    <div>
                      <Title level={5}>Steps to Reproduce</Title>
                      <Paragraph>
                        <pre className="whitespace-pre-wrap text-sm">{selectedIssue.stepsToReproduce}</pre>
                      </Paragraph>
                    </div>
                  )}
                  {selectedIssue.expectedBehavior && (
                    <div>
                      <Title level={5}>Expected Behavior</Title>
                      <Paragraph>{selectedIssue.expectedBehavior}</Paragraph>
                    </div>
                  )}
                  {selectedIssue.actualBehavior && (
                    <div>
                      <Title level={5}>Actual Behavior</Title>
                      <Paragraph>{selectedIssue.actualBehavior}</Paragraph>
                    </div>
                  )}
                  {selectedIssue.environment && (
                    <div>
                      <Title level={5}>Environment</Title>
                      <Paragraph>{selectedIssue.environment}</Paragraph>
                    </div>
                  )}
                </div>
              )}

              <div>
                <Title level={5}>Tags</Title>
                <div className="flex gap-1">
                  {selectedIssue.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane tab={`Comments (${selectedIssue.comments.length})`} key="comments">
            <div className="space-y-4">
              {selectedIssue.comments.length > 0 ? (
                <Timeline>
                  {selectedIssue.comments.map((comment) => (
                    <Timeline.Item
                      key={comment.id}
                      dot={
                        comment.type === "comment" ? (
                          <CommentOutlined />
                        ) : comment.type === "status_change" ? (
                          <ExclamationCircleOutlined />
                        ) : (
                          <UserOutlined />
                        )
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar size="small" icon={<UserOutlined />} />
                            <Text strong>{comment.author}</Text>
                            <Text className="text-xs text-muted">
                              {dayjs(comment.timestamp).format("MMM DD, YYYY HH:mm")}
                            </Text>
                          </div>
                          <Paragraph className="ml-6">{comment.content}</Paragraph>
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <div className="text-center text-muted py-8">No comments yet</div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={1} className="!mb-2">
            Issue Tracking
          </Title>
          <Text className="text-muted">Track bugs, feature requests, and improvements</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateIssue}>
          Create Issue
        </Button>
      </div>

      {/* Issue Overview Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">{issues.length}</div>
            <Text className="text-muted">Total Issues</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-secondary mb-2">
              {issues.filter((i) => i.status === "open").length}
            </div>
            <Text className="text-muted">Open Issues</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-chart-3 mb-2">
              {issues.filter((i) => i.status === "resolved").length}
            </div>
            <Text className="text-muted">Resolved</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-chart-5 mb-2">
              {issues.filter((i) => i.priority === "critical").length}
            </div>
            <Text className="text-muted">Critical</Text>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6">
        <Row gutter={16} align="middle">
          <Col>
            <Text strong>Filters:</Text>
          </Col>
          <Col>
            <Select placeholder="All Statuses" value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
              <Option value="all">All Statuses</Option>
              <Option value="open">Open</Option>
              <Option value="in-progress">In Progress</Option>
              <Option value="resolved">Resolved</Option>
              <Option value="closed">Closed</Option>
            </Select>
          </Col>
          <Col>
            <Select placeholder="All Types" value={filterType} onChange={setFilterType} style={{ width: 150 }}>
              <Option value="all">All Types</Option>
              <Option value="bug">Bug</Option>
              <Option value="feature">Feature</Option>
              <Option value="improvement">Improvement</Option>
              <Option value="task">Task</Option>
            </Select>
          </Col>
          <Col>
            <Select
              placeholder="All Priorities"
              value={filterPriority}
              onChange={setFilterPriority}
              style={{ width: 150 }}
            >
              <Option value="all">All Priorities</Option>
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="critical">Critical</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Issues Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredIssues}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* Create/Edit Issue Modal */}
      <Modal
        title={editingIssue ? "Edit Issue" : "Create New Issue"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        width={800}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="title" label="Issue Title" rules={[{ required: true, message: "Please enter issue title" }]}>
            <Input placeholder="Enter issue title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter issue description" }]}
          >
            <TextArea rows={4} placeholder="Enter detailed description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="type" label="Type" rules={[{ required: true, message: "Please select type" }]}>
                <Select placeholder="Select type">
                  <Option value="bug">Bug</Option>
                  <Option value="feature">Feature Request</Option>
                  <Option value="improvement">Improvement</Option>
                  <Option value="task">Task</Option>
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
                name="severity"
                label="Severity"
                rules={[{ required: true, message: "Please select severity" }]}
              >
                <Select placeholder="Select severity">
                  <Option value="minor">Minor</Option>
                  <Option value="major">Major</Option>
                  <Option value="critical">Critical</Option>
                  <Option value="blocker">Blocker</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
                <Select placeholder="Select status">
                  <Option value="open">Open</Option>
                  <Option value="in-progress">In Progress</Option>
                  <Option value="resolved">Resolved</Option>
                  <Option value="closed">Closed</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
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
            <Col span={8}>
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
              <Form.Item name="tags" label="Tags">
                <Select mode="tags" placeholder="Add tags">
                  <Option value="ui">UI</Option>
                  <Option value="backend">Backend</Option>
                  <Option value="mobile">Mobile</Option>
                  <Option value="performance">Performance</Option>
                  <Option value="security">Security</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {form.getFieldValue("type") === "bug" && (
            <>
              <Form.Item name="stepsToReproduce" label="Steps to Reproduce">
                <TextArea rows={3} placeholder="1. Step one&#10;2. Step two&#10;3. Step three" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="expectedBehavior" label="Expected Behavior">
                    <TextArea rows={2} placeholder="What should happen?" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="actualBehavior" label="Actual Behavior">
                    <TextArea rows={2} placeholder="What actually happens?" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="environment" label="Environment">
                <Input placeholder="Browser, OS, device, etc." />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {renderIssueDetails()}
    </div>
  )
}
