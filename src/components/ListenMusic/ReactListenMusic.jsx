import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import MusicUserAction from '../../redux/actions/MusicUserAction';
import classnames from 'classnames';
import './style.scss';
import ReactNotification from '../Notifications/ReactNotification';
import Comment from '../Comment/Comment';
import { listBadWords } from '../../core/utils/bad_words';
import { useNavigate } from 'react-router-dom';


const ReactListenMusic = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { musicState: { forceMusic, listMusic, listenedMusic, comments }, authState: { accountInfo } } = useSelector(state => {
        return { musicState: state.musicState, authState: state.authState };
    })

    const refMusic = useRef();
    const [repeat, setRepeat] = useState(false);
    const [ isPlaying, setIsPlaying ] = useState(null);

    const moveNextSong =  () => {
        let selectedMusic = {};
        const listenedMusicLength = listenedMusic.length;
        if(listenedMusicLength < 1) {
            repeatSong();
            return;
        }
        const forceMusicInListenedMusic = listenedMusic.findIndex((music) => music._id === forceMusic._id);
        if(listenedMusicLength > 0) {
            if(listenedMusicLength === 1 && forceMusicInListenedMusic === 0) {
                repeatSong();
                return;
            }
            else if (listenedMusicLength > 1 && forceMusicInListenedMusic === listenedMusicLength - 1) {
                selectedMusic = listenedMusic[0];
            }
            else {
                selectedMusic = listenedMusic[forceMusicInListenedMusic + 1]
            }
        }
        dispatch(MusicUserAction.actSetForceMusic(selectedMusic));
    }

    const movePrevSong = () => {
        let selectedMusic = {};
        const listenedMusicLength = listenedMusic.length;
        if(listenedMusicLength < 1) {
            repeatSong();
            return;
        }
        const forceMusicInListenedMusic = listenedMusic.findIndex((music) => music._id === forceMusic._id);
        if(listenedMusicLength > 0) {
            if(listenedMusicLength === 1 && forceMusicInListenedMusic === 0) {
                repeatSong();
                return;
            }
            else if (listenedMusicLength > 1 && forceMusicInListenedMusic === 0) {
                selectedMusic = listenedMusic[listenedMusicLength - 1];
            }
            else {
                selectedMusic = listenedMusic[forceMusicInListenedMusic - 1]
            }
        }
        dispatch(MusicUserAction.actSetForceMusic(selectedMusic));
    }

    const repeatSong = async () => {
        await asyncPlayMusic();
        refMusic.current.load();
    }

    const asyncPlayMusic = async () => {
        const response = await dispatch(await MusicUserAction.asyncPlayMusic());
        if(response.status === 200) {
            const musicInListMusic = listMusic.findIndex((music) => music._id === forceMusic._id);
            if(musicInListMusic !== -1) {
                dispatch(MusicUserAction.actSetListMusic([
                    ...listMusic.slice(0, musicInListMusic),
                    response.data.data,
                    ...listMusic.slice(musicInListMusic + 1)
                ]))
            }
        }
    }       

    useEffect(async () => {
        await asyncPlayMusic();
        refMusic.current.load();
        if(forceMusic !== null) { 
            const musicInListenedMusic = listenedMusic.findIndex((music) => music._id === forceMusic._id);
            if(musicInListenedMusic === -1) {
                dispatch(MusicUserAction.actSetListenedMusic([...listenedMusic, forceMusic]));
            }
        }
    }, [forceMusic])

    useEffect(() => {
        refMusic.current.onended = () => {
            if(!repeat) {
                moveNextSong();
            }
            else {
                repeatSong();
            }
        }
        refMusic.current.onpause = () => {
            setIsPlaying(false);
        }
        refMusic.current.onplay = () => {
            setIsPlaying(true);
        }
    }, [refMusic, repeat, forceMusic])

    // tab bar
    const [ showContent, setShowContent ] = useState(false);
    const [ showTab, setShowTab ] = useState(true);
    
    useEffect(() => {
        if(showContent) {
            document.querySelector("body").style.overflow = "hidden";
        }
        else {
            document.querySelector("body").style.overflow = "overlay";
        }
    }, [showContent])

    // process comment

    const showComment = async () => {
        await dispatch(await MusicUserAction.asyncGetAllComment());
        setShowTab(false);
    }

    // add method validate comment 
    function notHaveBadWords(message) {
        return this.test("notHaveBadWords", message, function (value) {
            const { path, createError } = this;
                
            const convertValue = value.replace(/\s/g, "_");
            let checkBadWord = false;

            for(let word of listBadWords) {
                if(checkBadWord) break;
                if(convertValue.includes(word)) {
                    checkBadWord = true;
                    return createError({path, message});
                }
            }
        
            return true;
        });
      }
      yup.addMethod(yup.string, "notHaveBadWords", notHaveBadWords);

    // validate form submit new comment
    const validateCommentSchema = yup.object().shape({
        content: yup.string().required('Hãy nhập bình luận của bạn').max(150, "Tối đa 150 ký tự").notHaveBadWords("Bình luận chứa từ nhạy cảm! Hãy bình luận văn minh, lịch sự!")
    })

    // use hook form 
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({resolver: yupResolver(validateCommentSchema)});

    const onSubmitComment = async (data) => {
        const response = await dispatch(await MusicUserAction.asyncUploadComment(data));
        if(response.status === 401) {
            ReactNotification('error', "Bạn chưa đăng nhập");
            setShowContent(false);
            navigate('/login');
        };
        if(response.status === 200) {
            await dispatch(await MusicUserAction.asyncGetAllComment());
        }
        reset();
    }

    // update comment
    const onUpdateComment = async (id_comment, content, index_comment) => {
        await dispatch(await MusicUserAction.asyncUpdateComment(id_comment, content, index_comment));
    }

    // delete comment
    const onDeleteComment = async (id_comment, index_comment) => {
        await dispatch(await MusicUserAction.asyncDeleteComment(id_comment, index_comment));
    }
    
    return (
        <div className='react-listen-music'>
            { showContent && 
            <div className='content-listen-music'>
                <div className='music-tab mg-tb-20'>
                    <span className={classnames({"music-tab-active": showTab})} onClick={() => setShowTab(true)}>Lời bài hát</span>
                    <span className={classnames({"music-tab-active": !showTab})} onClick={() => showComment()}>Bình luận</span>
                </div>
                { showTab ? 
                    <div className='music-lyrics'>
                        <div className='music-info'>
                            <img src={forceMusic.image} className={isPlaying ? "is-playing" : "is-paused"} alt='image-music'/>
                            <div>
                                <div className='music-name'>{forceMusic.name}</div>
                                <span className='music-auth'>Tác giả: {forceMusic.auth || "Không có"}</span><br></br>
                                <span className='music-singer'>Ca sĩ: {forceMusic.singer || "Không có"}</span>
                            </div>
                        </div>
                        <div className='mg-t-15 pd-b-20'>
                            <div>Lời bài hát</div>
                            <div style={{"whiteSpace": "pre-line"}}>
                            {
                                forceMusic.lyrics || "Không có lời bài hát"
                            }
                            </div>
                        </div>
                    </div>
                    :
                    <div className='music-comment'>
                        <div className='upload-comment'>
                            <form onSubmit={handleSubmit(onSubmitComment)}>
                                <input {...register('content')} className={`${errors.content ? "border border-danger" : ""}`} placeholder="Viết bình luận"/>
                                <button type="submit" disabled={isSubmitting}><i className="fas fa-paper-plane"></i></button>
                            </form>
                            <p className="text-danger mg-t-5">{errors.content?.message}</p>
                        </div>
                        <div className='comment-content mg-t-20'>
                            {
                                comments.length > 0 ? 
                                comments.map((comment, index) => (
                                    <Comment key={comment._id} indexComment={index} comment={comment} onUpdateComment={onUpdateComment} onDeleteComment={onDeleteComment}/>
                                ))
                                :
                                <div className='no-list'>Không có bình luận nào! Hãy bình luận ngay!~~</div>
                            }
                        </div>
                    </div>
                }
                </div>
            }
            <div className='footer-listen-music'>
                <div className='music-info' onClick={() => setShowContent(!showContent)}>
                    <img src={forceMusic.image} alt='image-music'/>
                    <div className='mg-lr-20'>
                        <span className='music-name'>{forceMusic.name}</span><br></br>
                        <span className='music-singer'>{forceMusic.singer}</span>
                    </div>
                    { !showContent ? 
                    <i className="fas fa-chevron-up"></i>
                    :
                    <i className="fas fa-chevron-down"></i> }
                </div>
                <div className='music-control mg-r-15'>
                    { !showContent ? 
                    <i className="fas fa-chevron-up show-content-icon" onClick={() => setShowContent(!showContent)}></i>
                    :
                    <i className="fas fa-chevron-down show-content-icon" onClick={() => setShowContent(!showContent)}></i> }
                    <div className='prev-btn mg-l-15'>
                        <i className={classnames("fas fa-step-backward")} onClick={() => movePrevSong()}></i>
                    </div> 
                    <audio ref={refMusic} controls autoPlay id="audio">
                        <source src={forceMusic.music_path} type="audio/mpeg"></source>
                    </audio>
                    <div className='next-btn'>
                        <i className={classnames("fas fa-step-forward")} onClick={() => moveNextSong()}></i>
                    </div>
                    <div className={repeat ? "repeat" : "non-repeat"}>
                        <i className="fas fa-repeat" onClick={() => setRepeat(!repeat)}></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReactListenMusic;