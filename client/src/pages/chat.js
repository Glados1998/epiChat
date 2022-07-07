import React from 'react';
import openSocket from 'socket.io-client';
import Nav from '../components/navHeader';

// connection to the server
const socket = openSocket ( 'http://localhost:3001' );

export default class Chat extends React.Component {

    constructor(props) {
        super ( props );

        //state object, containing data
        this.state = {
            selectedChannel : '#General' ,
            username : 'guestUser' ,
            userTemp : '' ,
            temp : '' ,
            tempMessage : '' ,
            channels : [] ,
            messages : [] ,
            users : []
        };
        this.onChange = this.onChange.bind ( this );
        this.handlePseudo = this.handlePseudo.bind ( this );
        this.handleChange = this.handleChange.bind ( this );
        this.messageManager = this.messageManager.bind ( this );
    }

    //this section contains the different messages
    // that can be displayed in the app
    componentDidMount() {

        // new user joined the chat
        socket.on ( 'newUser' , (user) => {
            this.setState ( {
                messages : this.state.messages.concat ( {
                    channel : this.state.selectedChannel ,
                    author : 'system' ,
                    content : user.username + ' has joined the chat' ,
                    to : '' ,
                    whispered : 'no'
                } )
            } );
        } );

        //renaming of the user
        socket.on ( 'renameUser' , (user) => {
            this.setState ( {
                messages : this.state.messages.concat ( {
                    channel : this.state.selectedChannel ,
                    author : 'system' ,
                    content : user.username + ' has joined changed his name ' + user.rename ,
                    to : '' ,
                    whispered : 'no'
                } )
            } );
        } );

        // user disconnected
        socket.on ( 'disconnectUser' , (user) => {
            this.setState ( {
                messages : this.state.messages.concat ( {
                    channel : this.state.selectedChannel ,
                    author : 'system' ,
                    content : user.username + ' has left the chat' ,
                    to : '' ,
                    whispered : 'no'
                } )
            } );
        } );

        //displays the currently connected users
        socket.on ( 'listUsers' , (user) => {
            this.setState ( { users : [] } );
            for (let i in user) {
                this.setState ( { users : this.state.users.concat ( user[i] ) } );
            }
        } );

        //defines a new message
        socket.on ( 'newMsg' , (message) => {
            this.setState ( {
                messages : this.state.messages.concat ( {
                    channel : message.messages.messages.channel ,
                    author : message.messages.messages.author ,
                    content : message.messages.messages.content ,
                    to : message.messages.messages.to ,
                    whispered : message.messages.messages.whispered
                } )
            } );
        } );

        //channels reception
        socket.on ( 'listChannels' , (channels) => {
            this.setState ( { channels : [] } );
            for (let i in channels) {
                this.setState ( { channels : this.state.channels.concat ( channels[i] ) } );
            }
        } );
    }

    //
    onChange(event) {
        this.setState ( { userTemp : event.target.value } );
    }

    //change guestUser to actually username
    handlePseudo(event) {
        event.preventDefault ();
        socket.emit ( 'login' , { username : this.state.userTemp } );
        this.setState ( { username : this.state.userTemp } );
    }

    //function to whisper to a user
    commandMsg(tab) {
        tab = tab.filter ( word => word !== tab[0] );
        this.setState ( {
            tempMessage : {
                channel : this.state.selectedChannel ,
                author : this.state.username ,
                content : tab.filter ( word => word !== tab[0] ).join ( ' ' ) ,
                to : tab[0] ,
                whispered : 'yes'
            }
        } );
    }

    //function to rename
    commandName(tab) {
        socket.emit ( 'rename' , {
            username : this.state.username ,
            rename : tab[1] ,
        } );
        this.setState ( { username : tab[1] } );
    }

    //function to crete a new channel
    commandCreate(tab) {
        let listChan = this.state.channels.filter ( channel => channel === '#' + tab[1] );
        if ( listChan.length === 0 ) {
            this.setState ( {
                tempMessage : {
                    channel : this.state.selectedChannel ,
                    author : 'system' ,
                    content : 'the channel has been created' ,
                    to : '' ,
                    whispered : 'no'
                }
            } );
            socket.emit ( 'newChannel' , {
                channel : tab[1]
            } );
            socket.emit ( 'newMessage' , { messages : this.state.tempMessage } );
        }
        if ( listChan.length >= 1 ) {
            this.setState ( {
                tempMessage : {
                    channel : this.state.selectedChannel ,
                    author : 'system' ,
                    content : 'this channel already exists' ,
                    to : '' ,
                    whispered : 'no'
                }
            } );
            socket.emit ( 'newMessage' , { messages : this.state.tempMessage } );
        }
        return true;
    }

