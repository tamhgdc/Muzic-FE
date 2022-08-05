import './style.scss';

const FooterUser = () => {

    return (
        <div id="footer">
            <div id="infoLeft">
                <li>
                    <i className="fab fa-app-store"></i>
                </li>
                <li>
                    <i className="fab fa-google-play"></i>
                </li>
                <li>
                    <i className="fab fa-facebook-square"></i>
                </li>
                <li>
                    <i className="fab fa-instagram"></i>
                </li>
            </div>
            <li id="infoRight">
                <p>
                    Powered by @nhom
                    <br/>
                    © 2022 musiconline.com. All rights reserved
                </p>
            </li>
        </div>
    )

}

export default FooterUser;