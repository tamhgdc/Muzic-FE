import { useNavigate } from "react-router-dom";
import { useTitle } from "../../../core/customHook";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from "react-redux";
import classnames from 'classnames';
import './style.scss';
import AuthAction from "../../../redux/actions/AuthAction";
import { useEffect } from "react";

const RegisterScreen = () => {
    useTitle("Đăng ký");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { authState: { token } }  = useSelector(state => {
        return { authState: state.authState };
    })

    useEffect(() => {
        if(token) navigate('/');
    }, [])

    // validate form register
    const validateRegisterSchema = yup.object().shape({
        username: yup.string().required('Không thể bỏ trống').matches(new RegExp('^[a-zA-Z0-9]{8,}$'), 'Tên đăng nhập chỉ bao gồm chữ, số, tối thiếu 8 ký tự'),
        name: yup.string().required('Không thể bỏ trống').matches(new RegExp('^[a-zA-Z" "]|[à-ú]|[À-Ú]{4,50}$'), 'Tên người dùng chỉ bao gồm chữ, kí tự khoảng trắng, từ 4 - 50 ký tự'),
        email: yup.string().email('Email không hợp lệ').required('Không thể bỏ trống'),
        password: yup.string().required('Không thể bỏ trống').matches(new RegExp('^[a-zA-Z0-9]{8,}$'), 'Mật khẩu chỉ bao gồm chữ, số, tối thiếu 8 ký tự'),
        password_confirm: yup.string().oneOf([yup.ref('password')], "Nhắc lại mật khẩu không đúng").required('Không thể bỏ trống')
    })

    // use hook form 
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({resolver: yupResolver(validateRegisterSchema)});

    const onSubmitRegister = async (data) => {
        const { username, name, email, password } = data;
        const response = await dispatch(await AuthAction.asyncRegister({username, name, email, password, role: "user"}));
        if(response.status === 200) {
            navigate('/login');
        }
    }

    return(
        <div className="user-page register-user-page">
            <div className='register-content'>
                <div className='register-title mg-tb-20'>
                    <h3 className="title-format">Tạo tài khoản mới</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmitRegister)} className='register-form'>
                    <div>
                        <label className={classnames("d-block")} htmlFor="username">Tài khoản</label>
                        <input {...register('username')} type="text" className={classnames("width-300", `${errors.username ? "border border-danger" : ""}`)} id="username" placeholder="Username"/>
                        <p className="text-danger">{errors.username?.message}</p>
                    </div>
                    <div>
                        <label className={classnames("d-block")} htmlFor="name">Tên</label>
                        <input {...register('name')} type="text" className={classnames("width-300", `${errors.name ? "border border-danger" : ""}`)} id="name" placeholder="Name"/>
                        <p className="text-danger">{errors.name?.message}</p>
                    </div>
                    <div>
                        <label className={classnames("d-block")} htmlFor="email">Email</label>
                        <input {...register('email')} type="text" className={classnames("width-300", `${errors.email ? "border border-danger" : ""}`)} id="email" placeholder="Email"/>
                        <p className="text-danger">{errors.email?.message}</p>
                    </div>
                    <div>
                        <label className={classnames("d-block")} htmlFor="password">Mật khẩu</label>
                        <input {...register('password')} type="password" className={classnames("width-300", `${errors.password ? "border border-danger" : ""}`)} id="password" placeholder="Password"/>
                        <p className="text-danger">{errors.password?.message}</p>
                    </div>
                    <div>
                        <label className={classnames("d-block")} htmlFor="password_confirm">Nhắc lại mật khẩu</label>
                        <input {...register('password_confirm')} type="password" className={classnames("width-300", `${errors.password_confirm ? "border border-danger" : ""}`)} id="password_confirm" placeholder="Confirm password"/>
                        <p className="text-danger">{errors.password_confirm?.message}</p>
                    </div>
                    <div className="mg-t-20" style={{"textAlign": "center"}}>
                        <button className={classnames("width-300 btn-custom")} disabled={isSubmitting} type="submit">Đăng ký</button>
                    </div>
                </form>
                <div className="navigate-login" onClick={() => navigate('/login')}>Đăng nhập ngay!</div>
            </div>
        </div>
    )
}

export default RegisterScreen;