import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactListMusic from "../../../components/ListMusic/ReactListMusic";
import ReactPlayList from "../../../components/PlayList/ReactPlayList";
import { useQuery, useTitle } from "../../../core/customHook";
import MusicUserAction from "../../../redux/actions/MusicUserAction";

const HomeScreen = () => {
    useTitle("Trang chủ");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const keySearch = useQuery().get('keySearch');

    const asyncGetTopMusic = async () => {
        if(keySearch !== null && keySearch != undefined && keySearch !== "") {
            const response = await dispatch(await MusicUserAction.asyncGetMusic(undefined, keySearch));
            if(response.status === 200) {
                dispatch(MusicUserAction.actSetListMusic(response.data.data));
                dispatch(MusicUserAction.actSetTitleListMusic(`Tìm kiếm bài hát với từ khóa "${keySearch}"`));
            }
        }
        else {
            const response = await dispatch(await MusicUserAction.asyncGetMusic("all"));
            if(response.status === 200) {
                dispatch(MusicUserAction.actSetListMusic(response.data.data));
                dispatch(MusicUserAction.actSetTitleListMusic("Top bài hát hay nhất"));
            }
        }
    }

    useEffect(() => {
        asyncGetTopMusic();
    }, [keySearch])


    return (
        <div className="user-page">
            <ReactListMusic/>
            <ReactPlayList/>
        </div>
    )
}

export default HomeScreen;