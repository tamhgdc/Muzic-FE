import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
import 'animate.css';

const ReactNotification = (type, message) => {
    switch (type) {
        case "info":
            store.addNotification({
                title: "Info", // The "info" notification doesn't need a title
                message: message,
                type: "info",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: { duration: 1800, showIcon: true }
            });
            break;
        case "success":
            store.addNotification({
                title: "Success",
                message: message,
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: { duration: 1800, showIcon: true }
            });
            break;
        case "warning":
            store.addNotification({
                title: "Warning",
                message: message,
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: { duration: 1800, showIcon: true }
            });
            break;
        case "error":
            store.addNotification({
                title: "Error",
                message: message,
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: { duration: 1800, showIcon: true }
            });
            break;
        default:
            store.addNotification({
                title: "Warning",
                message: message,
                type: "default",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: { duration: 1800, showIcon: true },
            });
    }
}

export default ReactNotification;