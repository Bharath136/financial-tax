const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();

const {
    getAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentById,
    getStaffAssignments
} = require('../controllers/staffCustomerAssignments');

// Get all assignments (accessible by ADMIN and STAFF)
router.get('/', authenticate(['ADMIN', 'STAFF']), getAssignments);

// Get assignments for a specific staff member (accessible by STAFF and ADMIN)
router.get('/staff/:id', authenticate(['STAFF', 'ADMIN']), getStaffAssignments);

// Create a new assignment (accessible by ADMIN)
router.post('/assign', authenticate(['ADMIN']), createAssignment);

// Routes for a specific assignment by ID
router.route('/:id')
    .get(authenticate(['STAFF', 'ADMIN']), getAssignmentById) // Get assignment by ID (accessible by STAFF and ADMIN)
    .put(authenticate(['ADMIN']), updateAssignment) // Update assignment by ID (accessible by ADMIN)
    .delete(authenticate(['ADMIN']), deleteAssignment); // Delete assignment by ID (accessible by ADMIN)

module.exports = router;
