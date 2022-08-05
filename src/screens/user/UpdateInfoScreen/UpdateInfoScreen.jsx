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
import AccountUserAction from "../../../redux/actions/AccountUserAction";
import { useEffect } from "react";


const UpdateInfoScreen = () => {
    useTitle("Cập nhật thông tin");

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

    const validateUpdateUserInfoSchema = yup.object().shape({
        name: yup.string().required('Không thể bỏ trống').matches(new RegExp('^[a-zA-Z" "]|[à-ú]|[À-Ú]{4,50}$'), 'Tên người dùng chỉ bao gồm chữ, kí tự khoảng trắng, từ 4 - 50 ký tự'),
        email: yup.string().required('Không thể bỏ trống').email('Email không hợp lệ'),
        address: yup.string(),
        country: yup.string(),
    })

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({resolver: yupResolver(validateUpdateUserInfoSchema)});

    const onSubmitUpdateInfo = async (data) => {
        const response = await dispatch(await AccountUserAction.asyncUpdateInfo(data));
        if(!response) {
            return navigate('/');
        }
        reset();
    }

    const onSubmitChangeAvatar = async (image) => {
        const formData = new FormData();
        formData.set('image', image);
        const response = await dispatch(await AccountUserAction.asyncChangeAvatar(formData));
        if(!response) {
            return navigate('/');
        }
        reset();
    }

    return (
        accountInfo !== null && 
        <div className="user-page update-user-page">
            <div className='login-title mg-tb-20'>
                <h3 className="title-format">Cập nhật thông tin</h3>
            </div>
            <div className="update-user">
                <div className="image-upload">
                    <img src={accountInfo.avatar} alt="image-music"></img>
                    <label className='file-input-label btn-custom' htmlFor="image-input">
                        Đổi ảnh
                    </label>
                    <input type={"file"} id='image-input' name="image" accept='image/*' onChange={(e) => onSubmitChangeAvatar(e.target.files[0])} hidden></input>
                </div>
                <form onSubmit={handleSubmit(onSubmitUpdateInfo)} className='update-form'>
                    <div>
                        <label className={classnames("d-block mg-t-15 mg-b-10")} htmlFor="username">Tên người dùng</label>
                        <input {...register('name')} type="text" className={classnames("width-300", `${errors.name ? "border border-danger" : ""}`)} id="name" defaultValue={accountInfo.name} placeholder="User Name" />
                        <p className="text-danger">{errors.name?.message}</p>
                    </div>
                    <div>
                        <label className={classnames("d-block mg-t-15 mg-b-10")} htmlFor="password">Email</label>
                        <input {...register('email')} type="text" className={classnames("width-300", `${errors.email ? "border border-danger" : ""}`)} id="email" defaultValue={accountInfo.email} placeholder="Email" />
                        <p className="text-danger">{errors.email?.message}</p>
                    </div>
                    <div>
                        <label className={classnames("d-block mg-t-15 mg-b-10")} htmlFor="password">Địa chỉ</label>
                        <input {...register('address')} type="text" className={classnames("width-300", `${errors.address ? "border border-danger" : ""}`)} id="email" defaultValue={accountInfo.address || ""} placeholder="Address" />
                        <p className="text-danger">{errors.address?.message}</p>
                    </div>
                    <div>
                        <label className={classnames("d-block mg-t-15 mg-b-10")} htmlFor="password">Quốc gia</label>
                        <input {...register('country')} type="text" className={classnames("width-300", `${errors.country ? "border border-danger" : ""}`)} id="email" defaultValue={accountInfo.country || ""} placeholder="Country" />
                        <p className="text-danger">{errors.country?.message}</p>
                    </div>

                    <div className="mg-t-20" >
                        <button className={classnames("width-300 btn-custom")} disabled={isSubmitting} type="submit">Cập nhật thông tin</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateInfoScreen