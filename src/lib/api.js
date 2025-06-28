import axios from 'axios';

const baseURL =
    typeof window === 'undefined'
        ? process.env.NEXT_PUBLIC_API_URL
        : '';

export const API = axios.create({
    baseURL: `${baseURL}/api`,
});

//employees router
export const createEmployee = (data) => API.post('/employees', data);
export const getEmployeeDetailsById = (employeeId) => API.get(`/employees/${employeeId}`);
export const employeeListPage = () => API.get('/employees/time-based');
export const editEmployee = ({ employeeId, workType, data }) => API.put(`/employees/${workType}/${employeeId}`, data);
export const deleteEmployee = ({ employeeId, workType }) => API.delete(`/employees/${workType}/${employeeId}`);
export const getEmployeesListByJob = (job) => API.get(`/employees/list/${job}`);


//attendances
export const getAttendanceRecord = (employeeId, month, year) => API.get(`/attendances/${employeeId}?month=${month}&year=${year}`);
export const markAttendance = (data) => API.post('/attendances', data);
export const clearAttendanceHistory = ({ employeeId }) => API.delete(`/attendances/${employeeId}`);

//payments
export const addPayment = ({ data, job }) => API.post(`/payments/${job}`, data);
export const getPaymentRecord = ({ employeeId, workType }) => API.get(`/payments/${workType}?employeeId=${employeeId}`);

//clients
export const createClient = (data) => API.post('/clients', data);
export const changeActive = (clientId) => API.patch(`/clients/${clientId}`);
export const getAllClients = () => API.get('/clients');
export const getClientDetails = (clientId) => API.get(`/clients/${clientId}`);

// products
export const createProduct = (data) => API.post('/products', data);
export const createProductWithTask = (data) => API.post('/products/with-task', data);
export const getProductsUnassigned = (page, type) => API.get(`/products/unassigned?type=${type}&page=${page}&limit=10`);
export const getProducts = (page, clientId) => API.get(`/products?page=${page}&limit=20&clientId=${clientId}`);

// task
export const getTasks = (employeeId) => API.get(`/task/${employeeId}`)
export const addTask = (data) => API.post('/task', data);
export const removeTask = ({ taskId, job}) => API.delete(`/task?taskId=${taskId}&job=${job}`);

// summary
export const paymentSummary = (employeeId) => API.get(`/summary/task-based/${employeeId}`)
export const getSummaryTimeBased = (employeeId) => API.get(`/summary/time-based/${employeeId}`)