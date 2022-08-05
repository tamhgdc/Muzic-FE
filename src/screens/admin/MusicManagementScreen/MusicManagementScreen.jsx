import classnames from 'classnames';
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from 'react';
import { useTitle } from '../../../core/customHook';
import { useNavigate } from 'react-router-dom';
import MusicAdminAction from '../../../redux/actions/MusicAdminAction';
import { Modal } from 'react-bootstrap';
import './style.scss';
import { removeVietnameseTones } from '../../../core/utils/supports';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import Pagination from '../../../components/Pagination/Pagination';

const MusicManagementScreen = () => {

    useTitle("Quản lý bài hát");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ listCategory, setListCategory ] = useState([]);
    const [ listMusic, setListMusic ] = useState([]);
    const [ listRenderMusic, setListRenderMusic ] = useState([]); // render ra màn hình
    const [ slugCategory, setSlugCategory ] = useState("all");

    // pagination page
    const [currentPage, setCurrentPage] = useState(1);

    const onPageChange = (page) => {    
        setCurrentPage(page)
        setListRenderMusic(listMusic.slice((page - 1) * 10, (page - 1) * 10 + 10));
    }

    const asyncGetCategory = async () => {
        const response = await dispatch(await MusicAdminAction.asyncGetCategory());
        if(response.status === 200) {
            setListCategory(response.data.data.categories);
        }
    }

    const asyncGetMusic = async () => {
        const response = await dispatch(await MusicAdminAction.asyncGetMusic(slugCategory));
        if(response.status === 200) {
            await setListMusic(response.data.data);
            setCurrentPage(1);
            setListRenderMusic(response.data.data.slice(0, 10));
        }
    }

    useEffect(() => {
        asyncGetCategory();
    }, [])

    useEffect(() => {
        asyncGetMusic();
    }, [slugCategory])


    // add new category
    // validate form category
    const validateNewCategorySchema = yup.object().shape({
        category: yup.string().required('Không thể bỏ trống').matches(new RegExp('^[a-zA-Z0-9" "]|[à-ú]|[À-Ú]{2,100}$'), 'Thể loại chỉ bao gồm chữ, số và khoảng trắng, từ 2 - 100 ký tự')
    })

    const [ showCreateCategory, setShowCreateCategory ] = useState(false);
    
    const handleShowCreateCategory = () => {
        setShowCreateCategory(true);
    }

    const handleCloseCreateCategory = () => {
        setShowCreateCategory(false);
    }

    // use hook form 
    const { register : register1, handleSubmit : handleSubmit1, formState: { errors : errors1 }, reset: reset1 } = useForm({resolver: yupResolver(validateNewCategorySchema)});
    const [ newCategory, setNewCategory ] = useState(null);

    const onValidateCreateCategory = ({category}) => {
        setNewCategory(category);
        handleShowCreateCategory();
    }

    const onSubmitCreateCategory = async () => {
        const response = await dispatch(await MusicAdminAction.asyncNewCategory(newCategory));
        if(response.status === 401) {
            navigate('/admin/login');
            return;
        }
        setListCategory([
            ...listCategory,
            response.data.data
        ])
        reset1();
        handleCloseCreateCategory();
    }

    // delete category
    const validateDeleteCategorySchema = yup.object().shape({
        categoryId: yup.string().required('Bạn chưa chọn thể loại cần xóa')
    })

    const [ showDeleteCategory, setShowDeleteCategory ] = useState(false);
    
    const handleShowDeleteCategory = () => {
        setShowDeleteCategory(true);
    }

    const handleCloseDeleteCategory = () => {
        setShowDeleteCategory(false);
    }

    // use hook form 
    const { register : register2, handleSubmit : handleSubmit2, formState: { errors : errors2 }, reset: reset2 } = useForm({resolver: yupResolver(validateDeleteCategorySchema)});
    const [ delCategoryId, setDelCategoryId ] = useState(null);

    const onValidateDeleteCategory = async ({categoryId}) => {
        setDelCategoryId(categoryId);
        handleShowDeleteCategory();
    }

    const onSubmitDeleteCategory = async () => {
        const response =  await dispatch(await MusicAdminAction.asyncDeleteCategory(delCategoryId));
        if(response.status === 401) {
            navigate('/admin/login');
            return;
        }
        await asyncGetCategory();
        await asyncGetMusic();
        reset2();
        handleCloseDeleteCategory();
    }

    // Xử lý phần quản lý bài hát
    // lọc theo thể loại
    const onChangeSlugCategory = async (e) => {
        setSlugCategory(e.target.value);
        refSearchMusic.current.value = "";
    }


    // tìm kiếm bài hát
    const refSearchMusic = useRef(null);

    const onChangeSearchMusic = async (e) => {
        if(e.key === "Enter") {
            const keySearch = refSearchMusic.current.value;
            const response = await dispatch(await MusicAdminAction.asyncGetMusic(undefined, keySearch));
            if(response.status === 200) {
                await setListMusic(response.data.data);
                setCurrentPage(1);
                setListRenderMusic(response.data.data.slice(0, 10));
                setSlugCategory("all");
            }
        }
    }

    // upload music
    const [ showUploadMusic, setShowUploadMusic ] = useState(false);

    const handleUploadMusicClose = () => {
        setShowUploadMusic(false);
    }

    const handleUploadMusicShow = () => {
        setShowUploadMusic(true);
    }


    // validate form upload music
    const validateUploadMusic = yup.object().shape({
        name: yup.string().required('Không thể bỏ trống').matches(new RegExp('^[a-zA-Z0-9" "]|[à-ú]|[À-Ú]{2,100}$'), 'Tên bài hát chỉ bao gồm chữ, số và khoảng trắng, từ 2 - 100 ký tự'),
        category: yup.string().required('Không thể bỏ trống'),
        author: yup.string().notRequired(),
        singer: yup.string().notRequired(),
        lyrics: yup.string().notRequired()
    })

    // use hook form 
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({resolver: yupResolver(validateUploadMusic)});


    // submit upload music
    const onSubmitUploadMusic = async (data) => {
        const response = await dispatch(await MusicAdminAction.asyncUploadMusic(data));
        if(response.status === 200) {
            setListRenderMusic([response.data.data, ...listMusic]);
            reset();
            handleUploadMusicClose();
        }
        if(response.status === 401) {
            navigate('/admin/login');
        }
    }

    // edit music
    const [ showEditMusic, setShowEditMusic ] = useState(false);
    const [ updateMusic, setUpdateMusic ] = useState(null);
    const [ indexUpdateMusic, setIndexUpdateMusic ] = useState(null);
    const { register : register3, handleSubmit: handleSubmit3, formState: { errors : errors3, isSubmitting: isSubmitting3 }, reset : reset3 } = useForm({resolver: yupResolver(validateUploadMusic)});

    const handleEditMusicClose = () => {
        setShowEditMusic(false);
        setUpdateMusic(null);
        reset3();
    }

    const handleEditMusicShow = (updateMusic, index) => {
        setShowEditMusic(true);
        setUpdateMusic(updateMusic);
        setIndexUpdateMusic(index);
    }

    const onSubmitEditMusic = async (data) => {
        const response = await dispatch(await MusicAdminAction.asyncEditMusic(updateMusic._id ,data));
        if(response.status === 200) {
            setListRenderMusic([
                ...listRenderMusic.slice(0, indexUpdateMusic),
                response.data.data,
                ...listRenderMusic.slice(indexUpdateMusic + 1)
            ])
            handleEditMusicClose();
        }
        if(response.status === 401) {
            navigate('/admin/login');
        }
    }

    // change image music
    const onSubmitChangeImage = async (image) => {
        const formData = new FormData();
        formData.set('image', image);
        const response = await dispatch(await MusicAdminAction.asyncChangeImage(updateMusic._id , formData));
        if(response.status === 200) {
            setListRenderMusic([
                ...listRenderMusic.slice(0, indexUpdateMusic),
                response.data.data,
                ...listRenderMusic.slice(indexUpdateMusic + 1)
            ])
            handleEditMusicClose();
        }
        if(response.status === 401) {
            navigate('/admin/login');
        }
    }

    // change source music
    const onSubmitChangeSource = async (music) => {
        const formData = new FormData();
        formData.set('music', music);
        const response = await dispatch(await MusicAdminAction.asyncChangeSource(updateMusic._id , formData));
        if(response.status === 200) {
            setListRenderMusic([
                ...listRenderMusic.slice(0, indexUpdateMusic),
                response.data.data,
                ...listRenderMusic.slice(indexUpdateMusic + 1)
            ])
            handleEditMusicClose();
        }
        if(response.status === 401) {
            navigate('/admin/login');
        }
    }
    

    // delete music
    const [ delMusic, setDelMusic ] = useState(null);
    const [ indexDelMusic, setIndexDelMusic ] = useState(null);
    const [ showDeleteMusic, setShowDeleteMusic ] = useState(false);

    const handleShowDeleteMusic = (music, index) => {
        setShowDeleteMusic(true);
        setDelMusic(music);
        setIndexDelMusic(index);
    }

    const handleCloseDeleteMusic = () => {
        setShowDeleteMusic(false);
        setDelMusic(null);
        setIndexDelMusic(null);
    }

    const onSubmitDeleteMusic = async () => {
        const response = await dispatch( await MusicAdminAction.asyncDeleteMusic(delMusic._id));
        if(response.status === 200) {
            setListRenderMusic([
                ...listRenderMusic.slice(0, indexDelMusic),
                ...listRenderMusic.slice(indexDelMusic + 1)
            ])
            handleCloseDeleteMusic();
        }
        if(response.status === 401) {
            navigate('/admin/login');
        }
    }


    return(
        <div className={classnames("admin-page", "music-admin-page")}>
            <div className={classnames("category-management")}>
                <h3 className={"admin-page-title"}>Quản lý thể loại <span>Tổng số thể loại: {listCategory.length} </span></h3>
                <div className={classnames("d-flex")}>
                    <form onSubmit={handleSubmit1(onValidateCreateCategory)} className="mg-r-50">
                        <input {...register1('category')} type={"text"} className={classnames("width-250", `${errors1.category ? "border border-danger" : ""}`)} placeholder='Thêm thể loại'/><br/>
                        <p className="text-danger width-250">{errors1.category?.message}</p>
                        <button type='submit' className={classnames("width-100", "mg-t-10", "btn-custom")}>Thêm thể loại</button>
                    </form>
                    <form onSubmit={handleSubmit2(onValidateDeleteCategory)}>
                        <select {...register2('categoryId')} defaultValue={""}>
                            <option value={""}>Chọn thể loại</option>
                            {listCategory.length > 0 && listCategory.map((category) => {
                                return (
                                    <option key={category._id} value={category._id}>{category.category}</option>
                                )
                            })}
                        </select><br/>
                        <p className="text-danger width-250">{errors2.categoryId?.message}</p>
                        <button type='submit' className={classnames("width-100", "mg-t-10", "btn-danger")}>Xóa thể loại</button>
                    </form>
                </div>
            </div>
            <div className={classnames("music-management")}>
                <h3 className={"admin-page-title"}>Quản lý bài hát</h3>
                <div className={classnames("music-management-action", "mg-b-10")}>
                    <div>
                        <input placeholder="Tìm kiếm bài hát" ref={refSearchMusic} onKeyPress={onChangeSearchMusic}/>
                        <form className="mg-l-20">
                            <select id="category" defaultValue={slugCategory} onChange={onChangeSlugCategory}>
                                <option value={"all"}>Tất cả</option>
                                {listCategory.length > 0 && listCategory.map((category) => {
                                    return (
                                        <option key={category._id} value={category.slug_category}>{category.category}</option>
                                    )
                                })}
                            </select><br/>
                        </form>
                        <span className="mg-l-20">Tổng số: { slugCategory === "all" ? listMusic.length : listRenderMusic.length }</span>
                    </div>
                    <button className={classnames("width-100", "btn-custom")} onClick={handleUploadMusicShow}>Đăng bài hát</button>
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Tên bài hát</th>
                                <th>Ca sĩ</th>
                                <th>Thể loại</th>
                                <th>Lượt nghe</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        { listRenderMusic.length > 0 ?
                        <tbody>
                            { listRenderMusic.map((music, index) => {
                                return (
                                    <tr key={music._id}>
                                        <td>{music.name}</td>
                                        <td>{music.singer || "Không có"}</td>
                                        <td>{music.categoryId.category}</td>
                                        <td>{music.viewer}</td>
                                        <td>
                                            <span className="edit">
                                                <EditOutlined onClick={() => handleEditMusicShow(music, index)} className={classnames("mg-r-20")} />
                                            </span>
                                            <span className="delete">
                                                <DeleteOutlined  onClick={() => handleShowDeleteMusic(music, index)} />
                                            </span>
                                        </td>
                                    </tr>
                                )
                            }) }
                        </tbody>
                        :
                        <tbody>
                            <tr>
                                <td colSpan={5}>Không có bài hát nào</td>
                            </tr>
                        </tbody> }
                    </table>
                    {
                        listRenderMusic.length > 0 && 
                        <Pagination
                            siblingCount={1}
                            totalRecords={listMusic.length}
                            currentPage={currentPage}
                            pageSize={10}
                            onPageChange={onPageChange}
                            previousLabel="<<"
                            nextLabel=">>"
                        />
                    }
                </div>

                {/* modal create new category */}
                <Modal show={showCreateCategory} enforceFocus={false} className="modal-min modal-alert">
                    <Modal.Header>
                        <Modal.Title></Modal.Title>
                        <button className={classnames("btn-close")} onClick={handleCloseCreateCategory}><i className="fas fa-times"></i></button>
                    </Modal.Header>
                    <Modal.Body>
                        Xác nhận thêm thể loại mới?
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn-custom" onClick={onSubmitCreateCategory}>Đồng ý</button>
                        <button className="btn-default" onClick={handleCloseCreateCategory}>Hủy</button>
                    </Modal.Footer>
                </Modal>

                {/* modal create new category */}
                <Modal show={showDeleteCategory} enforceFocus={false} className="modal-min modal-alert">
                    <Modal.Header>
                        <Modal.Title></Modal.Title>
                        <button className={classnames("btn-close")} onClick={handleCloseDeleteCategory}><i className="fas fa-times"></i></button>
                    </Modal.Header>
                    <Modal.Body>
                        Xóa thể loại sẽ xóa tất cả bài hát của thể loại đó! Đồng ý?
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn-custom" onClick={onSubmitDeleteCategory}>Đồng ý</button>
                        <button className="btn-default" onClick={handleCloseDeleteCategory}>Hủy</button>
                    </Modal.Footer>
                </Modal>

                {/* modal upload music */}
                <Modal show={showUploadMusic} enforceFocus={false} className="modal-min">
                    <Modal.Header>
                        <Modal.Title>Tạo bài hát mới</Modal.Title>
                        <button className={classnames("btn-close")} onClick={handleUploadMusicClose}><i className="fas fa-times"></i></button>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit(onSubmitUploadMusic)}>
                            <div>
                                <label className={classnames("d-block mg-tb-10")} htmlFor="name">Tên bài hát</label>
                                <input {...register('name')} type="text" className={classnames("width-350", `${errors.name ? "border border-danger" : ""}`)} id="name" placeholder="Tên bài hát"/>
                                <p className="text-danger width-250">{errors.name?.message}</p>
                            </div>
                            <div>
                                <label className={classnames("d-inline-block mg-tb-20 mg-r-10")} htmlFor="name">Thể loại</label>
                                <select {...register('category')} id="category" defaultValue={""}>
                                    <option value={""}>Chọn thể loại</option>
                                    {listCategory.length > 0 && listCategory.map((category) => {
                                        return (
                                            <option key={category._id} value={category.category}>{category.category}</option>
                                        )
                                    })}
                                </select>
                                <p className="text-danger width-250">{errors.category?.message}</p>
                            </div>
                            <div>
                                <label className={classnames("d-block mg-b-10")} htmlFor="author">Tác giả</label>
                                <input {...register('author')} type="text" className={classnames("width-350", `${errors.author ? "border border-danger" : ""}`)} id="name" placeholder="Tác giả"/>
                                <p className="text-danger width-250">{errors.author?.message}</p>
                            </div>
                            <div>
                                <label className={classnames("d-block mg-tb-10")} htmlFor="singer">Ca sĩ</label>
                                <input {...register('singer')} type="text" className={classnames("width-350", `${errors.singer ? "border border-danger" : ""}`)} id="name" placeholder="Ca sĩ"/>
                                <p className="text-danger width-250">{errors.singer?.message}</p>
                            </div>
                            <div>
                                <label className={classnames("d-block mg-tb-10")} htmlFor="lyrics">Lời bài hát</label>
                                <textarea {...register('lyrics')} type="text" className={classnames("width-350", `${errors.lyrics ? "border border-danger" : ""}`)} id="name" placeholder="Lời bài hát"/>
                                <p className="text-danger width-250">{errors.lyrics?.message}</p>
                            </div>
                            <button className={classnames("width-350 mg-t-10", "btn-custom")} disabled={isSubmitting} type="submit">Đăng bài hát</button>
                        </form>
                    </Modal.Body>
                </Modal>

                {/* modal edit music */}
                <Modal show={showEditMusic} enforceFocus={false} className="modal-lg modal-edit-music">
                    <Modal.Header>
                        <Modal.Title>Cập nhật thông tin bài hát</Modal.Title>
                        <button className={classnames("btn-close")} onClick={handleEditMusicClose}><i className="fas fa-times"></i></button>
                    </Modal.Header>
                    <Modal.Body>
                        { updateMusic !== null &&
                        <>
                            <form onSubmit={handleSubmit3(onSubmitEditMusic)}>
                                <div>
                                    <label className={classnames("d-block mg-tb-10")} htmlFor="name">Tên bài hát</label>
                                    <input {...register3('name')} type="text" defaultValue={updateMusic.name} className={classnames("width-350", `${errors3.name ? "border border-danger" : ""}`)} id="name" placeholder="Tên bài hát"/>
                                    <p className="text-danger width-250">{errors3.name?.message}</p>
                                </div>
                                <div>
                                    <label className={classnames("d-inline-block mg-tb-20 mg-r-10")} htmlFor="name">Thể loại</label>
                                    <select {...register3('category')} id="category" defaultValue={updateMusic.categoryId.category}>
                                        <option value={""}>Chọn thể loại</option>
                                        {listCategory.length > 0 && listCategory.map((category) => {
                                            return (
                                                <option key={category._id} value={category.category}>{category.category}</option>
                                            )
                                        })}
                                    </select>
                                    <p className="text-danger width-250">{errors3.category?.message}</p>
                                </div>
                                <div>
                                    <label className={classnames("d-block mg-b-10")} htmlFor="author">Tác giả</label>
                                    <input {...register3('author')} type="text" defaultValue={updateMusic.author} className={classnames("width-350", `${errors3.author ? "border border-danger" : ""}`)} id="name" placeholder="Tác giả"/>
                                    <p className="text-danger width-250">{errors3.author?.message}</p>
                                </div>
                                <div>
                                    <label className={classnames("d-block mg-tb-10")} htmlFor="singer">Ca sĩ</label>
                                    <input {...register3('singer')} type="text" defaultValue={updateMusic.singer} className={classnames("width-350", `${errors3.singer ? "border border-danger" : ""}`)} id="name" placeholder="Ca sĩ"/>
                                    <p className="text-danger width-250">{errors3.singer?.message}</p>
                                </div>
                                <div>
                                    <label className={classnames("d-block mg-tb-10")} htmlFor="lyrics">Lời bài hát</label>
                                    <textarea {...register3('lyrics')} type="text" defaultValue={updateMusic.lyrics} className={classnames("width-350", `${errors3.lyrics ? "border border-danger" : ""}`)} id="name" placeholder="Lời bài hát"/>
                                    <p className="text-danger width-250">{errors3.lyrics?.message}</p>
                                </div>
                                <button className={classnames("width-350 mg-t-10", "btn-custom")} disabled={isSubmitting3} type="submit">Cập nhật thông tin bài hát</button>
                            </form>
                            <div className='edit-image-source'>
                                <div className='mg-t-30'> 
                                    <img src={updateMusic.image} alt="image-music"></img>
                                    <label className='file-input-label btn-custom' htmlFor="image-input">
                                        Đổi ảnh
                                    </label>
                                    <input type={"file"} id='image-input' name="image" accept='image/*' onChange={(e) => onSubmitChangeImage(e.target.files[0])} hidden></input>
                                </div>
                                <div className='mg-t-50'>
                                    <audio controls>
                                        <source src={updateMusic.music_path} type="audio/mpeg"></source>
                                    </audio>
                                    <label className='file-input-label btn-custom' htmlFor="source-input">
                                        Đổi source nhạc
                                    </label>
                                    <input type={"file"} id='source-input' name="music" accept='audio/*' onChange={(e) => onSubmitChangeSource(e.target.files[0])} hidden></input>
                                </div>
                            </div>
                        </>}
                    </Modal.Body>
                </Modal>

                {/* modal delete music */}
                <Modal show={showDeleteMusic} enforceFocus={false} className="modal-min modal-alert">
                    <Modal.Header>
                        <Modal.Title></Modal.Title>
                        <button className={classnames("btn-close")} onClick={handleCloseDeleteMusic}><i className="fas fa-times"></i></button>
                    </Modal.Header>
                    <Modal.Body>
                        Xác nhận xoá bài hát {delMusic?.name}? 
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn-danger" onClick={onSubmitDeleteMusic}>Xóa</button>
                        <button className="btn-default" onClick={handleCloseDeleteMusic}>Hủy</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default MusicManagementScreen;