const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface FetchOptions extends RequestInit {
  body?: any;
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const { body, ...rest } = options;

  const config: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...rest.headers,
    },
    credentials: 'include',
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Auth API
export const authAPI = {
  signup: (data: { name: string; email: string; password: string; role: string }) =>
    fetchAPI('/api/auth/signup', { method: 'POST', body: data }),
  login: (data: { email: string; password: string }) =>
    fetchAPI('/api/auth/login', { method: 'POST', body: data }),
  logout: () => fetchAPI('/api/auth/logout', { method: 'POST' }),
  refresh: () => fetchAPI('/api/auth/refresh', { method: 'POST' }),
  me: () => fetchAPI('/api/auth/me'),
};

// Project API
export const projectAPI = {
  generate: (data?: { interests?: string; preferredStack?: string }) =>
    fetchAPI('/api/projects/generate', { method: 'POST', body: data }),
  getAll: () => fetchAPI('/api/projects'),
  getActive: () => fetchAPI('/api/projects/active'),
  getById: (id: string) => fetchAPI(`/api/projects/${id}`),
  updateStatus: (id: string, status: string) =>
    fetchAPI(`/api/projects/${id}/status`, { method: 'PATCH', body: { status } }),
  generatePortfolio: (id: string) =>
    fetchAPI(`/api/projects/${id}/portfolio`, { method: 'POST' }),
};

// Task API
export const taskAPI = {
  updateStatus: (projectId: string, taskId: string, status: string) =>
    fetchAPI(`/api/tasks/${projectId}/${taskId}/status`, { method: 'PATCH', body: { status } }),
  reorder: (projectId: string, tasks: { taskId: string; status: string; order: number }[]) =>
    fetchAPI(`/api/tasks/${projectId}/reorder`, { method: 'PUT', body: { tasks } }),
};

// Chat API
export const chatAPI = {
  sendMessage: (projectId: string, message: string) =>
    fetchAPI(`/api/chat/${projectId}`, { method: 'POST', body: { message } }),
  getMessages: (projectId: string) => fetchAPI(`/api/chat/${projectId}`),
};

// Portfolio API
export const portfolioAPI = {
  getPublic: (username: string) => fetchAPI(`/api/portfolio/${username}`),
};

// Recruiter API
export const recruiterAPI = {
  browseStudents: (params?: { search?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', params.page.toString());
    return fetchAPI(`/api/recruiter/students?${query.toString()}`);
  },
  getStudentProfile: (studentId: string) =>
    fetchAPI(`/api/recruiter/students/${studentId}`),
  getSkillScore: (studentId: string) =>
    fetchAPI(`/api/recruiter/students/${studentId}/skill-score`),
};

// User API
export const userAPI = {
  getProfile: () => fetchAPI('/api/users/profile'),
  updateProfile: (data: any) =>
    fetchAPI('/api/users/profile', { method: 'PATCH', body: data }),
};
