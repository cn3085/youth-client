import React from 'react';

type Props = {
    roomId:number,
    handleEnter:Function,
    bookingYN:'Y'|'N';
}

type State = {
    roomName:string,
    userName:string,
}

export type RoomType = {
    roomId:number,
    roomName:string,
    userName:string,
    bookingYN:'Y'|'N';
}

class Room extends React.Component<Props, State> {

    state:State = {
        roomName : '',
        userName : ''
    }

    pressEnter = (e:React.KeyboardEvent) => {
        if(e.key === 'Enter'){
            this.props.handleEnter(this.props.roomId, this.state.roomName, this.state.userName);
        }
    }

    changeUserName = (e:React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? e.target.value : '';
        this.setState({userName: value})
    }

    changeRoomName = (e:React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? e.target.value : '';
        this.setState({roomName: value})
    }



    render(){
        const {pressEnter, changeUserName, changeRoomName} = this;

        const {roomId, bookingYN} = this.props;
        const {roomName, userName} = this.state;

        return (
            <div key={roomId} style={{border:`${bookingYN === 'Y' ? '1px solid red ' : '1px solid black ' }`}}>
                <p>roomId : {roomId}</p>
                {bookingYN === 'Y' ?    
                    <p>예약 완료</p>
                        :
                    <> 
                    <input type="text" name="userName" placeholder={'유저 이름'} value={userName} onChange={changeUserName}/>
                    <br></br>
                    <input type="text" name="roomName" placeholder={'방 이름'} value={roomName} onChange={changeRoomName} onKeyPress={pressEnter}/>
                    </>
                }
            </div>
        );
    }
}

export default Room;