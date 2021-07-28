class Sockets {

    constructor(io) {
        this.ArrayUsers = [];
        this.io = io;
        this.socketEvents();
    }

    socketEvents() {
        console.log("entro init socket");

        this.io.on('connection', socket => {
           
            socket.emit("received-idsocket",socket.id);

            socket.on("send-info", data => {
                this.ArrayUsers.push({
                    id: socket.id,
                    username: data.username
                });
                this.io.emit('send-user-list',this.ArrayUsers)
            });
            socket.on("notificacion-user",data => {
                this.io.to(data.idAmigo).emit("send-invitacion-user",data)
            });
            socket.on("invitacion-acceptada",data => {
                this.io.to(data.id).emit("invited-accep",data)
            });
            socket.on("send-selectede", data => {
                console.log("entro aqui"+ data.id)
                this.io.to(data.id).emit("goliad",data);
            });
            socket.on("send-select-button", data => {
                this.io.to(data.id).emit("catch-select-button",data);
            });
            socket.on("msj-notif-ganador", data => {
                this.io.to(data.id).emit("catch-ganador",data)
            })
            socket.on('disconnect',() => {
                this.encontrarUser(socket);
               
            });

        });
    }

    encontrarUser(socket){
        for (let index = 0; index < this.ArrayUsers.length; index++) {
            const user = this.ArrayUsers[index];
            if(user.id === socket.id){
                this.ArrayUsers.splice(index,1);
               this.io.emit('emitir',this.ArrayUsers);
                break;
            }
        }
    }

}

module.exports = Sockets;