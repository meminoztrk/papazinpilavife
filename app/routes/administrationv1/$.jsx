import { Button, Result } from 'antd';
import React from 'react';
import { Link } from '@remix-run/react';


const notfound = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Üzgünüz, ziyaret ettiğiniz sayfa mevcut değil."
            extra={<Link to={"/admin"}><Button type="primary">Geri Dön</Button></Link>}
        />
    )
}

export default notfound