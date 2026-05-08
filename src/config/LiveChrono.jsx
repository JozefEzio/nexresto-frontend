
import React, { useEffect, useState } from 'react'

const LiveChrono = ({ estimatedTime, status }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isLate, setIsLate] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            if (!estimatedTime) return;

            const deadline = new Date(estimatedTime.replace(' ', 'T') + 'Z');
            const now = new Date();
            const diffInMs = deadline - now;
            const diffInMins = Math.floor(diffInMs / 60000);

            if (diffInMins < 0) {
                setIsLate(true);
                setTimeLeft(`LATE (${Math.abs(diffInMins)}m)`);
            } else {
                setIsLate(false);
                setTimeLeft(`${diffInMins} min left`);
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 30000); 
        return () => clearInterval(interval);
    }, [estimatedTime]);

    return (
        <span className={`${isLate && status!=='ready' ? 'text-red-200 animate-pulse' : 'text-white'} font-bold text-lg transition-colors`}>
            {status==='ready'?'Done':timeLeft || '—'}
        </span>
    );
};

export default LiveChrono