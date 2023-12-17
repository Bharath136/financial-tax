// ClientTable.jsx
import React from 'react';
import { ViewButton, Td, TableContainer, Table, Th } from '../../staffComponents/AssignedClients/styledComponents';
import EditModal from '../../SweetPopup/sweetPopup';

const ClientTable = ({ clients, isAuthenticated, handleMoveToClick, handleEditClick, customerResponse, onChangeCustomerResponse, onSendResponse, handleStepChange, availableSteps, isEditModalOpen, profileId, handleEditModalClose }) => (
    <>
        <TableContainer className='shadow'>
            <Table>
                <thead>
                    <tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Phone</Th>
                        <Th>Current Step</Th>
                        <Th>Actions</Th>
                        <Th>Update</Th>
                        <Th>Send Response</Th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client.user_id}>
                            <Td>{client.user_id}</Td>
                            <Td>{client.first_name}</Td>
                            <Td>{client.email_address}</Td>
                            <Td>{client.contact_number}</Td>
                            <Td>{client.current_step ? client.current_step : 'Null'}</Td>
                            <Td>
                                <ViewButton onClick={() => {
                                    handleEditClick(client.user_id)
                                }}>
                                    View Profile
                                </ViewButton>
                            </Td>
                            <Td>
                                <ViewButton onClick={() => handleMoveToClick(client)}>
                                    Move To
                                </ViewButton>
                            </Td>
                            <Td>
                                <div className='d-flex align-items-center justify-content-center p-0' style={{ gap: "10px" }}>
                                    <input
                                        type='text'
                                        value={customerResponse}
                                        className="p-2 text-dark"
                                        style={{ border: '1px solid grey', borderRadius: '4px', outline: 'none' }}
                                        placeholder='Enter customer response...'
                                        onChange={(e) => onChangeCustomerResponse(e)}
                                        required
                                    />
                                    <ViewButton
                                        onClick={() => onSendResponse(client)}
                                        disabled={!customerResponse.trim()}
                                    >
                                        Send
                                    </ViewButton>
                                </div>

                            </Td>
                        </tr>
                    ))}
                </tbody>

            </Table>

            {isAuthenticated && availableSteps.length > 0 && (
                <div className='d-flex align-items-center justify-content-end mt-4'>
                    <label htmlFor="moveTo" className='m-2'><strong>Move To: </strong></label>
                    <select
                        id="moveTo"
                        value=""
                        className='p-2'
                        onChange={(e) => handleStepChange(e.target.value)}
                    >
                        <option value="" disabled>Select an option</option>
                        {availableSteps.map((step) => (
                            <option key={step} value={step}>
                                {step}
                            </option>
                        ))}
                    </select>
                </div>
            )}


            <EditModal
                isOpen={isEditModalOpen}
                profileId={profileId}
                onRequestClose={handleEditModalClose}
                handleOpenClick={handleEditClick}
                isEditable={false}
            />
        </TableContainer>
    </>
);

export default ClientTable;