    commandHelp() {
        this.setState ( {
            messages : this.state.messages.concat ( {
                channel : this.state.selectedChannel ,
                author : 'system' ,
                content : 'Available commands : /nick, /create, /msg, /help' ,
                to : '' ,
                whispered : 'no'
            } )
        } );
    }

    //function to handle the message
    handleChange(event) {
        this.setState ( { temp : event.target.value } );
        let tab = event.target.value.split ( ' ' );
        let tabBegin = tab[0].split ( '' );
        if ( tab[0] === "/help" ) {
            this.commandHelp ();
            return false;
        }
        if ( tab[0] === '/msg' ) {
            this.commandMsg ( tab );
            return false;
        }
        if ( tab[0] === '/nick' ) {
            return false;
        }
        if ( tab[0] === '/create' ) {
            return false;
        }

        if ( tabBegin[0] !== "/" ) {
            this.setState ( {
                tempMessage : {
                    channel : this.state.selectedChannel ,
                    author : this.state.username ,
                    content : event.target.value ,
                    to : '' ,
                    whispered : 'no'
                }
            } );
        }
    }

    messageManager(event) {
        event.preventDefault ();
        let tab = this.state.temp.split ( ' ' );

        // renames the user if the command "/nick" is used
        if ( tab[0] === '/nick' ) {
            if ( tab[1] !== undefined && tab[1] !== '' ) {
                this.commandName ( tab , event );
            }
            this.setState ( { temp : '' } );
            return false;
        }
        //creates a new room if the command "/create" is used and the room doesn't exist
        if ( tab[0] === '/create' ) {
            if ( tab[1] !== undefined && tab[1] !== '' ) {
                this.commandCreate ( tab );
            }
            this.setState ( { temp : '' } );
            return false;
        }

        socket.emit ( 'newMessage' , { messages : this.state.tempMessage } );
        this.setState ( { temp : '' } );
    }

    //displays the different messages according what
    // the user has written and used the type of command
    displayMessages() {
        let tab = this.state.messages.filter ( messages => messages.channel === this.state.selectedChannel );
        return tab.map ( message => {
            if ( message.author === 'system' ) {
                return <span className="msg"><strong>{message.content} <br/></strong></span>
            }
            if ( message.to !== '' && message.to === this.state.username ) {
                return <span className="msg"><em>{message.author} you said </em> : {message.content} <br/></span>
            }
            if ( message.to !== '' && message.author === this.state.username ) {
                return <span className="msg"><em> you have whispered to : {message.to}</em> : {message.content}
                    <br/></span>
            }
            if ( message.author !== 'system' && message.whispered === 'no' ) {
                return <span className="msg"><strong>{message.author}</strong> : {message.content} <br/></span>
            }
        } );
    }

    //displays the users currently connected
    displayUsers() {
        return this.state.users.map ( user => {
            return <h6 className="users"> {user}</h6>
        } );
    }

    //displays the Rooms
    displayChannels() {
        return this.state.channels.map ( channel => {
            return <h6
                className="chan"
                value={channel}
                onClick={(event) => {
                    this.setState ( { selectedChannel : event.target.getAttribute ( 'value' ) } )
                }}>
                {channel}
            </h6>
        } )
    }

    render() {
        if ( this.state.username === 'guestUser' ) { //if the user is guest
            return (
                <div>
                    <Nav/>
                    <div className="container">
                        <div className="text-center row justify-content-center mt-3">
                            <div className="col-md-6">
                                <div className="username">
                                    <div className="">
                                        <p>In order to enter in the chat <br/>
                                            you have to first enter your username.
                                        </p>
                                    </div>

                                    <form className={'input-group mb-3'}>
                                        <button className={'btn btn-outline-primary'}
                                                onClick={this.handlePseudo}>Connect
                                        </button>
                                        <input className='form-control' placeholder={'John Doe'}
                                               type="text"
                                               onChange={this.onChange}/>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        if ( this.state.username !== '' ) { // if the user has entered his username
            return (
                <div>
                    <Nav/>
                    <div className="container">
                        <div className="row mt-3">
                            <div className="col-md-4 card flex-column">
                                <h3>users:</h3>
                                <div className="members">
                                    {this.displayUsers ()}
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3 justify-content-right">
                            <div className="col-md-4 card flex-column">
                                <h3>Channels:</h3>
                                <div className="channels">
                                    {this.displayChannels ()}
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3 justify-content-center">
                            <div className="col-md-4 flex-column">
                                <h3>{this.state.selectedChannel}</h3>
                                <div id="content p-4">
                                    {this.displayMessages ()}
                                </div>
                                <div className="input-group mb-3">
                                    <form>
                                        <input id="msg" value={this.state.temp}
                                               onChange={this.handleChange}/>
                                        <button className="btn btn-primary" onClick={this.messageManager}>Send</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (<p> {this.state.username} has entered the chat</p>);
    }
}