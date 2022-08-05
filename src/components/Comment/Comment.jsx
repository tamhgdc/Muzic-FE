import { useState } from "react";
import { useSelector } from "react-redux";
import { changeTime } from "../../core/utils/supports.js";
import "./style.scss";

const Comment = ({comment, indexComment, onUpdateComment, onDeleteComment}) => {
    const { authState: { accountInfo }} = useSelector((state) => {
        return { authState: state.authState };
    }) 

    const [ editComment, setEditComment ] = useState(false);
    const [ contentComment, setContentComment ] = useState(`${comment.content}`);

    return (
        <div>
            <div>
                <img src={comment.accountId?.avatar} alt="user-avatar"/>
            </div>
            <div className="content-comment">
                <div className={`${editComment && "edit-comment"} comment-content-info`}>
                    <div className="account-name">{comment.accountId.name}</div>
                    {
                        editComment ? 
                        <>
                            <div className="input-edit-comment">
                                <input className="form-control" defaultValue={comment.content} onChange={(e) => {setContentComment(e.target.value)}}></input>
                                {contentComment !== comment.content && contentComment !== "" ?
                                    <i className="fas fa-save" onClick={() => {onUpdateComment(comment._id, contentComment, indexComment); setEditComment(false)}}></i>
                                    :   
                                    <i className="fas fa-save disabled"></i>
                                }
                            </div>
                            <span className="action-comment" style={{"fontSize": "12px"}} onClick={() => setEditComment(false)}>Hủy</span>
                        </>
                        :
                        <div className="mg-t-5">{comment.content}</div>
                    }
                    
                </div>
                <div className="text-secondary mg-t-5" style={{"fontSize": "12px"}}>
                    {(accountInfo?.accountId === comment.accountId._id) ?
                        <>
                        <span className="action-comment" onClick={() => onDeleteComment(comment._id, indexComment)}>Xóa</span>
                        <span> . </span>
                        </>
                    :   <></>
                    }
                    {accountInfo?.accountId === comment.accountId._id ?
                        <>
                        <span className="action-comment" onClick={() => setEditComment(true)}>Chỉnh sửa</span>
                        <span> . </span>
                        </>
                    :   <></>
                    }
                    <span><i className="fas fa-globe-asia"></i> {changeTime(comment.createdAt)}</span>
                </div>
            </div>
        </div>
    )
}

export default Comment;