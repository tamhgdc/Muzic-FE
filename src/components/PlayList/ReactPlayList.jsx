import classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import MusicUserAction from "../../redux/actions/MusicUserAction";
import ReactNotification from "../Notifications/ReactNotification";
import './style.scss';

const ReactPlayList = () => {

    const dispatch = useDispatch();

    const { musicState: { listMusic , listenedMusic, forceMusic } } = useSelector(state => {
        return { musicState: state.musicState };
    })

    const playMusic = (musicPlay) => {
        const musicInListMusic = listMusic.findIndex((music) => music._id === musicPlay._id);
        if(musicInListMusic !== -1) {
            dispatch(MusicUserAction.actSetForceMusic(musicPlay));
        } 
    }

    const deleteMusicFromPlayList = (index) => {
        dispatch(MusicUserAction.actSetListenedMusic([
            ...listenedMusic.slice(0, index),
            ...listenedMusic.slice(index + 1)
        ]))
        ReactNotification('success', "Đã xóa bài hát ra khỏi playlist")
    }

    const deletePlayList = () => {
        if(listenedMusic.length > 0) {
            dispatch(MusicUserAction.actSetListenedMusic([]))
            ReactNotification('success', "Đã xóa playlist");
        }
    }

    return(
        <div className="react-play-list">
            <h3 className='title-list-music title-format'>Play list <span onClick={() => deletePlayList()}>Xóa playlist</span></h3>
            <hr className="mg-t-10"/>
            {
                listenedMusic.length > 0 ?
                <>
                    <div className="play-list">
                        {listenedMusic.map((music, index) => {
                            return (
                                <div key={music._id}>
                                    <div className={classnames("music-play-list" , {"music-active": music._id === forceMusic?._id})}>
                                        <div className="music-info">   
                                            <img src={music.image} className={classnames({ "is-playing": music._id === forceMusic?._id })} alt={`music-image-${music.name}`}></img>
                                            <div>
                                                <span className="music-name">{music.name}</span><br/>
                                                <span className="music-singer">{music.singer || "Không có"}</span>
                                            </div>
                                        </div>
                                        <div className="action">
                                            <i className="fa-solid fa-play" onClick={() => playMusic(music)}></i>
                                            <i className="fa-solid fa-minus" onClick={() => deleteMusicFromPlayList(index)}></i>
                                        </div>
                                    </div>
                                    <hr/>
                                </div>
                            )
                        })}
                    </div>
                </>
                :
                <div className="no-list">Không có bài hát nào trong PlayList!</div>
            }
        </div>
    )
}

export default ReactPlayList;