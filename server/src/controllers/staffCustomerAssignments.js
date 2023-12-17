const client = require('../database/connection')



// Create Assignment
const assignClientToStaff = async (req, res) => {
    const { staff_id, client_id } = req.body;
    const created_at = new Date().toISOString();
    try {
        const { rows } = await client.query('INSERT INTO staff_customer_assignments (staff_id, client_id, created_at) VALUES ($1, $2, $3) RETURNING *', [staff_id, client_id, created_at]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



// Update Assignment
const updateAssignment = async (req, res) => {
    const assignment_id = parseInt(req.params.assignment_id);
    const { staff_id, client_id } = req.body;
    try {
        const { rows } = await client.query('UPDATE staff_customer_assignments SET staff_id = $1, client_id = $2 WHERE assignment_id = $3 RETURNING *', [staff_id, client_id, assignment_id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        console.error('Error updating assignment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Delete Assignment
const deleteAssignment = async (req, res) => {
    const assignment_id = req.params.id;
    try {
        const { rows } = await client.query('DELETE FROM staff_customer_assignments WHERE assignment_id = $1 RETURNING *', [assignment_id]);
        if (rows.length > 0) {
            res.json({ message: 'Assignment deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get All Assignments
const getAssignments = async (req, res) => {
    try {
        const { rows } = await client.query('SELECT * FROM staff_customer_assignments');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get All Assignments
const getStaffAssignments = async (req, res) => {
    const id = req.params.id
    try {
        const { rows } = await client.query('SELECT * FROM staff_customer_assignments WHERE staff_id = $1', [id]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Get Assignment by ID
const getAssignmentById = async (req, res) => {
    const assignment_id = req.params.id;
    try {
        const { rows } = await client.query('SELECT * FROM staff_customer_assignments WHERE assignment_id = $1', [assignment_id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        console.error('Error fetching assignment by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Endpoint to assign clients to staff members
const autoAssignClients = async (req, res) => {

    try {
        // Find available staff for a specific team
        const team = req.body.team || 'Scheduling'; // Default to 'Scheduling' if not provided
        const availableStaffQuery = `
            SELECT user_id
            FROM user_logins
            WHERE role = 'STAFF' AND staff_team = $1
        `;
        const availableStaffResult = await client.query(availableStaffQuery, [team]);

        // Find unassigned clients
        const unassignedClientsQuery = `
            SELECT user_id
            FROM user_logins
            WHERE role = 'CUSTOMER' AND current_step IS NULL
        `;
        const unassignedClientsResult = await client.query(unassignedClientsQuery);

        const availableStaffIds = availableStaffResult.rows.map((row) => row.user_id);
        const unassignedClientIds = unassignedClientsResult.rows.map((row) => row.user_id);

        // Check if there are available staff and unassigned clients
        if (availableStaffIds.length === 0 || unassignedClientIds.length === 0) {
            return res.status(404).json({ success: false, error: 'No available staff or unassigned clients found.' });
        }

        // Start a database transaction
        await client.query('BEGIN');

        try {
            // Assign clients to staff members
            let staffIndex = 0;

            for (const clientId of unassignedClientIds) {
                const staffId = availableStaffIds[staffIndex];

                // Get the current timestamp
                const createdAt = new Date();

                // Insert assignment into staff_customer_assignments table
                const insertAssignmentQuery = `
                    INSERT INTO staff_customer_assignments (staff_id, client_id, created_at)
                    VALUES ($1, $2, $3)
                `;
                await client.query(insertAssignmentQuery, [staffId, clientId, createdAt]);

                staffIndex = (staffIndex + 1) % availableStaffIds.length;
            }

            // Update current_step to the assigned team for the assigned clients
            const updateClientStepQuery = `
                UPDATE user_logins
                SET current_step = $1
                WHERE user_id = ANY($2)
            `;
            await client.query(updateClientStepQuery, [team, unassignedClientIds]);

            // Commit the transaction
            await client.query('COMMIT');

            res.status(200).json({ success: true, message: 'Clients assigned and updated successfully' });
        } catch (error) {
            // Rollback the transaction in case of an error
            await client.query('ROLLBACK');
            throw error; // Rethrow the error for the outer catch block to handle
        }
    } catch (error) {
        console.error('Error assigning clients:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    } 
};




module.exports = {
    getAssignments,
    assignClientToStaff,
    updateAssignment,
    deleteAssignment,
    getAssignmentById,
    getStaffAssignments,
    autoAssignClients
}