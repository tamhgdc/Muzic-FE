import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import MusicUserAction from '../../redux/actions/MusicUserAction';
import './style.scss';
import Pagination from '../Pagination/Pagination';
import { useState } from 'react';
import { useEffect } from 'react';
import ReactNotification from '../Notifications/ReactNotification';
import { cutStringNameSingerMusic } from '../../core/utils/supports';

const ReactListMusic = () => {

    const dispatch = useDispatch();

    const { musicState: { listMusic, titleListMusic, listenedMusic } } = useSelector(state => {
        return { musicState: state.musicState };
    })

    const [currentPage, setCurrentPage] = useState(1);
    const [ currentList, setCurrentList ] = useState([]);

    useEffect(() => {
        onPageChange(1);
    }, [listMusic, titleListMusic])
  	
    const onPageChange = (page) => {
        setCurrentPage(page);
        setCurrentList(listMusic.slice((page - 1) * 12, (page - 1) * 12 + 12));
    }

    // add playlist
    const addPlayList = async (music) => {
        if(listenedMusic.findIndex((musicListened) => musicListened._id === music._id) === -1) {
            dispatch(MusicUserAction.actSetListenedMusic([...listenedMusic, music]));
            ReactNotification('success', "Đã thêm bài hát vào playlist");
        }
        else {
            ReactNotification('warning', "Đã có trong playlist");
        }
    }

    return (
        titleListMusic !== null && 
        <div className='react-list-music'>
            <h3 className='title-list-music title-format'>{titleListMusic}</h3>
            <hr></hr>
            <div className='list-music'>
                { listMusic.length > 0 ? 
                currentList.map((music, index) => {
                    return (
                        <div key={music._id} className='music-card'>
                            <div className='container-image-music tooltip' onClick={() => dispatch(MusicUserAction.actSetForceMusic(music))}>
                                <img src={music.image} alt={`music-image-${music.name}`}></img>
                                <span className='icon-play-music'><i className="far fa-play-circle"></i></span>
                                <span className='tooltip-text tooltip-2'>{music.name}</span>
                            </div>
                            <div>
                                <p className='music-card-name' onClick={() => dispatch(MusicUserAction.actSetForceMusic(music))}>{cutStringNameSingerMusic(music.name)}</p>
                                <p className='music-card-singer'>{music.singer ? cutStringNameSingerMusic(music.singer) : "Không có"}</p>
                            </div>
                            <div className='music-card-action'>
                                <span><i className="fas fa-headphones"></i> {music.viewer}</span>
                                <span className='tooltip'>
                                    <i className="fa-solid fa-sliders" onClick={() => addPlayList(music)}></i>
                                    <span className='tooltip-text tooltip-1'>Thêm vào PlayList</span>
                                </span>
                            </div>
                        </div>
                    )
                })
                :
                <div className='no-list'>Không có bài hát nào</div> }
                {
                    listMusic.length > 0 &&
                    <Pagination
                        siblingCount={1}
                        totalRecords={listMusic.length}
                        currentPage={currentPage}
                        pageSize={12}
                        onPageChange={onPageChange}
                        previousLabel="<<"
                        nextLabel=">>"
                    />
                }
            </div>
        </div>
    )

}

export default ReactListMusic;