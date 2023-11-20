import React, { useEffect, useState } from 'react';
import './taxInterview.css';
import axios from 'axios';
import domain from '../../domain/domain';
import { MdDelete } from 'react-icons/md';
import Sidebar from '../SideBar/sidebar';

const TaxInterview = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    const [documents, setDocuments] = useState([]);
    const user = JSON.parse(localStorage.getItem('currentUser'))
    const accessToken = localStorage.getItem('customerJwtToken');

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                const filteredData = response.data.documents.filter(document => {
                    return document.customer_id === user.user_id
                })
                setDocuments(filteredData); 
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, [user.user_id,accessToken]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
    };

    const handleUpload = async (e) => {
        e.preventDefault(); // Prevent form submission

        try {
            if (!selectedFile) {
                setErrorMsg('Please select a file to upload.');
                return;
            }

            // Implement your upload logic here, e.g., send the file to the server
            // const formData = new FormData();
            formData.append('file', selectedFile);

            console.log(formData);

            const response = await axios.post(`${domain.domain}/customer-tax-document/upload`, { file: selectedFile });

            console.log(response)
            // Clear selected file after successful upload
            setSelectedFile(null);

            // Refetch the updated document list
            const updatedDocuments = await axios.get(`${domain.domain}/customer-tax-document`);
            setDocuments(updatedDocuments.data.documents);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const initialFormFields = [
        { label: 'Year', name: 'financial_year', type: 'number', placeholder: 'Ex:- 2023' },
        { label: 'Month', name: 'financial_month', type: 'number', placeholder: 'Ex:- 5' },
        { label: 'Quarter', name: 'financial_quarter', type: 'number', placeholder: 'Ex:- 1' }
    ];

    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    };

    const onDeleteDocument = async (id) => {
        const result = window.confirm("Are you sure you want to delete this document?");
        if (result) {
            try {
                const response = await axios.delete(`${domain.domain}/customer-tax-document/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log(response);
                setDocuments((prevDocuments) => prevDocuments.filter(document => document.document_id !== id));
            } catch (error) {
                console.error('Error deleting document:', error.message);
            }
        }
    };


    return (
            <div className='d-flex'>
            <Sidebar/>
            <div className="tax-interview-container" onDragOver={handleDragOver} onDrop={handleDrop}>
                <h1>Tax Interview</h1>
                <p className='tax-description'>
                    Welcome to our Tax Interview service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
                </p>
                <div className='cta-section shadow'>
                    <form onSubmit={handleUpload} encType="multipart/form-data" className='form-container'>
                        <div className='d-flex flex-column flex-md-row'>
                            {initialFormFields.map((field, index) => (
                                <div className="mb-2 d-flex flex-column m-2" key={index}>
                                    <div className='d-flex justify-content-between'>
                                        <label htmlFor={field.name} className="form-label text-dark m-0">
                                            {field.label}
                                        </label>
                                    </div>
                                    <input
                                        type={field.type}
                                        className="p-2 text-dark w-100" style={{ border: '1px solid grey', borderRadius: '4px', outline: 'none' }}
                                        id={field.name}
                                        placeholder={field.placeholder}
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            ))}
                        </div>
                        <input type="file" onChange={handleFileChange} name='documents' style={{ display: 'none' }} />
                        <div
                            className='drag-drop-area'
                            onClick={() => document.querySelector('input[type="file"]').click()}
                        >
                            <p>Drag & Drop or Click to Upload</p>
                            <img src='https://www.computerhope.com/jargon/d/doc.png' alt="Document" className="document-image img-fluid" />
                        </div>
                        {errorMsg && <p className='text-danger'>{errorMsg}</p>}
                        <button className='btn upload-button' type='submit'>
                            Upload Tax Documents
                        </button>
                    </form>

                    {documents.length > 0 &&
                        <div className="document-table-container">
                            <h4 className='text-dark'>Uploaded Documents</h4>
                            <table className="document-table">
                                <thead>
                                    <tr>
                                        <th>Document Name</th>
                                        <th>Date & Time</th>
                                        <th>Assigned Status</th>
                                        <th>Review Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document) => (
                                        <tr key={document.document_id}>
                                            <td>{document.document_path}</td>
                                            <td>{formatDateTime(document.created_on)}</td>
                                            <td>{document.assigned_status}</td>
                                            <td>{document.review_status}</td>
                                            <td>
                                                <button className='btn btn-light ml-2' title='delete document' onClick={() => {
                                                    onDeleteDocument(document.document_id)
                                                }}>{<MdDelete size={25} className='text-danger' />}</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }

                </div>
            </div>
            </div>
    );
}

export default TaxInterview;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const TaxInterview = () => {
//     const [fileData, setFileData] = useState(null);
//     const [fileList, setFileList] = useState([]);

//     useEffect(() => {
//         const fetchFiles = async () => {
//             try {
//                 const response = await axios.get('http://localhost:6000/uploads');
//                 setFileList(response.data.files);
//             } catch (error) {
//                 console.error('Error fetching files:', error);
//             }
//         };

//         fetchFiles();
//     }, []);


//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         setFileData(file);
//     };

//     const uploadFile = (e) => {
//         e.preventDefault();

//         if (!fileData) {
//             alert("Please select a file to upload.");
//             return;
//         }

//         const data = new FormData();
//         data.append("file", fileData);

//         axios({
//             method: "POST",
//             url: "http://localhost:6000/upload",
//             data: data,
//         }).then((res) => {
//             alert(res.data.message);
//         });
//     };

//     console.log(fileList)

//     return (
//         <div className='mt-5 ml-5' style={{height:'100vh', paddingTop:'200px'}}>
//             <input type="file" onChange={handleFileChange} />
//             <img src="uploads/1700215171110-2023-05-15.png" alt="Uploaded"/>
//             <button onClick={uploadFile}>Upload File</button>
//             <div>
//                 <h2>Uploaded Files</h2>
//                 <ul>
//                     {fileList.map((file) => (
//                         <li key={file.filename}>
//                             <img
//                                 src={`uploads/${file.path}`}
//                                 alt={file.originalname}
//                                 style={{ maxWidth: '200px', maxHeight: '200px' }}
//                             />{file.path}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default TaxInterview;
