import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import './style.scss';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import AuthAction from "../../../redux/actions/AuthAction";

const AccountUserScreen = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { authState: { accountInfo } } = useSelector(state => {
        return { authState: state.authState };
    })

    const asyncGetAccountInfo = async () => {
        const response = await dispatch(await AuthAction.asyncGetAccountInfo("user"));
        if(!response) {
            navigate('/login');
        }
    }

    useEffect(async () => {
        asyncGetAccountInfo();
    }, [])


    return (
        accountInfo !== null &&
        <div className="user-page user-info">
            <div className="info">
                <div className="title">
                    <h3 className="title-format">Thông tin cá nhân</h3>
                </div>
                <div className="detail-info">
                    <div className="avatar-user">
                        <img src={accountInfo.avatar} alt="avatar" />
                    </div>
                    <div className="contact-info">
                        <div>
                            <div className="mg-t-15">
                                <span className="title1">Tên người dùng: </span>
                                <span>{accountInfo.name}</span>
                            </div>
                            <div className="mg-t-15">
                                <span className="title1">Email: </span>
                                <span>{accountInfo.email}</span>
                            </div>
                            <div className="mg-t-15">
                                <span className="title1">Địa chỉ: </span>
                                <span>{accountInfo.address || "Không có"}</span>
                            </div>
                            <div className="mg-t-15">
                                <span className="title1">Quốc gia: </span>
                                <span>{accountInfo.country || "Không có"}</span>
                            </div>
                        </div>
                        <button className="btn-custom width-250 mg-t-15" onClick={() => navigate('/update_user_info')}>Cập nhật thông tin</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountUserScreen