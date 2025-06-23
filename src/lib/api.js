import axios from 'axios';

export const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`, // backend server URL
});

//employees router
export const createEmployee = (data) => API.post('/employees', data);
export const getEmployeeById = (employeeId) => API.get(`/employees/${employeeId}`);
export const employeeListPage = () => API.get('/employees/time-based');
export const editEmployee = ({employeeId, workType, data}) => API.put(`/employees/${workType}/${employeeId}`, data);
export const deleteEmployee = ({employeeId, workType}) => API.delete(`/employees/${workType}/${employeeId}`);
export const getEmployeesListByJob = (job) => API.get(`/employees/list/${job}`);

//attendances router
export const attendanceDashboardDetailsFetch = (employeeId) => API.get(`/attendances/${employeeId}`);
export const markAttendance = (data) => API.post('/attendances', data);
export const clearAttendanceHistory = ({employeeId}) => API.delete(`/attendances/${employeeId}`);

//payments router
export const addPayment = ({data, job}) => API.post(`/payments/${job}`, data);
export const getPaymentRecord = ({employeeId, workType}) => API.get(`/payments/${workType}?employeeId=${employeeId}` );

//clients
export const createClient = (data) => API.post('/clients', data);
export const changeActive = (clientId) => API.patch(`/clients/${clientId}`);
export const getAllClients = () => API.get('/clients');
export const getClientDetails = (clientId) => API.get(`/clients/${clientId}`);

// products
export const createProductWithTask = (data) => API.post('/products/with-task', data);
export const getProductsMarkingUnassigned = (page) => API.get(`/products/marking-unassigned?page=${page}&limit=10`);
export const getProducts = (page, clientId) => API.get(`/products?page=${page}&limit=20&clientId=${clientId}`);

// task
export const windingTask = (employeeId) => API.get(`/winding-task/${employeeId}`)
export const markingTask = (data) => API.post('/marking-task', data);

// summary
export const paymentSummary = (employeeId) => API.get(`/summary/task-based/${employeeId}`)