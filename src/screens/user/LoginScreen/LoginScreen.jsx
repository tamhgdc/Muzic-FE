import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../../../core/customHook";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from "react-redux";
import classnames from 'classnames';
import './style.scss';
import AuthAction from "../../../redux/actions/AuthAction";
import { useEffect } from "react";

const LoginScreen = () => {
    useTitle("Đăng nhập");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { authState: { token } }  = useSelector(state => {
        return { authState: state.authState };
    })

    useEffect(() => {
        if(token) navigate('/');
    }, [])

    // validate form login
    const validateLoginSchema = yup.object().shape({
        username: yup.string().required('Không thể bỏ trống'),
        password: yup.string().required('Không thể bỏ trống'),
    })

    // use hook form 
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({resolver: yupResolver(validateLoginSchema)});

    const onSubmitLogin = async (data) => {
        const response = await dispatch(await AuthAction.asyncLogin({...data, role: "user"}));
        if(response.status === 200) {
            await dispatch(await AuthAction.asyncGetAccountInfo("user"));
            navigate('/');
        }
        reset();
    }

    return(
        <div className="user-page login-user-page">
            <div className='login-content'>
                <div className='login-title mg-tb-20'>
                    <h3 className="title-format">Đăng nhập</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmitLogin)} className='login-form'>
                    <div>
                        <label className={classnames("d-block mg-tb-10")} htmlFor="username">Tài khoản</label>
                        <input {...register('username')} type="text" className={classnames("width-250", `${errors.username ? "border border-danger" : ""}`)} id="username" placeholder="Username"/>
                        <p className="text-danger">{errors.username?.message}</p>
                    </div>
                    <div>
                        <label className={classnames("d-block mg-tb-10")} htmlFor="password">Mật khẩu</label>
                        <input {...register('password')} type="password" className={classnames("width-250", `${errors.password ? "border border-danger" : ""}`)} id="password" placeholder="Password"/>
                        <p className="text-danger">{errors.password?.message}</p>
                    </div>
                    <div className="mg-t-20" style={{"textAlign": "center"}}>
                        <button className={classnames("width-300 btn-custom")} disabled={isSubmitting} type="submit">Đăng nhập</button>
                    </div>
                </form>
                <div className="navigate-register" onClick={() => navigate('/register')}>Tạo tài khoản mới!</div>
            </div>
        </div>
    )
}

export default LoginScreen;