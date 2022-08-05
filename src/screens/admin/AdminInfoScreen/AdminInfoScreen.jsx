import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import './style.scss';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import AuthAction from "../../../redux/actions/AuthAction";
const AdminInfoScreen = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { authState: { accountInfo } } = useSelector(state => {
        return { authState: state.authState };
    })

    const asyncGetAccountInfo = async () => {
        const response = await dispatch(await AuthAction.asyncGetAccountInfo("admin"));
        if(!response) {
            navigate('/admin/login');
        }
    }

    useEffect(async () => {
        asyncGetAccountInfo();
    }, [])

    return (
        accountInfo !== null && 
        <div className={classnames("admin-page", "info-admin-page")}>
            <h1>Chào mừng đến với trang quản trị web nghe nhạc</h1>
            <div>
                <img src={accountInfo.avatar} alt="avatar"></img>
                <div className="info-admin">
                    <div>
                        <span>Tên</span>
                        <span>{accountInfo.name}</span>
                    </div>
                    <div>
                        <span>Email</span>
                        <span>{accountInfo.email}</span>
                    </div>
                    <div>
                        <span>Địa chỉ</span>
                        <span>{accountInfo.address || "Không có"}</span>
                    </div>
                    <div>
                        <span>Quốc gia</span>
                        <span>{accountInfo.country || "Không có"}</span>
                    </div>
                    <div>
                        <span>Vai trò</span>
                        <span>{accountInfo.role}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminInfoScreen;
