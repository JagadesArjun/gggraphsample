import React, {Component} from 'react';
import LineChart from 'react-svg-line-chart';
import _ from 'lodash';

import 'react-dates/initialize';
import {DateRangePicker} from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import api from './api';
import './App.css';

function pad2(number) {
    return (number < 10 ? '0' : '') + number
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activePoint: null,
            rawAdData: [],
            finalAdData: [],
            startDate: null,
            endDate: null,
            focusedInput: null,
            slide: 0,
            limit: 'all',
            loading: false
        };

        this.handlePointHover = this.handlePointHover.bind(this);
        this.getAdData = this.getAdData.bind(this);
        this.processData = this.processData.bind(this);
        this.submitDate = this.submitDate.bind(this);
        this.switchSlide = this.switchSlide.bind(this);
        this.handleLimitChange = this.handleLimitChange.bind(this);
    }

    componentWillMount() {
        //this.getAdData({startDate: '2017-06-10', endDate: '2017-09-13'});
    }

    onChange = (data) => {
        this.setState(data);
    };

    processData(adData) {
        const {limit} = this.state;
        const processedData = [];
        adData.forEach((adCount, i) => {
            processedData.push({x: i, y: adCount.adrequest, date: adCount.date})
        });
        if (adData.length === 0) {
            return [];
        }
        if (Number(limit) === 50 || Number(limit) === 75 || Number(limit) === 100) {
            return _.chunk(processedData, Number(limit));
        } else {
            return [processedData];
        }
    }

    getAdData({startDate, endDate}) {
        const {onChange} = this;
        onChange({loading: true});
        api({startDate, endDate}, function (err, {body}) {
            if (!err) {
                onChange({rawAdData: body.data, loading: false});
            } else {
                console.log(err);
                onChange({rawAdData: body.data, loading: false});
                alert("Error while loading data.");
            }
        })
    }

    submitDate({startDate, endDate}) {
        this.setState({startDate, endDate});
        if (startDate && endDate) {
            startDate = startDate.format();
            endDate = endDate.format();
            const startUTCFormat = new Date(startDate);
            const endUTCFormat = new Date(endDate);
            const startString = `${startUTCFormat.getFullYear()}-${pad2(startUTCFormat.getMonth() + 1)}-${pad2(startUTCFormat.getDate())}`;
            const endString = `${endUTCFormat.getFullYear()}-${pad2(endUTCFormat.getMonth() + 1)}-${pad2(endUTCFormat.getDate())}`;
            this.getAdData({startDate: startString, endDate: endString});
        }
    }

    handlePointHover(activePoint, e) {
        this.setState({activePoint});
    }

    switchSlide(slide) {
        this.setState({slide})
    }

    handleLimitChange(event) {
        this.onChange({limit: event.target.value});
        if (event.target.value === 'all') {
            this.onChange({slide: 0});
        }
    }

    render() {
        const {activePoint, slide, rawAdData, loading} = this.state;
        const processedData = this.processData(rawAdData);
        return (
            <div className="App">
                <div className="AppContainer">
                    <DateRangePicker
                        startDate={this.state.startDate}
                        startDateId="your_unique_start_date_id"
                        endDate={this.state.endDate}
                        endDateId="your_unique_end_date_id"
                        onDatesChange={({startDate, endDate}) => this.submitDate({startDate, endDate})}
                        focusedInput={this.state.focusedInput}
                        onFocusChange={focusedInput => this.setState({focusedInput})}
                        isOutsideRange={() => false}
                        noBorder={false}
                    />
                    <select className="options right" value={this.state.limit} onChange={this.handleLimitChange}>
                        <option value="all">All</option>
                        <option value={50}>50 per slide</option>
                        <option value={75}>75 per slide</option>
                        <option value={100}>100 per slide</option>
                    </select>
                </div>

                {loading &&
                <div className="AppContainer"
                     style={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                    <img style={{width: '50px', margin: 'auto'}}
                         src="http://www.gordonsouthern.com/wp-content/plugins/add-twitter-feed/includes/images/reload.gif"/>
                </div>
                }

                {processedData.length > 0 &&
                <div className="AppContainer">
                    <div style={{height: '50px'}}>
                        {activePoint &&
                        <div className="activePoint">
                            Date: {activePoint.date} AdCount: {activePoint.y}
                        </div>
                        }
                    </div>
                    <LineChart
                        data={processedData[slide].map((point, i) => {
                            return ({...point, active: point.x === (activePoint && activePoint.x) ? true : false})
                        })}
                        areaVisible={true}
                        axisVisible={false}
                        gridVisible={false}
                        labelsVisible={processedData[slide].length < 101}
                        labelsStepX={7}
                        labelsColor="#505048"
                        pathColor="#505048"
                        pointsStrokeColor="#505048"
                        areaColor="#505048"
                        pointsOnHover={this.handlePointHover}
                    />
                    <div>
                        <button
                            className="timeline right">{processedData[slide][processedData[slide].length - 1].date}</button>
                        <button className="timeline left">{processedData[slide][0].date}</button>
                    </div>
                    <div>
                        {processedData.length > 1 && slide < (processedData.length - 1) &&
                        <button className="button right" onClick={() => this.switchSlide(slide + 1)}>Next</button>}
                        {slide > 0 && slide <= (processedData.length - 1) &&
                        <button className="button left" onClick={() => this.switchSlide(slide - 1)}>Prev</button>}
                    </div>
                </div>
                }

                {processedData.length === 0 &&
                <div className="AppContainer">
                    <p style={{color: 'black', margin: '10px'}}>No data</p>
                </div>
                }
            </div>
        );
    }
}

export default App;
