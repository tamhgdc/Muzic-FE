import { useEffect, useState } from 'react';
import classnames from 'classnames';
import "./style.scss";
import { useTitle } from '../../../core/customHook';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../core/utils/supports';
import { Modal } from 'react-bootstrap';
import ContactAction from '../../../redux/actions/ContactAction';

const ContactManagementScreen = () => {
    useTitle("Quản lý liên hệ");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ listContact, setListContact ] = useState([]); 
    const [ titleContact, setTitleContact ] = useState("all");

    const onChangeTitleContent = async () => {
        const response = await dispatch(await ContactAction.asyncGetContact(titleContact));
        if(response.status === 200) {
            setListContact(response.data.data);
        }
        if(response.status === 401) {
            navigate('/admin');
        }
    }

    useEffect(() => {
        onChangeTitleContent();
    }, [titleContact])


    const [ viewContact, setViewContact ] = useState(null);
    const [ indexViewContact, setIndexViewContact ] = useState(null);
    const [ showModalView, setShowModalView ] = useState(false);

    const handleShowModalView = () => {
        setShowModalView(true);
    }

    const handleCloseModalView = () => {
        setShowModalView(false);
        setViewContact(null);
        setIndexViewContact(null);
    }

    const onViewContact = async (contact, index) => {
        const response = await dispatch(await ContactAction.asyncViewContact(contact._id));
        if(response.status === 200) {
            setViewContact(contact);
            handleShowModalView(index);
            setListContact([
                ...listContact.slice(0, index),
                response.data.data,
                ...listContact.slice(index + 1)
            ]);
        }
        if(response.status === 401) {
            navigate('/admin');
        }
    }

    const onDeleteContact = async () => {
        const response = await dispatch(await ContactAction.asyncDeleteContact(viewContact._id));
        if(response.status === 200) {
            await onChangeTitleContent();
            handleCloseModalView();
        }
        if(response.status === 401) {
            navigate('/admin');
        }
    }


    return(
        <div className={classnames("admin-page", "contact-admin-page")}>
            <div className='contact-header mg-b-15'>
                <form>
                    <select id="category" defaultValue={titleContact} onChange={(e) => setTitleContact(e.target.value)}>
                        <option value={"all"}>Tất cả</option>
                        <option value={"music"}>Bài hát</option>
                        <option value={"error"}>Gặp lỗi khi sử dụng</option>
                        <option value={"orther"}>Vấn đề khác</option>
                    </select><br/>
                </form>
                <span className="mg-l-20">Tổng số: { listContact.length }</span>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Chủ đề</th>
                            <th>Email</th>
                            <th>Thời gian</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    { listContact.length > 0 ?
                    <tbody>
                        { listContact.map((contact, index) => {
                            return (
                                <tr key={contact._id}>
                                    <td>{contact.title}</td>
                                    <td>{contact.email}</td>
                                    <td>{formatDate(contact.createdAt)}</td>
                                    <td>{contact.isSeen ? "Đã xem" : "Chưa xem"}</td>
                                    <td>
                                        <button className={classnames("mg-r-10", "btn-warning")} onClick={() => onViewContact(contact, index)}>Đọc</button>
                                    </td>
                                </tr>
                            )
                        }) }
                    </tbody>
                    :
                    <tbody>
                        <tr>
                            <td colSpan={5}>Không có liên hệ nào</td>
                        </tr>
                    </tbody> }
                </table>
            </div>


            <Modal show={showModalView} enforceFocus={false} className="modal-min">
                    <Modal.Header>
                        <Modal.Title>Đọc liên hệ</Modal.Title>
                        <button className={classnames("btn-close")} onClick={handleCloseModalView}><i className="fas fa-times"></i></button>
                    </Modal.Header>
                    <Modal.Body>
                        { viewContact &&
                            <form className='contact-form'>
                                <div>
                                    <label className={classnames("d-block mg-b-10")} htmlFor="email">Email</label>
                                    <input type="text" defaultValue={viewContact.email} className={classnames("width-350")} id="email" placeholder="abc123@gmail.com" readOnly/>
                                </div>
                                <div>
                                    <label className={classnames("d-block mg-tb-10")} htmlFor="title">Chủ đề</label>
                                    <select className="width-180" defaultValue={viewContact.title} readOnly>
                                        <option value={"music"}>Bài hát</option>
                                        <option value={"error"}>Gặp lỗi khi sử dụng</option>
                                        <option value={"orther"}>Vấn đề khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={classnames("d-block mg-tb-10")} htmlFor="content">Nội dung</label>
                                    <textarea type="content" className={classnames("width-350 mg-b-15")} defaultValue={viewContact.content} id="content" placeholder="abcxyz..." readOnly/>
                                </div>
                            </form>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn-danger" onClick={() => onDeleteContact(viewContact._id, indexViewContact)}>Xóa</button>
                        <button className="btn-default" onClick={handleCloseModalView}>Đóng</button>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}

export default ContactManagementScreen;