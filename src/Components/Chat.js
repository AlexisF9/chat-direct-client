import { createRef, useEffect, useRef, useState } from "react";

export default function Chat({ socket, username, room, setOpenRoom }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const messageEndRef = createRef();

  const _isInit = useRef(false);

  useEffect(() => {
    if (!_isInit.current) {
      _isInit.current = true;

      socket.on("receive_message", (data) => {
        setMessageList((list) => [...list, data]);
      });
    }
  }, [socket]);

  useEffect(() => {
    messageEndRef.current.scrollIntoView();
  }, [messageList]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const messageData = {
      room: room,
      author: username,
      message: message,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    await socket.emit("send_message", messageData);
    setMessageList((list) => [...list, messageData]);
    setMessage("");
  };

  const closeRoom = () => {
    socket.emit("leave_room", room);
    setOpenRoom(false);
  };

  return (
    <div className="mx-4 md:ml-auto md:mr-auto md:w-9/12">
      <button
        className="mt-4 bg-red-500	hover:bg-red-700 px-4 py-2 rounded-full text-white"
        onClick={() => closeRoom()}
      >
        Close room
      </button>

      <h3 className="my-4">
        Welcome <strong>{username}</strong> in the room :{" "}
        <strong>{room}</strong>
      </h3>

      <div className="pb-2 px-2 h-96 bg-slate-200 overflow-y-scroll">
        {messageList.map((item, i) => {
          return (
            <div key={i} className={item.author === username && "text-sky-500"}>
              <p className="m-4">
                {item.author} : <strong>{item.message}</strong> ({item.time})
              </p>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex flex-col md:w-96">
        <input
          className="border-2 my-4 p-2"
          type="text"
          placeholder="Your message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-sky-500 hover:bg-sky-700 px-4 py-2 rounded-full text-white"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}
