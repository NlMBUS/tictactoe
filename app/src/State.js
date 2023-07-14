import { useState, useEffect } from 'react';

const State = (url) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch(url)
        .then(data => {
            setData(data);
        })
      }, [url])


    return { data }
}

export default State;