export const BASE_URL = "https://adid-task-manager.onrender.com";
// export const BASE_URL= "http://192.168.1.5:8000";

export const API_PATHS={
    AUTH: {
        REGISTER:"/api/auth/register",
        LOGIN:"/api/auth/login",
        GET_PROFILE:"/api/auth/profile",
    },
    USERS:{
        GET_ALL_USERS:"/api/users",
        GET_USER_BY_ID: (userId)=>`/api/users/${userId}`,
        CREATE_USER: "/api/users",
        UPDATE_USER:(userId)=>`/api/users/${userId}`,
        DELETE_USER:(userId)=>`/api/users/${userId}`,
    },
    TASKS:{
        GET_DASHBOARD_DATA:"/api/tasks/dashboard-data",
        GET_USER_DASHBOARD_DATA:"/api/tasks/user-dashboard-data",
        GET_ALL_TASKS:"/api/tasks",
        GET_TASK_BY_ID:(taskId)=>`/api/tasks/${taskId}`,
        CREATE_TASK:"/api/tasks",
        GET_TASKS_FOR_USER: (userId) => `/api/tasks/user/${userId}`,
        UPDATE_TASK:(taskId)=>`/api/tasks/${taskId}`,
        DELETE_TASK:(taskId)=>`/api/tasks/${taskId}`,
        UPDATE_TASK_STATUS:(taskId)=>`/api/tasks/${taskId}/status`,
        UPDATE_TASK_CHECKLIST:(taskId)=>`/api/tasks/${taskId}/todo`,
        ADD_REMARK: (taskId) => `/api/tasks/${taskId}/remarks`,
        START_TIMER: (taskId) => `/api/tasks/${taskId}/timelogs/start`,
        STOP_TIMER: (taskId, timeLogId) => `/api/tasks/${taskId}/timelogs/${timeLogId}/stop`,
        GET_ACTIVE_TIMER: (taskId) => `/api/tasks/${taskId}/timelogs/active`,
        GET_TASK_TIMELOGS: (taskId) => `/api/tasks/${taskId}/timelogs`,
        GET_USER_BOARD: "/api/tasks/user-board",
    },
    TIMELOGS: {
        GET_BY_DAY: (userId) => `/api/timelogs/day/${userId}`,
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
    REPORTS:{
        EXPORT_TASKS:"/api/reports/exports/tasks",
        EXPORT_USERS:"/api/reports/exports/users",
    },
    IMAGE:{
        UPLOAD_IMAGE:"api/auth/upload-image"
    },
}