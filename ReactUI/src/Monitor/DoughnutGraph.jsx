import React from 'react';
import {Doughnut} from 'react-chartjs-2';

class DoughnutGraph extends React.Component{

    constructor(props){
        super(props)
        this.state={
            graphdata:'',
        }
    }

componentDidMount = () => {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#b5e7a0',
            '#dac292',
            '#eea29a',
            '#80ced6',
            ],
            hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
            ]
        }]
    };

      this.setState({graphdata: data})
}
  render() {
    
    return (
      <div>
        {/* <h2>Doughnut Graph</h2> */}
        <Doughnut data={this.state.graphdata} />
      </div>
    );
  }
}
export default DoughnutGraph;




// export default React.createClass({
//   displayName: 'DoughnutExample',

//   render() {
//     return (
//       <div>
//         <h2>Doughnut Example</h2>
//         <Doughnut data={data} />
//       </div>
//     );
//   }
// });