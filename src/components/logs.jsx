import React, { Component } from 'react'
import axios from 'axios';
import {TextField,Button} from '@material-ui/core'
import {ToggleButton,ToggleButtonGroup} from '@material-ui/lab'
import Chart from 'react-apexcharts'
import moment from 'moment'

export default class logs extends Component {

    constructor(props){
        super(props);
        this.state = {
            data : [],
            search: "",
            limit: 20,
            option1:{
                title:{
                    text: "Status Chart",
                    align : "centre"
                },
                labels: [],
            },
            series1:[],
            option2:{
                title:{
                    text: "Agent Chart  ",
                    align : "centre"
                },
                labels: [],
            },
            series2:[],
            type:"day",
            option3: {
                title: {
                    text: "Hits chart",
                    align : "centre"
                },
                xaxis: {
                    type: "date",
                    labels : {
                        datetimeFormatter: {
                            year: 'yyyy',
                            month: 'MMM \'yy',
                            day: 'dd MMM',
                            hour: 'HH:mm'
                          }
                    }
                },
            },
            series3:[{
                data: []
            }]
        }
    }

    componentDidMount = () => {
        axios.get(`api/logs?limit=${this.state.limit}`)
        .then((response)=>{
            this.setState({data : response.data.data})
        })
        axios.get(`api/statuscount`)
        .then((response)=>{
            console.log(response.data.data)
            response.data.data.code_count.buckets.map((data)=>{
                this.state.option1.labels.push(data.key)
                this.state.series1.push(data.doc_count)
            })
            response.data.data.agent_count.buckets.map((data)=>{
                this.state.option2.labels.push(data.key)
                this.state.series2.push(data.doc_count)
            })
        })
        axios.get(`api/datehits?type=${this.state.type}`)
        .then((response)=>{
            let x;
            console.log(response.data);
            let value=[]
            response.data.data.map((data)=>{
                x= moment(data.key_as_string).format("HH:mma")
                this.setState({option3 : {label : [response.data.start,response.data.start]}})
                value.push({x,y : data.doc_count})
            })
            this.setState({series3 : [{data: value}]})
        }).catch((err)=>{
            alert("something went wrong")
        })
    }

    redirect = () =>{
        this.props.history.push("../")
    }

    setlimit = () =>{
        axios.get(`api/logs?limit=${this.state.limit}`)
        .then((response)=>{
            this.setState({data : response.data.data})
        })
    }

    limit = (e) => { 
            this.setState({[e.target.name]:e.target.value})
    }

    search = () =>{
        axios.get(`api/logsearch?search=${this.state.search}&limit=${this.state.limit}`)
        .then((response)=>{
            this.setState({data : response.data.data})
            console.log(response.data);
        })
    }

    handletype = async(e,type) =>{
        if(type!=null){
            await this.setState({type})
            await axios.get(`api/datehits?type=${this.state.type}`)
            .then((response)=>{
                console.log(response.data);
                let value=[]
                let x;
                response.data.data.map((data)=>{
                    if(this.state.type==="day"){
                        x= moment(data.key_as_string).format("HH:mma")
                    } else {
                        x= moment(data.key_as_string).format("DD MMM")
                    }
                    value.push({x,y : data.doc_count})
                })
                this.setState({series3 : [{data: value}]})
            }).catch((err)=>{
                alert("something went wrong");
            })
        }
    }

    render() {
        console.log(this.state.series3)
        return (
            <div className="logs">
                <TextField placeholder="Search" name="search" onChange={(e)=>this.limit(e)}></TextField>
                <Button variant="contained" onClick={()=>this.search()}>Search</Button>
                <label>LIMIT :</label><TextField type="Number" name="limit" onChange={(e)=>this.limit(e)} value={this.state.limit} inputProps={{ min:"10",max:"100" ,step:"10"}}/>
                <Button variant="contained" onClick={()=>this.setlimit()} color="primary">SET</Button>
                <button id="searchpage" onClick={()=>this.redirect()}>Main Page</button>
                <div id="logtable">
                    <table>
                        <tr id="colorhead">
                            <th>CLEINT</th>
                            <th>METHOD</th>
                            <th>STATUS</th>
                            <th>AGENT</th>
                        </tr>
                        {this.state.data.map((data)=>{
                            return(
                            <tr>
                                <td>{data._source.client}</td>
                                <td>{data._source.method}</td>
                                <td>{data._source.code}</td>
                                <td>{data._source.agent}</td>
                            </tr>)
                        })}
                    </table>
                </div>
                <div id="piecharts">
                <Chart className="pie" options={this.state.option1} series={this.state.series1} type="pie" height={370} width={350}/>
                <Chart className="pie2" options={this.state.option2} series={this.state.series2} type="pie" height={370} width={350}/>
                </div>
                <ToggleButtonGroup 
                    exclusive 
                    onChange={this.handletype} 
                    value={this.state.type} 
                    >
                    <ToggleButton value="day">Day</ToggleButton>
                    <ToggleButton value="month" color={this.state.month}>Month</ToggleButton>
                    {/* <ToggleButton value="year" color={this.state.year}>Year</ToggleButton> */}
                </ToggleButtonGroup>
                <Chart className="linechart" options={this.state.option3} series={this.state.series3} type="line" height={350} width={1000}/>
            </div>
        )
    }
}
