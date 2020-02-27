import React, { Component } from 'react'
import Chart from 'react-apexcharts'
import axios from 'axios'
import swal from 'sweetalert'
import Loader from 'react-loader'
import Search from '../search.png'
import Homeimg from '../Homeimg.png'

export default class body extends Component {
    constructor(props) {
        super(props)
        this.state = {
          loaded:true,
          search: "",
          data:[],
          options:{
            stroke: {
              curve: 'smooth'
            },
            title: {
              text: 'value to timeline chart',
              align: 'centre'
            },
          },
          series:[{
            name:"price",
            data:[]
          }],
          options1:{
            title: {
              text: 'candlestick chart',
              align: 'centre'
            },
          },
          series1:[{
            data:[]
          }]
        }
    }

    handleval = (e) => {
      this.setState({search:e.target.value})
    }

    fetchdata = () =>{
      this.setState({loaded : false})
      axios.post("api/fetch",{id : this.state.search})
      .then((response)=>{
        if(response.data.success===false){
          swal("Something went wrong")
        } else {
        console.log(response)
        response.data.data.map((data) => {
          console.log("doing");
          this.state.series[0].data.push({x:data.date , y:data.value});
          this.state.series1[0].data.push({x:data.date , y:[data.open,data.high,data.low,data.close]});
          return null;
        })
        this.setState({loaded : true , data: response.data.data})
        swal(`Successfully fetched ${response.data.data.length} data`,{
          icon: "success"
        })
      }
      })
    
    }

    redirect = (e) =>{
      this.props.history.push(`/${e.target.name}`);
    }

    render() {
        return (
          <div>
            <div className="sidenav">
              <img id="home" alt="" src={Homeimg}></img>
            </div>
          <div className="padding">
           <input id="inputbox" autoComplete="off" placeholder="Search" onChange={((e)=>this.handleval(e))}></input>
           <button id="search" onClick={()=>this.fetchdata()}><img id="searchimg" alt="" src={Search}></img></button>
           <button id="searchpage" name="searches" onClick={(e)=>this.redirect(e)}>Search Page</button>
           <button id="searchpage" name="logs" onClick={(e)=>this.redirect(e)}>Logs page</button>
           <Loader loaded = {this.state.loaded}>
             <Chart className="chart" options={this.state.options} series={this.state.series} type="line" height={350} width={1000}/>
             <Chart className="chart" options={this.state.options1} series={this.state.series1} type="candlestick" height={350} width={1000}/>
           <p>Table of Content</p>
           <table>
             <tr id="colorhead">
               <th>Date</th>
               <th>Open</th>
               <th>High</th>
               <th>Low</th>
               <th>Close</th>
               <th>Volume</th>
               <th>Value</th>
             </tr>
             {(this.state.data.length>0)?
             <tbody>
             {this.state.data.map((data)=>{
               return(
                 <tr>
                <td >{data.date}</td>
                <td >{data.open}</td>
                <td >{data.high}</td>
                <td >{data.low}</td>
                <td >{data.close}</td>
                <td >{data.volume}</td>
                <td >{data.value}</td>
                 </tr> 
               )
             })}
             </tbody>:<tr><td colspan="7">Search to View the search's table of content</td></tr>}
           </table>
           </Loader>
          </div>
          </div>
        )
    }
}
