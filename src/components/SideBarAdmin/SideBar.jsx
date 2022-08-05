import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import AuthAction from "../../redux/actions/AuthAction";
import classnames from "classnames";
import './style.scss';
import { useSelector } from "react-redux";
import { useEffect } from "react";

const SideBar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { authState: { accountInfo, token } } = useSelector(state => {
        return { authState: state.authState };
    })

    const asyncGetAccountInfo = async () => {
        const response = await dispatch(await AuthAction.asyncGetAccountInfo("admin"));
        if(!response) {
            navigate('/admin/login');
        }
    }

    useEffect(async () => {
        if(token !== null && token !== undefined && token !== false) {
            asyncGetAccountInfo();
        }
    }, [])

    const onSubmitLogout = async () => {
        await dispatch(await AuthAction.asyncLogout());
        navigate('/admin/login');
    }

    return(
        accountInfo !== null && <div className={(classnames("left-menu"))}>
            <ul className="nav nav-pills flex-column mb-auto">
                <li>
                    <NavLink to="/admin/home">
                        <span><img src={accountInfo.avatar} atl="avatar"></img><span>{accountInfo.name}</span></span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/admin/account'>
                        <span>Quản lý tài khoản</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/admin/music'>
                        <span>Quản lý bài hát</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/admin/contact'>
                        <span>Quản lý liên hệ</span>
                    </NavLink>
                </li>
                <li onClick={onSubmitLogout}>
                    <a><span>Đăng xuất</span></a>
                </li>
            </ul>
        </div>
    )
}

export default SideBar;