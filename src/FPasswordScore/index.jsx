import styles from './index.module.scss'

export default ({ value }) => {
    const score = [
        {
            color: '#a0133d',
            label: '非常弱'
        },
        {
            color: '#f7e84d',
            label: '较弱'
        },
        {
            color: '#ffa500',
            label: '一般'
        },
        {
            color: '#1677ff',
            label: '较强'
        },
        {
            color: '#2f9715',
            label: '强'
        },
    ];

    return (
        <div className={styles['password-score__wrapper']}>
            {
                Array.from({ length: 5 }, (_, index) => (
                    <div
                        className={styles['password-score__item']}
                        style={{
                            background: index === value ? score[value].color: '#e2e2e2'
                        }}
                        key={'pwd-score:' + index}
                    />
                ))
            }
            <span className={styles['password-score__text']} style={{
                opacity: score[value]?.label ? '1': '0'
            }}>{score[value]?.label ?? '暂无'}</span>
        </div>
    )
}
