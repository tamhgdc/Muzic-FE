import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactListMusic from "../../../components/ListMusic/ReactListMusic";
import ReactPlayList from "../../../components/PlayList/ReactPlayList";
import { useTitle } from "../../../core/customHook";
import MusicUserAction from "../../../redux/actions/MusicUserAction";
import ReactPageNotFound from "../../PageNotFound/ReactPageNotFound";

const CategoryScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { slugCategory } = useParams();
    const [ pageNotFound, setPageNotFound ] = useState(false);

    const asyncGetTopMusic = async () => {
        const response = await dispatch(await MusicUserAction.asyncGetMusic(slugCategory));
        if(response.status === 200) {
            dispatch(MusicUserAction.actSetListMusic(response.data.data));
            dispatch(MusicUserAction.actSetTitleListMusic(response.data.data[0]?.categoryId.category || "Thể loại"));
        }
        if(response.status === 400) {
            setPageNotFound(true);
        }
    }

    useEffect(() => {
        if(slugCategory === "all") {
            navigate('/');
        }
        else {
            asyncGetTopMusic();
        }
    }, [slugCategory])

    if(pageNotFound) return <ReactPageNotFound/>;

    return (
        <div className="user-page">
            <ReactListMusic/>
            <ReactPlayList/>
        </div>
    )
}

export default CategoryScreen;