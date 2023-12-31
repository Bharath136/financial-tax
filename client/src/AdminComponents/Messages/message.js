// ContactView.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Sidebar from '../../userComponents/SideBar/sidebar';
import domain from '../../domain/domain';
import { H1 } from '../ClientTaxDocuments/styledComponents';
import { useNavigate } from 'react-router-dom';
import SweetLoading from '../../SweetLoading/SweetLoading';
import FailureComponent from '../../FailureComponent/failureComponent';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism';

// Styled components
const Container = styled.div`
  width: 100%;
  margin-top: 10vh;
  background-color: var(--main-background);
  padding: 20px;
  height: 90vh;
  overflow: auto;
`;

const NoContactsMessage = styled.p`
  height:70vh;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-top: 20px;
  text-align: center;
  font-size: 16px;
  color: #777;
`;

const ContactCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: #ffff;
  border: 1px solid #ddd;
  margin: 10px;
  padding: 6px 15px;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
`;

const ContactDetails = styled.div`
  margin-top: 10px;
`;

const ContactName = styled.h3`
  color: #333;
  margin-bottom: 10px;
`;

const ContactInfo = styled.p`
  color: #555;
  margin-bottom: 5px;

  strong {
    margin-right: 5px;
  }
`;

const Message = styled.p`
  color: #555;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 3px;
`;

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const ContactView = () => {
    const [contacts, setContacts] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const token = getToken();

    const user = getUserData();

    const navigate = useNavigate()

    const fetchContacts = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const response = await axios.get(`${domain.domain}/contact/message`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setContacts(response.data);
            setApiStatus(apiStatusConstants.success)

        } catch (error) {
            setApiStatus(apiStatusConstants.failure)
            setErrorMsg(error)
        }
    };

    useEffect(() => {
        if (user) {
            ;
            if (user.role === 'STAFF') {
                navigate('/staff/dashboard');
            } else if (user.role === 'CUSTOMER') {
                navigate('/user/dashboard');
            }
        }


        fetchContacts();
    }, [token,navigate]);

    const handleDeleteContact = async (id) => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            await axios.delete(`${domain.domain}/contact/message/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setApiStatus(apiStatusConstants.success)
            setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
        } catch (error) {
            setApiStatus(apiStatusConstants.failure)
            setErrorMsg(error)
        }
    };

    const renderSuccess = () => {
        return(
            <Container>
                <H1>Contact Details and Messages</H1>
               {contacts.length === 0 ? (
                    <NoContactsMessage>No messages available.</NoContactsMessage>
                ) : (
                    contacts.map((contact) => (
                        <ContactCard key={contact.id}>
                            <ContactName>{contact.name}</ContactName>
                            <ContactDetails>
                                <ContactInfo>
                                    <strong>Email:</strong> {contact.email_address}
                                </ContactInfo>
                                <ContactInfo>
                                    <strong>Mobile Number:</strong> {contact.mobile_number || 'N/A'}
                                </ContactInfo>
                                <ContactInfo>
                                    <strong>ID:</strong> {contact.id}
                                </ContactInfo>
                            </ContactDetails>
                            <Message>{contact.message}</Message>
                            <DeleteButton onClick={() => handleDeleteContact(contact.id)}>Delete</DeleteButton>
                        </ContactCard>
                    )
                ))}
            </Container>
        )
    }


    const onRenderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return <SweetLoading />;
            case apiStatusConstants.success:
                return renderSuccess();
            case apiStatusConstants.failure:
                return <FailureComponent errorMsg={errorMsg} fetchData={fetchContacts}/>;
            default:
                return null;
        }
    }

    return (
        onRenderComponents()
    );
};

export default ContactView;
