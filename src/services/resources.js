import api from './api';

// Drivers
export const driversApi = {
  getAll: (params) => api.get('/drivers', { params }),
  getOne: (driverNumber, params) => api.get(`/drivers/${driverNumber}`, { params }),
};

// Teams
export const teamsApi = {
  getAll: (params) => api.get('/teams', { params }),
  getOne: (teamId) => api.get(`/teams/${teamId}`),
};

// Standings
export const standingsApi = {
  drivers: (params) => api.get('/standings/drivers', { params }),
  constructors: (params) => api.get('/standings/constructors', { params }),
};

// Sessions
export const sessionsApi = {
  getAll: (params) => api.get('/sessions', { params }),
  getOne: (sessionKey) => api.get(`/sessions/${sessionKey}`),
  getLaps: (sessionKey, params) => api.get(`/sessions/${sessionKey}/laps`, { params }),
  getPitStops: (sessionKey, params) => api.get(`/sessions/${sessionKey}/pitstops`, { params }),
  getTyres: (sessionKey, params) => api.get(`/sessions/${sessionKey}/tyres`, { params }),
  getWeather: (sessionKey) => api.get(`/sessions/${sessionKey}/weather`),
  getTelemetry: (sessionKey, params) => api.get(`/sessions/${sessionKey}/telemetry`, { params }),
  getLocation: (sessionKey, params) => api.get(`/sessions/${sessionKey}/location`, { params }),
  getRaceControl: (sessionKey, params) => api.get(`/sessions/${sessionKey}/racecontrol`, { params }),
};



// Profile
export const profileApi = {
  get: () => api.get('/auth/profile'),
  patch: (body) => api.patch('/auth/profile', body),
  deleteAccount: () => api.delete('/auth/account'),
};

// Favorites
export const favoritesApi = {
  getDrivers: () => api.get('/favorites/drivers'),
  addDriver: (driverNumber) => api.post('/favorites/drivers', { driver_number: driverNumber }),
  removeDriver: (driverNumber) => api.delete(`/favorites/drivers/${driverNumber}`),
  getTeams: () => api.get('/favorites/teams'),
  addTeam: (teamName) => api.post('/favorites/teams', { team_name: teamName }),
  removeTeam: (teamName) => api.delete(`/favorites/teams/${teamName}`),
};

// Dashboards
export const dashboardsApi = {
  getAll: () => api.get('/dashboards'),
  create: (body) => api.post('/dashboards', body),
  getOne: (id) => api.get(`/dashboards/${id}`),
  update: (id, body) => api.patch(`/dashboards/${id}`, body),
  delete: (id) => api.delete(`/dashboards/${id}`),
};
