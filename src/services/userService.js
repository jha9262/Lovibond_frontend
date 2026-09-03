import api from './api';

const normaliseUser = (user, key) => ({
  userId: user.USER_ID?.toString() || key.replace('U_', ''),
  name: user.USER_NAME || '',
  designation: user.USER_DESIGNATION || '',
  createdDate: user.CREATE_DATE_TIME || '',
});

export const userService = {
  async getUsers({ page = 1, limit = 10, search = '' }) {
    try {
      const { data } = await api.get('/USER_CONFIGURATION');
      const rawUsers = data?.USER_CONFIGURATION?.USERS 
        ? Object.entries(data.USER_CONFIGURATION.USERS).map(([k, v]) => normaliseUser(v, k))
        : [];

      let filtered = rawUsers;
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
    } catch (error) {
      console.error('[userService] Failed to fetch users:', error);
      throw new Error('Unable to retrieve user data from device.');
    }
  },

  async createUsers(payloads) {
    try {
      const usersObj = payloads.reduce((acc, p, index) => {
        acc[`U_${index + 1}`] = {
          USER_ID: p.userId,
          USER_NAME: p.name || '',
          USER_PASSWORD: p.password || '',
          USER_DESIGNATION: p.designation || ''
        };
        return acc;
      }, {});

      await api.post('/USER_CONFIGURATION', {
        USER_CONFIGURATION: { USERS: usersObj }
      });

      return { 
        created: payloads.map(p => ({
          ...p,
          createdDate: new Date().toISOString()
        })), 
        failed: [] 
      };
    } catch (error) {
      console.error('[userService] Failed to bulk create users:', error);
      throw new Error('Unable to save users to the device.');
    }
  },

  async deleteUser(userId) {
    try {
      await api.post('/USER_CONFIGURATION', {
        USER_CONFIGURATION: {
          USERS: {
            "U_1": {
              USER_ID: userId
            }
          }
        }
      });
      return true;
    } catch (error) {
      console.error('[userService] Failed to delete user:', error);
      throw new Error('Unable to delete user from the device.');
    }
  }
};
