import { Button, Result } from 'antd';
import React from 'react';
import { Link } from '@remix-run/react';


const notfound = () => {
    return (
        <div className='bg-white mt-8'>
            <Result
                status="404"
                title="404"
                subTitle="Üzgünüz, ziyaret ettiğiniz sayfa mevcut değil."
                extra={<Link to={"/"}><Button type="primary" danger>Ana sayfaya dön</Button></Link>}
            />
        </div>
    )
}

export default notfound