const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    userRegistration,
    updateUserById,
    deleteUserById,
    userLogin,
    addStaff,
    getAllStaffAssignedClients,
    getUsersByCurrentStatus,
    updateCurrentStatusById,
    updateStaffTeamById,
    getAllStaffUnAssignedClients,
    editPassword,
    getMyStaffDetails,
    getCustomerResponse,
    getAllStaff
} = require('../controllers/user');

// Register a new user API
router.post('/register', userRegistration);

// Login a registered user API
router.post('/login', userLogin);

// Add Staff by admin API
router.post('/add-staff', authenticate(['ADMIN']), addStaff);

// Authorized user API
router.get('/', authenticate(['STAFF', 'ADMIN']), getAllUsers);

// Get all staff API
router.get('/staff', authenticate(['ADMIN']), getAllStaff)

// Get staff assigned clients API
router.get('/staff-clients', authenticate(['STAFF', 'ADMIN']), getAllStaffAssignedClients);

// Get unassigned clients API
router.get('/unassigned-clients', getAllStaffUnAssignedClients);

// Update current step (journey status) API
router.post('/current-step/:id', authenticate(['STAFF', 'ADMIN']), updateCurrentStatusById);

// Get customers by current step (journey status) API
router.get('/current-step/:current_step', authenticate(['STAFF', 'ADMIN']), getUsersByCurrentStatus);

// Edit password by the user
router.put('/reset-password', editPassword)

// Add staff team by the admin
router.put('/add/staff-team/:id', authenticate(['ADMIN']), updateStaffTeamById)

// My staff details
router.get('/my-staff/details/:id', authenticate(['CUSTOMER']), getMyStaffDetails)

// Customer Response
router.get('/customer-response/:id', authenticate(['STAFF', 'ADMIN']), getCustomerResponse)

// Authorized user API with common CRUD operations
router.route("/:id")
    .get(authenticate(['CUSTOMER', 'ADMIN', 'STAFF']), getUserById)
    .put(authenticate(['CUSTOMER', 'STAFF', 'ADMIN']), updateUserById)
    .delete(authenticate(['CUSTOMER','ADMIN']), deleteUserById);

module.exports = router;
