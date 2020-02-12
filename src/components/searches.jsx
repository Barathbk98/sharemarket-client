import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert';
import Search from '../search.png'

export default class searches extends Component {
    constructor(props){
        super(props)
        this.state = {
            page: 0,
            id : "",
            value: "",
            open : false,
            searches:[],
            data : []
        }
        this.row = React.createRef();
        this.id = React.createRef();
    }

    redirect = () => {
        this.props.history.push("../")
    }

    dropdown = (e) =>{
        this.handlechange(e);
        axios.get(`api/getid?id=${e.target.value}`)
        .then((response)=>{
            this.setState({open : true ,searches : response.data.data})
        })
    }

    setid = (data) =>{
        this.id.current.value = data.shareid;
        this.setState({open : !this.state.open , id : data.shareid})
    }

    handlechange = (e) =>{
        this.setState({[e.target.name] : e.target.value})
    }

    search = () => {
        if(this.state.id =="" && this.state.value == "")
            swal("Sorry search some id or value",{icon : "warning"})
        else {
            axios.get(`api/search?id=${this.state.id}&value=${this.state.value}&size=50&from=0`)
            .then((response)=>{
                console.log(response.data.data);
                this.setState({data : response.data.data});
            })
        }
    }

    infinitescroll = () =>{
        let page = this.state.page+1;
        axios.get(`api/search?id=${this.state.id}&value=${this.state.value}&size=50&from=${page}`)
            .then((response)=>{
                let data = response.data.data;
                this.setState({data:[...this.state.data,...data]})
            })
        this.setState({page})
    } 

    listen = () => {
        let elem = this.row;
        let isbottom;
        window.addEventListener('scroll',()=>{
            // console.log(elem);
            isbottom = (elem.current.getBoundingClientRect().bottom-window.innerHeight)<10
            console.log(isbottom);
            if(isbottom){
                this.infinitescroll();
            }
        })
    }

    render() {
        return (
            <div ref = {this.listen}>
                <button id="mainpage" onClick={()=>this.redirect()}>Back to Main Page</button>
                <div >
                    <input autocomplete="off" id="idsearch" placeholder="search by ID" name="id" ref={this.id} onChange={(e)=>this.dropdown(e)}></input>
                    {this.state.open && (<div id="listbox">
                        {this.state.searches.map((data)=>{
                            return(
                                <li id="list" onClick={(e)=>this.setid(data)}>{data.shareid}</li>
                            )
                        })}
                        </div>)
                    }
                    <input autocomplete="off" id="valuesearch" name="value" placeholder="search by value" onChange={(e)=>this.handlechange(e)}></input>
                    <button className="searchbtn" onClick={()=>this.search()}><img id="searchimg" src={Search}></img></button>
                </div>
                <div id="table" ref={this.row}>
                    <p1>Table of Content</p1>
                <table>
                    <thead>
             <tr id="colorhead"><th>shareid</th>
               <th>date</th>
               <th>open</th>
               <th>high</th>
               <th>low</th>
               <th>close</th>
               <th>volume</th>
               <th>value</th>
             </tr>
             </thead>
             {(this.state.data.length>0)?
             <tbody>
             {this.state.data.map((data)=>{
               return(
                 <tr>
                <td id="color">{data._source.shareid}</td>
                <td id="colorhead">{data._source.date}</td>
                <td id="color">{data._source.open}</td>
                <td id="colorhead">{data._source.high}</td>
                <td id="color">{data._source.low}</td>
                <td id="colorhead">{data._source.close}</td>
                <td id="color">{data._source.volume}</td>
                <td id="colorhead">{data._source.value}</td>
                 </tr>
               )
             })}
             </tbody>:<tr><td colspan="8">Search to View the search's table of content</td></tr>}
           </table>
                </div>
               
            </div>
        )
    }
}
