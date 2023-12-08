
// Libraries
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Sidebar from '../SideBar/sidebar';
import BreadCrumb from '../../breadCrumb/breadCrumb';
import SweetLoading from '../../SweetLoading/SweetLoading';
import domain from '../../domain/domain'

// Assets
import pdf from '../../Assets/PDF_file_icon.svg.png';
import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png';
import noDoc from '../../Assets/no-documents.jpg';

// Others 
import showAlert from '../../SweetAlert/sweetalert';
import { MdDelete } from 'react-icons/md';
import { message } from '../../components/Footer/footer'


import {
    CommentDescription,
    CommentDocumentContainer,
    H1,
    CtaSection,
    DocumentsTableContainer,
    DocumentTableContainer,
    DocumentTable,
    CommentButton,
    ViewButton,
    CommentSectionContainer,
    CommentSection,
    CommentInputFieldsContainer,
    Lable,
    InputField,
    SendButton,
    ButtonContainer,
    TextArea,
    Button,
    Th,
    Td,
    DocumentName,
    EmptyDocumentContainer,
} from './styledComponents';

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}

const CommentDocument = () => {
    // State variables
    const [documents, setDocuments] = useState([]);
    const [formData, setFormData] = useState({});
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState({});
    const [comments, setComments] = useState([]);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

    // User and access token retrieval
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');

    // React Router navigate function
    const navigate = useNavigate();

    // useEffect for initial data fetching
    useEffect(() => {
        // Redirect if user is admin or staff
        if (user.role === 'ADMIN') {
            navigate('/admin-dashboard');
        } else if (user.role === 'STAFF') {
            navigate('/staff-dashboard');
        }

        // Fetch data from the API
        setApiStatus(apiStatusConstants.inProgress);
        const fetchData = async () => {
            try {
                const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                // Filter data based on the user
                const filteredData = response.data.documents.filter((doc) => doc.customer_id === user.user_id);

                if (response.status === 200) {
                    setDocuments(filteredData);
                    setApiStatus(apiStatusConstants.success);
                } else {
                    setApiStatus(apiStatusConstants.failure);
                }
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        // Call the fetchData function
        fetchData();
    }, [accessToken]);

    // Function to handle toggling comment input
    const handleToggleCommentInput = (document) => {
        setShowCommentInput(!showCommentInput);
        setSelectedDocument(document);
    };

    // Function to handle submitting a comment
    const handleCommentSubmit = async () => {
        setApiStatus(apiStatusConstants.inProgress);
        try {
            const token = localStorage.getItem('customerJwtToken');
            const newComment = {
                customer_id: user.user_id,
                staff_id: selectedDocument.assigned_staff,
                document_id: selectedDocument.document_id,
                comment: formData.comment,
                financial_year: formData.financial_year,
                financial_quarter: formData.financial_quarter,
                financial_month: formData.financial_month,
            };

            // Post the new comment
            await axios.post(`${domain.domain}/customer-tax-comment/create`, newComment, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setApiStatus(apiStatusConstants.success);
            showAlert({ title: 'Comment Submitted Successfully!', icon: 'success', confirmButtonText: 'Ok' });
        } catch (error) {
            console.error('Error submitting comment:', error);
        }

        setShowCommentInput(false);
    };

    // Function to get comments for a document
    const handleGetComments = async (document) => {
        setApiStatus(apiStatusConstants.inProgress);
        try {
            const token = localStorage.getItem('customerJwtToken');
            const response = await axios.get(`${domain.domain}/customer-tax-comment/get-comments/${document.document_id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            // Set comments and update status
            if (response.status === 200) {
                setComments(response.data);
                setShowComments(!showComments);
                setSelectedDocument(document);
                setApiStatus(apiStatusConstants.success);
                window.scrollTo(0, 0);
            } else {
                setApiStatus(apiStatusConstants.failure);
            }
        } catch (error) {
            console.error('Error getting comments:', error);
        }
    };


    // Function to delete a document comment
    const onDeleteDocumentComment = async (id) => {
        setApiStatus(apiStatusConstants.inProgress);
        try {
            const token = localStorage.getItem('customerJwtToken');

            // Delete the comment
            await axios.delete(`${domain.domain}/customer-tax-comment/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setApiStatus(apiStatusConstants.success);
            handleGetComments(selectedDocument);
            showAlert({ title: 'Comment Deleted Successfully!', icon: 'success', confirmButtonText: 'Ok' });
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Function to format date and time
    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    };

    // Function to handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Initial form fields
    const initialFormFields = [
        { label: 'Year', name: 'financial_year', type: 'number', placeholder: 'Ex:- 2023' },
        { label: 'Month', name: 'financial_month', type: 'number', placeholder: 'Ex:- 5' },
        { label: 'Quarter', name: 'financial_quarter', type: 'number', placeholder: 'Ex:- 1' },
    ];

    // Function to handle document download
    const handleDownloadClick = async (document) => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const downloadUrl = `http://localhost:8000/customer-tax-document/download/${document.document_id}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const response = await fetch(downloadUrl, { headers });
            const blob = await response.blob();

            setApiStatus(apiStatusConstants.success)
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${document.document_id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    // Function to handle document thumbnail
    const renderDocumentThumbnail = (document) => {
        const fileExtension = document.document_path.split('.').pop().toLowerCase();

        const fileTypeIcons = {
            pdf: <img src={pdf} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            doc: <img src={doc} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            docx: <img src={docx} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            jpg: '🖼️',
            jpeg: '🖼️',
            png: '🖼️',
        };

        // Check if the file extension is in the supported types
        if (fileExtension in fileTypeIcons) {
            return (
                <span style={{ fontSize: '24px' }}>{fileTypeIcons[fileExtension]}</span>
            );
        } else {
            return (
                <span>
                    📁
                </span>
            );
        }
    };

    // Function to render components
    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <div>failure</div>;

            case apiStatusConstants.success:
                return (
                    <CtaSection className="shadow">
                        <DocumentsTableContainer>
                            {documents.length > 0 && (
                                <DocumentTableContainer>
                                    <H1>Documents with Comments</H1>
                                    <DocumentTable>
                                        <thead>
                                            <tr>
                                                <Th>Document</Th>
                                                <Th>Date & Time</Th>
                                                <Th>Review Status</Th>
                                                <Th>Add Comment</Th>
                                                <Th>Comments</Th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documents.map((document) => (
                                                <tr key={document.document_id}>
                                                    <Td>
                                                        <div className="d-flex flex-column">
                                                            <a
                                                                href={`${domain.domain}/customer-tax-document/download/${document.document_id}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                download
                                                                onClick={(e) => handleDownloadClick(document)}
                                                            >
                                                                {renderDocumentThumbnail(document)}
                                                            </a>
                                                            <DocumentName>{document.document_path.split('-')[1]}</DocumentName>
                                                        </div>
                                                    </Td>
                                                    <Td>{formatDateTime(document.created_on)}</Td>
                                                    <Td
                                                        style={{
                                                            color:
                                                                document.comment_status === 'Pending'
                                                                    ? 'orange'
                                                                    : document.comment_status === 'Rejected'
                                                                        ? 'red'
                                                                        : document.comment_status === 'Reviewed'
                                                                            ? 'green'
                                                                            : 'inherit',
                                                        }}
                                                    >
                                                        <strong>{document.review_status}</strong>
                                                    </Td>
                                                    <Td>
                                                        <CommentButton type="button" onClick={() => handleToggleCommentInput(document)}>
                                                            Comment
                                                        </CommentButton>
                                                    </Td>
                                                    <Td>
                                                        <ViewButton type="button" onClick={() => handleGetComments(document)} className="view-button button">
                                                            View
                                                        </ViewButton>
                                                    </Td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </DocumentTable>
                                </DocumentTableContainer>
                            )}

                            {showCommentInput && selectedDocument && (
                                <CommentSectionContainer>
                                    <Lable>
                                        <strong>Comment for Document:</strong>{' '}
                                        <strong style={{ color: `var(--accent-background)` }}>
                                            {documents.find((doc) => doc.document_id === selectedDocument.document_id)?.document_name}
                                        </strong>
                                    </Lable>
                                    <CommentSection>
                                        {initialFormFields.map((field, index) => (
                                            <CommentInputFieldsContainer key={index}>
                                                <Lable htmlFor={field.name}>
                                                    <strong>{field.label}</strong>
                                                </Lable>
                                                <InputField
                                                    type={field.type}
                                                    id={field.name}
                                                    placeholder={field.placeholder}
                                                    name={field.name}
                                                    value={formData[field.name] || ''}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </CommentInputFieldsContainer>
                                        ))}
                                    </CommentSection>
                                    <Lable>
                                        <strong>Comment</strong>
                                    </Lable>
                                    <TextArea
                                        id="commentInput"
                                        rows={6}
                                        value={formData.comment || ''}
                                        placeholder="Write your comment to the document..."
                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    />
                                    <ButtonContainer>
                                        <SendButton type="button" onClick={handleCommentSubmit}>
                                            Send Comment
                                        </SendButton>
                                    </ButtonContainer>
                                </CommentSectionContainer>
                            )}

                            {showComments && (
                                <DocumentTableContainer className="mt-4">
                                    <Lable>
                                        <strong>Comments for Document:</strong>{' '}
                                        <strong style={{ color: `var(--accent-background)` }}> {selectedDocument.document_name}</strong>{' '}
                                    </Lable>
                                    {comments.length > 0 ? (
                                        <DocumentTable>
                                            <thead>
                                                <tr>
                                                    <Th>Document</Th>
                                                    <Th>Comment</Th>
                                                    <Th>Comment Status</Th>
                                                    <Th>Created On</Th>
                                                    <Th>Updated On</Th>
                                                    <Th>Delete</Th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {comments.map((comment) => (
                                                    <tr key={comment.comment_id}>
                                                        <Td>
                                                            <div className="d-flex flex-column">
                                                                <a
                                                                    href={`${domain.domain}/customer-tax-document/download/${selectedDocument.document_id}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    download
                                                                    onClick={(e) => handleDownloadClick(selectedDocument)}
                                                                >
                                                                    {renderDocumentThumbnail(selectedDocument)}
                                                                </a>
                                                                <DocumentName>{selectedDocument.document_path.split('-')[1]}</DocumentName>
                                                            </div>
                                                        </Td>
                                                        <Td>{comment.comment}</Td>
                                                        <Td
                                                            style={{
                                                                color:
                                                                    comment.comment_status === 'Pending'
                                                                        ? 'orange'
                                                                        : comment.comment_status === 'Rejected'
                                                                            ? 'red'
                                                                            : comment.comment_status === 'Reviewed'
                                                                                ? 'green'
                                                                                : 'inherit',
                                                            }}
                                                        >
                                                            <strong>{comment.comment_status}</strong>
                                                        </Td>
                                                        <Td>{formatDateTime(comment.created_on)}</Td>
                                                        <Td>{formatDateTime(comment.updated_on)}</Td>
                                                        <Td>
                                                            <Button title="delete document" onClick={() => onDeleteDocumentComment(comment.comment_id)}>
                                                                <MdDelete size={25} className="text-danger" />
                                                            </Button>
                                                        </Td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </DocumentTable>
                                    ) : (
                                        <p className="text-danger">No Comments to this document.</p>
                                    )}
                                </DocumentTableContainer>
                            )}
                        </DocumentsTableContainer>
                    </CtaSection>
                );

            case apiStatusConstants.inProgress:
                return <SweetLoading />;

            default:
                return null;
        }
    };

    const EmptyDocumentsState = () => (
        <EmptyDocumentContainer>
            <img src={noDoc} alt="Empty Documents State" />
            <H1>No Documents available</H1>
            <p>No tax documents available to add comment. Please upload your tax documents.</p>
        </EmptyDocumentContainer>
    );


    return (
        <div className="d-flex">
            <Sidebar />
                <CommentDocumentContainer>
                <BreadCrumb />
                <H1>Comment on Document</H1>
                <CommentDescription>
                    Welcome to our Comment Document service! Add comments to the documents for your tax return process.
                </CommentDescription>
                {documents.length > 0 ? renderComponents() : EmptyDocumentsState()}
                {message}
            </CommentDocumentContainer>            
        </div>
    );
};

export default CommentDocument;
