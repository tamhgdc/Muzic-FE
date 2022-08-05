import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../../../core/customHook";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from "react-redux";
import classnames from 'classnames';
import './style.scss';
import AccountUserAction from "../../../redux/actions/AccountUserAction";
import { useEffect } from "react";
import AuthAction from "../../../redux/actions/AuthAction";

const ChangePasswordScreen = () => {
    useTitle("Đổi mật khẩu");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { authState: { token } } = useSelector(state => {
        return { authState: state.authState };
    })

    const asyncGetAccountInfo = async () => {
        const response = await dispatch(await AuthAction.asyncGetAccountInfo("user"));
        if(!response) {
            navigate('/login');
        }
    }

    useEffect(() => {
        asyncGetAccountInfo();
    }, [])

    const validateChangePasswordSchema = yup.object().shape({
        current_password: yup.string().required('Không thể bỏ trống'),
        new_password: yup.string().required('Không thể bỏ trống').matches(new RegExp('^[a-zA-Z0-9]{8,}$'), 'Mật khẩu chỉ bao gồm chữ, số, tối thiếu 8 ký tự'),
    })

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({resolver: yupResolver(validateChangePasswordSchema)});

    const onSubmitChangePassword = async (data) => {
        const response = await dispatch(await AccountUserAction.asyncChangePassword(data));
        if(response.status === 200) {
            reset();
        }
    }


    return (
        <div className="user-page change-password-user-page">
            <div className='change-password-content'>
                <div className='change-password-title mg-tb-20'>
                    <h3 className="title-format">Đổi mật khẩu</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmitChangePassword)} className='change-password-form'>
                    <div>
                        <label className={classnames("d-block mg-tb-10")} htmlFor="username">Mật khẩu hiện tại</label>
                        <input {...register('current_password')} type="password" className={classnames("width-250", `${errors.current_password ? "border border-danger" : ""}`)} id="current_password" placeholder="Current Password"/>
                        <p className="text-danger">{errors.current_password?.message}</p>
                    </div>
                    <div>
                        <label className={classnames("d-block mg-tb-10")} htmlFor="password">Mật khẩu mới</label>
                        <input {...register('new_password')} type="password" className={classnames("width-250", `${errors.new_password ? "border border-danger" : ""}`)} id="new_password" placeholder="New Password"/>
                        <p className="text-danger">{errors.new_password?.message}</p>
                    </div>
                    
                    <div className="mg-t-20" style={{"textAlign": "center"}}>
                        <button className={classnames("width-300 btn-custom")} disabled={isSubmitting} type="submit">Đổi mật khẩu</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePasswordScreen