import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Components/Chat";

const socket = io.connect("https://chat-direct-server.herokuapp.com");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const [openRoom, setOpenRoom] = useState(false);

  const joinRoom = (e) => {
    e.preventDefault();
    socket.emit("join_room", room);
    setOpenRoom(true);
  };

  return (
    <div>
      {openRoom ? (
        <Chat
          socket={socket}
          username={username}
          room={room}
          setOpenRoom={setOpenRoom}
        />
      ) : (
        <div className="flex flex-col justify-center items-center h-screen w-full">
          <h1 className="mb-4 text-xl">Join a room</h1>
          <form onSubmit={joinRoom} className="flex flex-col w-96	">
            <input
              className="border-2 p-2"
              required
              type="text"
              placeholder="My pseudo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="border-2 my-4 p-2"
              required
              type="text"
              placeholder="Room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-700 px-4 py-2 rounded-full text-white"
            >
              Join room
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
