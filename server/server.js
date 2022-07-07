let app = require ( 'express' ) ();
let http = require ( 'http' ).createServer ( app );
let io = require ( 'socket.io' ) ( http );
const port = 3001;

//user array containing users
let users = [];
//channels array containing the channels
let channels = [ '#General' ];

io.on ( 'connection' , (socket) => {
    let me = '';

    // when the user connects to the server
    socket.on ( 'login' , (user) => {
        users.push ( user.username );
        me = user.username;
        io.emit ( 'listUsers' , {
            user : users
        } )

        io.emit ( 'listChannels' , {
            channels : channels
        } )

        socket.broadcast.emit ( 'newUser' , {
            username : user.username
        } )

    } );

    // when the user disconnects from the server
    socket.on ( 'disconnect' , () => {
        if ( me !== '' ) {
            socket.emit ( 'disconnectUser' , {
                username : me
            } )
            users = users.filter ( user => user !== me );
            io.emit ( 'listUsers' , {
                user : users
            } )
        }
    } )

    // sends messages
    socket.on ( 'newMessage' , function (message) {
        io.emit ( 'newMsg' , {
            messages : message
        } )
    } )

    //rename user
    socket.on ( 'rename' , function (username) {
        me = username.rename;
        users = users.filter ( user => user !== username.username );
        users.push ( username.rename );
        io.emit ( 'listUsers' , {
            user : users
        } );
        io.emit ( 'renameUser' , {
            username : username.username ,
            rename : username.rename
        } )
    } )
    // create new channel
    socket.on ( 'newChannel' , function (channel) {
        channels.push ( '#' + channel.channel );
        io.emit ( 'listChannels' , {
            channels : channels
        } )
    } )
} );

// start the server
http.listen ( port , function () {
    console.log ( 'listening on *:3001' );
} );
