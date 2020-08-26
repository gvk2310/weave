import React, { useState, useEffect } from 'react';

const useEventSource = (url) => {
    const [data, updateData] = useState(null);

    useEffect(() => {
        const source = new EventSource(url);

        source.onmessage = function logEvents(event) {      
            updateData(JSON.parse(event.data));     
        }
    }, [])

    return data;
}

export function Test(props) {
  let data = useEventSource(`${props.url}`);
  if (!data) {
      alert('No Data')
    return <div />;
  }
else if(data){
    console.log({data})
    // return <div>Successful {data.value}</div>
  return <div>The current temperature in my living room is {data.value}</div>;
}
}


//render(<Test />, document.getElementById("temperature-output"));
