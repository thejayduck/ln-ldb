import styles from '../../styles/components/Button.module.css'
import { motion } from 'framer-motion';

export interface ButtonProps {
    title: string,
    icon: string,
    onClick: () => void,
    href: string
}

export default function Button({ title, icon, onClick, href }: ButtonProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}

            className={styles.button}
            onClick={onClick}
        >
            {title && <a href={href}> {title} {icon && <i className={icon} />}</a>}
        </motion.div>
    );
}

export interface FloatingButtonProps extends ButtonProps {
    hoverTitle: string,
}

export function FloatingButton({ hoverTitle, title, icon, href, onClick }: FloatingButtonProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}

            className={styles.floatingButton}
            onClick={onClick}
            title={hoverTitle}
        >
            <a href={href}><i className={icon} /> {title}</a>
        </motion.div>
    );
}

// TODO put footerStyles into styles

import footerStyles from '../../styles/components/footer.module.css'

export function FooterButton({ title, icon, onClick, href }: ButtonProps) {
    return (
        <a
            title={title}
            className={footerStyles.footerButton}
            onClick={onClick}
            href={href}
        ><i className={icon} /></a>
    );
}