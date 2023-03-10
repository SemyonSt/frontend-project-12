import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import routes from '../routes';

import { actions as channelsActions } from '../slices/chanalSlice';

const socket = io();
// subscribe new messages
socket.on('newMessage', (payload) => {
  console.log('LLALALALA', payload);
});
const Input = () => {
  // const channelsId = useSelector((state) => state.channelReduser.channelId);

  const message = () => {
    // emit new message
    // emit new message
    socket.emit('newMessage', { body: 'message text', channelId: 1, username: 'admin' });
    // socket.emit('newMessage', {
    //   body: value,
    //   channelId: channelsId,
    //   username: JSON.parse(localStorage.getItem('userInfo')).username,
    // });
    // console.log(value);
  };

  const [value, setValue] = useState('');
  // console.log(setValue);
  return (
    <form noValidate="" className="py-1 border rounded-2" onSubmit={message}>
      <div className="input-group has-validation">
        <input
          name="body"
          aria-label="Новое сообщение"
          placeholder="Введите сообщение..."
          className="border-0 p-0 ps-2 form-control"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
          disabled=""
          className="btn btn-group-vertical"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
            />
          </svg>
          <span className="visually-hidden">Отправить</span>
        </button>
      </div>
    </form>
  );
};

const ChatPages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channelReduser.channels);
  const channelId = useSelector((state) => state.channelReduser.channelId);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(routes.getData(), { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } });
      dispatch(channelsActions.setChannels(response.data.channels));
      // subscribe new messages
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    // eslint-disable-next-line functional/no-conditional-statements
    if (!localStorage.getItem('userInfo')) {
      navigate('/login');
    }
  }, [navigate]);

  const getChannelId = (id) => {
    dispatch(channelsActions.setChannelId(id));
  };


  const channelNames = (channelList) => (
    <ul className="nav flex-column nav-pills nav-fill px-2">
      {channelList.map((channel) => {
        const { name, id } = channel;

        return (
          <li className="nav-item w-100" key={id}>
            <button
              type="button"
              className={id === channelId ? 'w-100 rounded-0 text-start btn btn-secondary' : 'w-100 rounded-0 text-start btn'}
              onClick={() => getChannelId(id)}
            >
              <span
                className="me-1"
              >#
              </span>{name}
            </button>
          </li>
        );
      })}
    </ul>
  );

  // какая то фигня
  const activChannelName = (channels1) => {
    const filter = channels1.filter((channel) => channel.id === channelId).map((i) => i.name);
    return filter[0];
  };

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
          <div className="d-flex justify-content-between mb-2 ps-4 pe-2"><span>Каналы</span>
            <button
              type="button"
              className="p-0 text-primary btn btn-group-vertical"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path
                  d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                />
                <path
                  d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
                />
              </svg>
              <span className="visually-hidden">+</span>
            </button>
          </div>
          {channelNames(channels)}
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b># {activChannelName(channels)}</b>
              </p>
              <span
                className="text-muted"
              >
                2 сообщения
              </span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5 ">

              <div className="text-break mb-2"><b>admin</b>: 111111</div>
            </div>
            <div className="mt-auto px-5 py-3">
              {Input()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPages;


/*

*/
