import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../../../core/customHook";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from "react-redux";
import AuthAction from "../../../redux/actions/AuthAction";
import classnames from 'classnames';
import './style.scss';

const LoginAdminScreen = () => {
    useTitle("Login Admin");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { authState: { token } }  = useSelector(state => {
        return { authState: state.authState };
    })

    useEffect(() => {
        if(token) navigate('/admin');
    }, [])

    // validate form login
    const validateLoginSchema = yup.object().shape({
        username: yup.string().required('Không thể bỏ trống'),
        password: yup.string().required('Không thể bỏ trống')
    })

    // use hook form 
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(validateLoginSchema)});

    const onSubmitLogin = async (data) => {
        const response = await dispatch(await AuthAction.asyncLogin({...data, role: "admin"}));
        if(response.status === 200) {
            navigate('/admin/home');
        }
    }
    
    return (
        <div className="login-admin-page">
            <form onSubmit={handleSubmit(onSubmitLogin)}>
                <h1>Đăng nhập quản trị viên</h1>
                <div>
                    <label className={classnames("d-block mg-b-10")} htmlFor="username">Tên đăng nhập</label>
                    <input {...register('username')} type="text" className={classnames("width-300", `${errors.username ? "border border-danger" : ""}`)} id="username" placeholder="Username"/>
                    <p className="text-danger">{errors.username?.message}</p>
                </div>
                <div>
                    <label className={classnames("d-block mg-tb-10")} htmlFor="password">Mật khẩu</label>
                    <input {...register('password')} type="password" className={classnames("width-300", `${errors.password ? "border border-danger" : ""}`)} id="password" placeholder="Password"/>
                    <p className="text-danger">{errors.password?.message}</p>
                </div>
                <button className={classnames("width-300 mg-t-15 btn-custom")} disabled={isSubmitting} type="submit">Đăng nhập</button>
            </form>
        </div>
    )
}

export default LoginAdminScreen;