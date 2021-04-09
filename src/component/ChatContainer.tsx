import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Room, { RoomType } from './Room';
import axios, { AxiosResponse } from 'axios';

type Props = {};
type State = {
  roomList:RoomType[]
};

let sockJS = new SockJS("http://192.168.0.155:8084/webSocket");
let stompClient : Stomp.Client = Stomp.over(sockJS);
stompClient.debug= () => {};

class ChatContainer extends React.Component<Props, State>{

  state:State = {
    roomList: [],
  }

  componentDidMount(){
    this.connectSocket();
    this.getRoomList();
  }
  
  connectSocket = () => {
    stompClient.connect({},()=>{
      stompClient.subscribe('/topic/roomId',(data)=>{
        const newMessage : RoomType = JSON.parse(data.body) as RoomType;
        const {roomList} =  this.state;
        alert(JSON.stringify(newMessage));
        const remainRoomList = roomList.filter( r => r.roomId !== newMessage.roomId);
        newMessage.bookingYN ='Y';
        remainRoomList.push(newMessage);

        this.setState({roomList : remainRoomList});
      });
    });
  }


  getRoomList = async () => {
    try{
      const response:AxiosResponse<RoomType[]> = await axios.get('http://192.168.0.155:8084/room');
      const {data} = response;
      console.log(data);
      this.setState({roomList : data});
    }catch(e){
      console.error(e);
    }
  }

  
  handleEnter = (roomId:number, roomName: string, userName: string) => {

    const newMessage: RoomType = { roomId, roomName, userName, 'bookingYN' : 'N'};
    console.log('booking', JSON.stringify(newMessage));
    stompClient.send("/hello",{},JSON.stringify(newMessage));
  };


  render(){
    const { roomList } = this.state;
    const rooms = roomList.map( room => {
      return (
        <Room key={room.roomId} roomId={room.roomId} bookingYN={room.bookingYN} handleEnter={this.handleEnter}></Room>
      )
    })
  
    return (
      <div style={{display:'flex'}}>
        {rooms}
      </div>
    );
  }

};


export default ChatContainer;