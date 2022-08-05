import classnames from "classnames";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../../../core/customHook";
import { formatDate } from "../../../core/utils/supports";
import AccountAdminAction from "../../../redux/actions/AccountAdminAction";
import "./style.scss";

const AccountManagementScreen = () => {
    useTitle("Quản lý tài khoản");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ listAccount, setListAccount ] = useState([]);
    const [ renderAccount, setRenderAccount ] = useState([]); 
    const [ status, setStatus ] = useState("all");

    const asyncGetListAccount = async () => {
        const response = await dispatch(await AccountAdminAction.asyncGetAllAccount(status));
        if(response.status === 401) {
            navigate('/admin/login');
        }
        if(response.status === 200) {
            setListAccount(response.data.data);
            setRenderAccount(response.data.data);
        }
        return response;
    }

    useEffect(() => {
        asyncGetListAccount();
    }, [status])

    // Tìm kiếm tài khoản
    const onSubmitSearchAccount = (e) => {
        e.preventDefault();
        const key = e.target.value;
        if(key !== "") {
            const ret = listAccount.filter((account) => account.name.includes(key) || account.email.includes(key));
            setRenderAccount(ret);
        }
        else {
            setRenderAccount(listAccount);
        }
    }

    // Lọc tài khoản theo status
    const onSubmitAccountStatus = async (e) => {
        setStatus(e.target.value);
    }

    const [ account, setAccount ] = useState(null);
    const [ index, setIndex ] = useState(null);
    const [ showBlockAccount, setShowBlockAccount ] = useState(false);

    const handleBlockAccountClose = () => {
        setShowBlockAccount(false);
        setAccount(null);
        setIndex(null);
    }

    const handleBlockAccountShow = (account, index) => {
        setShowBlockAccount(true);
        setAccount(account);
        setIndex(index);
    }

    // block account
    const onSubmitBlockAccount = async () => {
        const response = await dispatch(await AccountAdminAction.asyncBlockAccount(account._id));
        if(response.status === 401) {
            navigate('/admin/login');
        }
        if(response.status === 200) {
            asyncGetListAccount();
        }
        handleBlockAccountClose();
    }

    const [ showUnBlockAccount, setShowUnBlockAccount ] = useState(false);
    const handleUnBlockAccountClose = () => {
        setShowUnBlockAccount(false);
        setAccount(null);
        setIndex(null);
    }

    const handleUnBlockAccountShow = (account, index) => {
        setShowUnBlockAccount(true);
        setAccount(account);
        setIndex(index);
    }

    // un block account
    const onSubmitUnBlockAccount = async () => {
        const response = await dispatch(await AccountAdminAction.asyncUnBlockAccount(account._id));
        if(response.status === 401) {
            navigate('/admin/login');
        }
        if(response.status === 200) {
            asyncGetListAccount();
        }
        handleUnBlockAccountClose();
    }

    return(
        <div className={classnames("admin-page account-admin-page")}>
            <div className={classnames("account-admin-action")}>
                <input type={"text"} className={classnames("width-300 mg-tb-20")} placeholder="Tìm kiếm tài khoản" onChange={onSubmitSearchAccount}/>
                <form className={classnames("mg-l-20")}>
                    <select name="status" defaultValue={status} onChange={onSubmitAccountStatus}>
                        <option value="all">Tất cả</option>
                        <option value="active">Hoạt động</option>
                        <option value="block">Bị khóa</option>
                    </select>
                </form>
                <span className="mg-l-20">Tổng số: { renderAccount.length }</span>
            </div>
            <div className="account-table">
                <table>
                    <thead>
                        <tr>
                            <th>Tài khoản</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    { renderAccount.length > 0 ?
                    <tbody>
                        { renderAccount.map((account, index) => {
                            return (
                                <tr key={account._id}>
                                    <td>{account.username}</td>
                                    <td>{account.name}</td>
                                    <td>{account.email}</td>
                                    <td>{formatDate(account.createdAt)}</td>
                                    <td>{account.status}</td>
                                    <td>
                                        { account.status === "active" ? 
                                        <button className="btn-danger" onClick={() => handleBlockAccountShow(account, index)}>Chặn</button> 
                                        : <button className="btn-success" onClick={() => handleUnBlockAccountShow(account, index)}>Bỏ chặn</button> }
                                    </td>
                                </tr>
                            )
                        }) }
                    </tbody>
                    :
                    <tbody>
                        <tr>
                            <td colSpan={6} >Không có tài khoản nào!</td>
                        </tr>
                    </tbody> }
                </table>

                {/* modal block account */}
                <Modal show={showBlockAccount} enforceFocus={false} className="modal-min modal-alert">
                    <Modal.Header>
                        <Modal.Title></Modal.Title>
                        <button className={classnames("btn-close")} onClick={handleBlockAccountClose}><i className="fas fa-times"></i></button>
                    </Modal.Header>
                    <Modal.Body>
                        Xác nhận chặn tài khoản {account?.username}?
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn-custom" onClick={onSubmitBlockAccount}>Đồng ý</button>
                        <button className="btn-default" onClick={handleBlockAccountClose}>Hủy</button>
                    </Modal.Footer>
                </Modal>

                {/* modal hủy block account */}
                <Modal show={showUnBlockAccount} enforceFocus={false} className="modal-min modal-alert">
                    <Modal.Header>
                        <Modal.Title></Modal.Title>
                        <button className={classnames("btn-close")} onClick={handleUnBlockAccountClose}><i className="fas fa-times"></i></button>
                    </Modal.Header>
                    <Modal.Body>
                        Xác nhận bỏ chặn tài khoản {account?.username}?
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn-custom" onClick={onSubmitUnBlockAccount}>Đồng ý</button>
                        <button className="btn-default" onClick={handleUnBlockAccountClose}>Hủy</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default AccountManagementScreen;