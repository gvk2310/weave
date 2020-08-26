import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ScheduleComponent, Day, Week, Month, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';
//import { appData } from './datasource';
import { extend } from '@syncfusion/ej2-base';
import './calendar.css'
class App extends React.Component {
    constructor() {
        super(...arguments);
        this.data = extend([], null, true);
    }
    render() {
        return <ScheduleComponent width='100%' height='550px' selectedDate={new Date(2018, 1, 15)} eventSettings={{ dataSource: this.data }}>
            <ViewsDirective>
            <ViewDirective option='Week' dateFormat='dd-MMM-yyyy'/>
                <ViewDirective option='Month' showWeekend={false} readonly={true}/>
            </ViewsDirective>
            <Inject services={[Day, Week, Month]}/>
        </ScheduleComponent>;
    }
}
;
export default App;