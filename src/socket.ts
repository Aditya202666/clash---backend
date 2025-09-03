import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { voteQueue, voteQueueEvents, voteQueueName } from "./jobs/voteJob.js";
import { commentQueue, commentQueueEvents, commentQueueName } from "./jobs/commentJob.js";


let io: Server;
export function initSocket(httpServer : HttpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_APP_URL,
        },
    });

    return io
}

export function getSocket(): Server | null {

    if(!io){
        return null;
    }
    return io
}

export function setupSocket(io: Server) {

    io.on('connection', (socket) => {
        // console.log('a user connected', socket.id);

        // socket.on('disconnect', () => {
        //     console.log('user disconnected');
        // });

        socket.on( "vote", async({clashID, clashItemId}) =>{

            // console.log(clashID, clashItemId, "vote event data" );

            const  voteResult = await voteQueue.add(voteQueueName, {id: clashItemId});
            const vote = await voteResult.waitUntilFinished(voteQueueEvents);
            if(vote){
                socket.broadcast.emit(`vote-${clashID}`, vote);
            }
        })

        socket.on("comment", async ({clashId, comment}) => {
            // console.log(clashId, comment, "comment event data" );
            
            const  commentResult = await commentQueue.add(commentQueueName, {id: clashId, comment: comment});
            const newComment = await commentResult.waitUntilFinished(commentQueueEvents);
            if(comment){
                socket.broadcast.emit(`comment-${clashId}`, newComment);
            }
        })

    });
 


}