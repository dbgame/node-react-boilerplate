import React, { useEffect } from 'react';
import axios from 'axios';

function LandingPage() {
    
    useEffect(() => {
        axios.get('/api/hello') // 서버로 요청
            .then(response => { console.log(response)})
    }, [])

    return (
        <div style={{
            display: 'flex', justyfyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>
        </div>
    )
}

export default LandingPage
