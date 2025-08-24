"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Users, Calendar, Eye, MoreHorizontal } from "lucide-react"
import { Modal } from "antd"

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
  const [activeTab, setActiveTab] = useState("overview")
  const [formData, setFormData] = useState<Partial<Project>>({})
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false)

  const getStatusColor = (status: string) => {
    const colors = {
      planning: "bg-blue-100 text-blue-800",
      "in-progress": "bg-orange-100 text-orange-800",
      review: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      "on-hold": "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleCreateProject = () => {
    setEditingProject(null)
    setFormData({})
    setIsModalVisible(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setFormData(project)
    setIsModalVisible(true)
  }

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  const handleSaveProject = () => {
    if (editingProject) {
      setProjects(projects.map((project) => (project.id === editingProject.id ? { ...project, ...formData } : project)))
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        ...formData,
        progress: 0,
        tasks: { total: 0, completed: 0, inProgress: 0, pending: 0 },
        teamMembers: formData.teamMembers || [],
      } as Project
      setProjects([...projects, newProject])
    }
    setIsModalVisible(false)
    setFormData({})
  }

  const handleViewProject = (project: Project) => {
    setSelectedProject(project)
    setIsDetailsModalVisible(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const renderProjectCard = (project: Project) => (
    <div
      key={project.id}
      className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">{project.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 font-medium">{project.description}</p>
        </div>
        <span
          className={`px-3 py-1.5 text-xs rounded-full font-semibold uppercase tracking-wide ${getPriorityColor(project.priority)}`}
        >
          {project.priority}
        </span>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Progress</span>
            <span className="text-sm font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <span
            className={`px-3 py-1.5 text-xs rounded-full font-semibold uppercase tracking-wide ${getStatusColor(project.status)}`}
          >
            {project.status.replace("-", " ")}
          </span>
          <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Users className="w-4 h-4" />
            <span className="text-sm font-semibold">{project.teamMembers.length} Members</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Due: {formatDate(project.endDate)}</span>
          </div>
          <span className="font-bold text-gray-900 bg-green-50 text-green-800 px-3 py-1 rounded-lg">
            ${project.budget.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => handleViewProject(project)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors duration-200 hover:bg-blue-50 px-3 py-2 rounded-lg"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          <button
            onClick={() => handleEditProject(project)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-semibold transition-colors duration-200 hover:bg-gray-50 px-3 py-2 rounded-lg"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => handleDeleteProject(project.id)}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-semibold transition-colors duration-200 hover:bg-red-50 px-3 py-2 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={handleCreateProject}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* Project Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
              <div className="text-gray-400 text-lg font-bold">Total Projects</div>
            </div>
            <button className="p-1">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <button className="text-blue-500 text-sm font-medium hover:text-blue-600">View</button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {projects.filter((p) => p.status === "in-progress").length}
              </div>
              <div className="text-gray-400 font-bold text-lg">In Progress</div>
            </div>
            <button className="p-1">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <button className="text-blue-500 text-sm font-medium hover:text-blue-600">View</button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-green-600">
                {projects.filter((p) => p.status === "completed").length}
              </div>
              <div className="text-gray-400 text-lg font-bold">Completed</div>
            </div>
            <button className="p-1">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <button className="text-blue-500 text-sm font-medium hover:text-blue-600">View</button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
              </div>
              <div className="text-gray-400 font-bold text-lg">Total Budget</div>
            </div>
            <button className="p-1">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <button className="text-blue-500 text-sm font-medium hover:text-blue-600">View</button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => renderProjectCard(project))}
      </div>

      {/* Create/Edit Project Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {editingProject ? "Edit Project" : "Create New Project"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {editingProject ? "Update project information" : "Fill in the details to create a new project"}
              </p>
            </div>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveProject}
        okText={editingProject ? "Update Project" : "Create Project"}
        cancelText="Cancel"
        width={900}
        className="project-modal"
        okButtonProps={{
          className:
            "bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white font-semibold px-6 py-2 h-auto rounded-lg shadow-sm",
        }}
        cancelButtonProps={{
          className:
            "border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800 font-semibold px-6 py-2 h-auto rounded-lg",
        }}
      >
        <div className="space-y-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium"
                placeholder="Enter a descriptive project name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Project Manager <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.manager || ""}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium bg-white"
              >
                <option value="" className="text-gray-400">
                  Select project manager
                </option>
                <option value="Sarah Chen">Sarah Chen</option>
                <option value="Mike Johnson">Mike Johnson</option>
                <option value="Emma Davis">Emma Davis</option>
                <option value="Alex Rodriguez">Alex Rodriguez</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium resize-none"
              placeholder="Provide a detailed description of the project goals, scope, and deliverables"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status || ""}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Project["status"] })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium bg-white"
              >
                <option value="" className="text-gray-400">
                  Select status
                </option>
                <option value="planning">📋 Planning</option>
                <option value="in-progress">🚀 In Progress</option>
                <option value="review">👀 Review</option>
                <option value="completed">✅ Completed</option>
                <option value="on-hold">⏸️ On Hold</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.priority || ""}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Project["priority"] })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium bg-white"
              >
                <option value="" className="text-gray-400">
                  Select priority
                </option>
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🟠 High Priority</option>
                <option value="critical">🔴 Critical Priority</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Budget (USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">$</span>
                <input
                  type="number"
                  value={formData.budget || ""}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="50,000"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate || ""}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Client Name
              <span className="text-gray-500 font-normal ml-2">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.client || ""}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium"
              placeholder="Enter client or organization name"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-1">Form Guidelines</h4>
                <p className="text-sm text-blue-700">
                  Fields marked with <span className="text-red-500 font-bold">*</span> are required. Make sure to
                  provide accurate information for better project tracking and management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Project Details Modal */}
      <Modal
        title={selectedProject?.name}
        open={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={[
          <button
            key="close"
            onClick={() => setIsDetailsModalVisible(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium mr-3"
          >
            Close
          </button>,
          <button
            key="edit"
            onClick={() => {
              if (selectedProject) {
                handleEditProject(selectedProject)
                setIsDetailsModalVisible(false)
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Edit Project
          </button>,
        ]}
        width={1000}
        className="project-details-modal"
      >
        {selectedProject && (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {["overview", "tasks", "team"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedProject.progress}%</div>
                    <div className="text-sm text-gray-600">Progress</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">${selectedProject.budget.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Budget</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedProject.teamMembers.length}</div>
                    <div className="text-sm text-gray-600">Team Size</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{selectedProject.tasks.total}</div>
                    <div className="text-sm text-gray-600">Total Tasks</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600">{selectedProject.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedProject.status)}`}>
                        {selectedProject.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Priority:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedProject.priority)}`}>
                        {selectedProject.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Start Date:</span>
                      <span className="text-gray-600">{formatDate(selectedProject.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">End Date:</span>
                      <span className="text-gray-600">{formatDate(selectedProject.endDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Manager:</span>
                      <span className="text-gray-600">{selectedProject.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Client:</span>
                      <span className="text-gray-600">{selectedProject.client || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedProject.tasks.completed}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedProject.tasks.inProgress}</div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{selectedProject.tasks.pending}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedProject.tasks.total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-4">
                {selectedProject.teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{member}</div>
                      <div className="text-sm text-gray-600">Team Member</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  )
}
