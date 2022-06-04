import { rtdb } from "./rtdb";
import { map } from "lodash";

const API_BASE_URL = "localhost:3000";

const state = {
  data: {
    name: null,
    userId: null,
    roomId: null,
    rtdbRoomId: null,
    rtdbData: null,
    history: {
      player1: 0,
      player2: 0,
    },
  },
  listeners: [],

  getState() {
    return this.data;
  },

  setUserId(userId) {
    const cs = this.getState();
    cs.userId = userId;
    this.setState(cs);
  },

  setRoomId(roomId) {
    const cs = this.getState();
    if (roomId !== undefined) {
      cs.roomId = roomId;
      this.setState(cs);
    }
  },

  setRtdbId(longId) {
    const cs = this.getState();
    cs.rtdbRoomId = longId;
    this.setState(cs);
  },
  // OBTENEMOS EL ID DEL USUARIO EN FIRESTORE,
  // PARA LUEGO CON ESE ID CREAR UNA ROOM EN LA RTDB,
  // Y CREAR UNA ROOM EN FIRESTORE GUARDANDO EL RTDBID
  createUser(callback?, idRoomInput?) {
    const cs = this.getState();
    if (cs.email) {
      fetch(`${API_BASE_URL}/signup`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: cs.name }),
      })
        .then(data => {
          return data.json();
        })
        .then(res => {
          cs.userId = res.id;
          this.setState(cs);

          if (idRoomInput) {
            this.authRoomId(idRoomInput).then(data => {
              if (!data.id) {
                alert(data);
              } else {
                this.connectToRoom();
                callback();
              }
            });
          } else {
            this.createRoom(callback);
          }
        });
    } else {
      alert("Debes colocar un mail.");
    }
  },
  createRoom(callback?) {
    const cs = this.getState();
    if (cs.userId) {
      fetch(`${API_BASE_URL}/rooms`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: cs.userId, userName: cs.name }),
      })
        .then(data => {
          return data.json();
        })
        .then(res => {
          if (cs.roomId == null) {
            cs.roomId = res.id.toString();
            this.setState(cs);
          }
          this.connectToRoom();
          callback();
        });
    }
  },
  authRoomId(roomIdInput) {
    const cs = this.getState();

    return fetch(`${API_BASE_URL}/auth/rooms`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: roomIdInput }),
    })
      .then(data => {
        return data.json();
      })
      .then(res => {
        if (res.id) {
          cs.roomId = res.id;
          return res;
        } else {
          return res.message;
        }
      });
  },

  // RECIBIMOS EL ID DE LA RTDB PARA LUEGO PODER QUEDAR
  // ESCUCHANDO LOS CAMBIOS
  connectToRoom() {
    const cs = this.getState();
    if (cs.roomId && cs.userId) {
      fetch(`${API_BASE_URL}/rooms/${cs.roomId}?userId=${cs.userId}`)
        .then(data => {
          return data.json();
        })
        .then(res => {
          cs.rtdbRoomId = res.rtdbId;
          this.setState(cs);
          this.listenRoom();
        });
    }
  },
  listenRoom() {
    const cs = this.getState();
    const chatRoomRef = rtdb.ref(`/rooms/${cs.rtdbRoomId}`);

    chatRoomRef.on("value", snapshot => {
      const currentState = this.getState();
      currentState.rtdbData = snapshot.val();
      this.setState(currentState);
    });
  },

  changePlayer2Name() {
    const cs = this.getState();
    fetch(`/rooms/userName/${cs.rtdbRoomId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cs.name),
    })
      .then(data => {
        return data.json();
      })
      .then(res => {
        return res;
      });
  },

  ready() {
    const cs = this.getState();
    if (cs.userName)
      fetch(`/rooms/userName/${cs.rtdbRoomId}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cs.userId),
      })
        .then(data => {
          return data.json();
        })
        .then(res => res);
  },

  // pushMessages(message: string) {
  //   const cs = this.getState();
  //   fetch(`${API_BASE_URL}/rooms/${cs.rtdbRoomId}`, {
  //     method: "post",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       from: cs.name,
  //       message: message,
  //     }),
  //   })
  //     .then(res => {
  //       return res.json();
  //     })
  //     .then(data => {
  //       return data;
  //     });
  // },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
  },
  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
