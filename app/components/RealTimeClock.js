import React, { useEffect, useState } from 'react'

export default function RealTimeClock() {
    const [dateState, setDateState] = useState(new Date());
    const [element, setElement] = useState()
    useEffect(() => {
        const time = setInterval(() => setDateState(new Date()), 1000);
        return () => clearInterval(time);
    }, [])

    useEffect(() => {
        setElement(
            <div>
                <span>
                    {dateState.toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })},
                </span>
                <span className="pl-1">
                    {dateState.toLocaleString('tr-TR', {
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                    })}
                </span>
            </div>
        )
    }, [dateState])


    return (
        <div>
            {element}
        </div>
    )
}

