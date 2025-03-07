import styles from './index.module.scss';

const SearchRow = ({ children, rowClass, ...args }) => {
    return (
        <div className={`${styles['search-row']} ${rowClass}`} {...args}>
            {children}
        </div>
    );
};
const SearchRowItem = ({
    label,
    children,
    itemClass = '',
    labelStyles = {},
    labelClass = '',
    contentStyles = {},
    contentClass = '',
    ...args
}) => {
    return (
        <div className={`${styles['search-row__item']} ${itemClass}`} {...args}>
            {label && (
                <div
                    className={`${styles['search-item__label']} ${labelClass}`}
                    style={labelStyles}
                >
                    {label}
                </div>
            )}
            {children && (
                <div
                    className={`${styles['search-item__content']} ${contentClass}`}
                    style={contentStyles}
                >
                    {children}
                </div>
            )}
        </div>
    );
};
SearchRow.Item = SearchRowItem;
export default SearchRow;
