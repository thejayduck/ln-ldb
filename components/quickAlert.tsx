// @ts-nocheck
import styles from "styles/components/QuickAlert.module.scss";

const alertIcon = {
    "information": "bx-fw bx bx-check bx-lg",
    "error": "bx-fw bx bx-error bx-lg",
};

export default function QuickAlert({ message, severity }) {

    return (
        <div className={`${styles.container} flex flexBetween`}>
            <i className={`${alertIcon[severity]} ${styles.icon}`} />
            <a className={styles.message} title={message}>{message}</a>
        </div>
    );

}