import api from './client'

export interface Project {
  id: number
  title: string
  description: string
  techStack: string
  githubUrl: string
  demoUrl: string
  imageUrl: string
  featured: boolean
}

export interface Skill {
  id: number
  name: string
  category: string
  level: number
}

export interface ContactPayload {
  name: string
  email: string
  message: string
}

export const getProjects = () => api.get<Project[]>('/api/projects').then(r => r.data)
export const getSkills   = () => api.get<Skill[]>('/api/skills').then(r => r.data)
export const sendContact = (payload: ContactPayload) => api.post('/api/contact', payload)
export const login       = (username: string, password: string) =>
  api.post<{ token: string }>('/api/auth/login', { username, password })
