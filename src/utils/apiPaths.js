export const BASE_URL = "https://adid-task-manager.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },
  USERS: {
    GET_ALL_USERS: "/api/users",
    GET_USER_BY_ID: (id) => `/api/users/${id}`,
    CREATE_USER: "/api/users",
    UPDATE_USER: (id) => `/api/users/${id}`,
    DELETE_USER: (id) => `/api/users/${id}`,
  },
  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
    GET_ALL_TASKS: "/api/tasks",
    GET_TASK_BY_ID: (id) => `/api/tasks/${id}`,
    CREATE_TASK: "/api/tasks",
    GET_TASKS_FOR_USER: (userId) => `/api/tasks/user/${userId}`,
    UPDATE_TASK: (id) => `/api/tasks/${id}`,
    DELETE_TASK: (id) => `/api/tasks/${id}`,
    UPDATE_TASK_STATUS: (id) => `/api/tasks/${id}/status`,
    UPDATE_TASK_CHECKLIST: (id) => `/api/tasks/${id}/todo`,
    ADD_REMARK: (id) => `/api/tasks/${id}/remarks`,
    START_TIMER: (id) => `/api/tasks/${id}/timelogs/start`,
    STOP_TIMER: (id, timeLogId) => `/api/tasks/${id}/timelogs/${timeLogId}/stop`,
    GET_ACTIVE_TIMER: (id) => `/api/tasks/${id}/timelogs/active`,
    GET_TASK_TIMELOGS: (id) => `/api/tasks/${id}/timelogs`,
    GET_USER_BOARD: "/api/tasks/user-board",
  },
  TIMELOGS: {
    GET_BY_DAY: (date) => `/api/timelogs/day/${date}`,
    GET_ALL_BY_DAY: "/api/timelogs/all-by-day",
    GET_ACTIVE_TIMELOGS: "/api/timelogs/active",
    GET_WORK_HOURS_SUMMARY: "/api/timelogs/summary/work-hours",
  },
  PROJECTS: {
    CREATE_PROJECT: "/api/projects",
    GET_MY_PROJECTS: "/api/projects",
    GET_ALL_PROJECTS: "/api/projects/all",
  },
  AI: {
    CREATE_TASK: "/api/ai/create-task",
  },
  NOTIFICATIONS: {
    GET_ALL: "/api/notifications",
    MARK_AS_READ: "/api/notifications/read",
    MARK_ONE_AS_READ: (id) => `/api/notifications/${id}/read`,
  },
  REPORTS: {
    EXPORT_TASKS: "/api/reports/exports/tasks",
    EXPORT_USERS: "/api/reports/exports/users",
  },
  IMAGE: {
    UPLOAD_IMAGE: "api/auth/upload-image"
  },
  // --- START: THIS SECTION WAS MISSING ---
  MUSIC: {
    SEARCH: "/api/music/search",
    GET_STREAM: (videoId) => `/api/music/stream/${videoId}`,
  },
  // --- END: MISSING SECTION ---
};