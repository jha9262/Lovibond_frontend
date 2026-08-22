let mockUsers = [
  { userId: 'USR001', name: 'John Doe', designation: 'Senior Engineer', createdDate: new Date().toISOString() },
  { userId: 'USR002', name: 'Jane Smith', designation: 'Lab Technician', createdDate: new Date(Date.now() - 86400000).toISOString() },
];

export const userService = {
  async getUsers({ page = 1, limit = 10, search = '' }) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    let filtered = [...mockUsers];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(u => 
        u.userId.toLowerCase().includes(q) || 
        u.name.toLowerCase().includes(q)
      );
    }
    
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const users = filtered.slice(start, start + limit);
    
    return { users, pagination: { page, limit, total, totalPages } };
  },

  async createUsers(payloads) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const created = [];
    const failed = [];

    for (const payload of payloads) {
      const exists = mockUsers.some(u => u.userId === payload.userId);
      if (exists) {
        failed.push(payload);
      } else {
        const newUser = { ...payload, createdDate: new Date().toISOString() };
        mockUsers = [newUser, ...mockUsers];
        created.push(newUser);
      }
    }
    
    return { created, failed };
  }
};
