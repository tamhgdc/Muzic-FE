import { useSelector } from "react-redux";
import classnames from 'classnames';
import { FadeLoader } from "react-spinners";
import './style.scss';

const ReactSpinner = () => {

    const { loading } = useSelector(state => state.apiState);

    return (
        <div className={classnames("react-spinner",
        {"display-none": !loading})}>
            <div className="loading-call-api">
                <div className="loading-call-api-bar"></div>
            </div>
            < FadeLoader/>
        </div>
    )

} 


export default ReactSpinner;