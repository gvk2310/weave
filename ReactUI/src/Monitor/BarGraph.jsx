import React from 'react';
import {Bar} from 'react-chartjs-2';
import { StaticRouter } from 'react-router-dom';

class BarGraph extends React.Component{

    constructor(props){
        super(props)
        this.state={
            graphdata:'',
        }
    }
  //displayName: 'BarExample',
componentDidMount = () => {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [65, 59, 80, 81, 56, 55, 40]
          }
        ]
      };

      this.setState({graphdata: data})
}
  render() {
    
    return (
      <div>
        <h2>Bar Graph</h2>
        <Bar
          data={this.state.graphdata}
          width={200}
          height={100}
          options={{
            maintainAspectRatio: true
          }}
        />
      </div>
    );
  }
}
export default BarGraph;