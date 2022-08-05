import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../../../core/customHook";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from "react-redux";
import classnames from 'classnames';
import './style.scss';
import ContactAction from "../../../redux/actions/ContactAction";

const ContactScreen = () => {
    useTitle("Liên hệ");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // validate form contact
    const validateContactSchema = yup.object().shape({
        email: yup.string().email('Email không hợp lệ').required('Không thể bỏ trống'),
        title: yup.string().required('Không thể bỏ trống'),
        content: yup.string().required('Không thể bỏ trống')
    })

    // use hook form 
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({resolver: yupResolver(validateContactSchema)});

    const onSubmitContact = async (data) => {
        const response = await dispatch(await ContactAction.asyncSubmitContact(data));
        if(response.status === 200) {
            reset();
        }
    }

    return (
        <div className="user-page contact-user-page">
            <div className='contact-content'>
                <div className='contact-title mg-tb-20'>
                    <h3 className="title-format">Liên hệ với chúng tôi</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmitContact)} className='contact-form'>
                    <div>
                        <label className={classnames("d-block mg-b-10")} htmlFor="email">Email của bạn</label>
                        <input {...register('email')} type="text" className={classnames("width-250", `${errors.email ? "border border-danger" : ""}`)} id="email" placeholder="abc123@gmail.com"/>
                        <p className="text-danger">{errors.email?.message}</p>
                    </div>
                    <div>
                        <label className={classnames("d-block mg-tb-10")} htmlFor="title">Chủ đề</label>
                        <select className="width-180" {...register('title')} defaultValue={"music"}>
                            <option value={"music"}>Bài hát</option>
                            <option value={"error"}>Gặp lỗi khi sử dụng</option>
                            <option value={"orther"}>Vấn đề khác</option>
                        </select>
                        <p className="text-danger">{errors.title?.message}</p>
                    </div>
                    <div>
                        <label className={classnames("d-block mg-tb-10")} htmlFor="content">Nội dung</label>
                        <textarea {...register('content')} type="content" className={classnames("width-250", `${errors.content ? "border border-danger" : ""}`)} id="content" placeholder="abcxyz..."/>
                        <p className="text-danger">{errors.content?.message}</p>
                    </div>
                    <div className="mg-t-20" style={{"textAlign": "center"}}>
                        <button className={classnames("width-250 btn-custom")} disabled={isSubmitting} type="submit">Gửi liên hệ</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContactScreen;