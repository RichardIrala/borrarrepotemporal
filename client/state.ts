import { rtdb } from "./rtdb";
import { map } from "lodash";

const API_BASE_URL = "http://localhost:3000";

//TODO: Validar quien es la persona ganadora y sumar el punto en base a eso

const state = {
  data: {
    name: null,
    userId: null,
    roomId: null,
    rtdbRoomId: null,
    rtdbData: {},
    choiseP1: false,
    choiseP2: false,
    history: {
      player1: 0,
      player2: 0,
    },
  },
  listeners: [],

  getState() {
    return this.data;
  },

  setName(userName) {
    const cs = this.getState();
    cs.name = userName;
    this.setState(cs);
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

  checkPlayer() {
    const cs = this.getState();
    const player1 = cs.rtdbData.player1.userName;
    const player2 = cs.rtdbData.player2.userName;
    let player: string;

    if (cs.name == player1) {
      player = "player1";
    }
    if (cs.name == player2) {
      player = "player2";
    }
    return player;
  },
  checkPlayerFront() {
    const cs = this.getState();
    const namePlayer1 = cs.rtdbData.player1.userName;
    const namePlayer2 = cs.rtdbData.player2.userName;
    let player: string;

    if (cs.name == namePlayer1) {
      player = namePlayer1;
    }
    if (cs.name == namePlayer2) {
      player = namePlayer2;
    }
    return player;
  },

  // OBTENEMOS EL ID DEL USUARIO EN FIRESTORE,
  // PARA LUEGO CON ESE ID CREAR UNA ROOM EN LA RTDB,
  // Y CREAR UNA ROOM EN FIRESTORE GUARDANDO EL RTDBID
  createUser(callback?, idRoomInput?) {
    const cs = this.getState();
    if (cs.name) {
      fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
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
                return alert(data);
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
      alert(
        "Ups, algo malio sal. Vuelve a la pagina de inicio y recarga el sitio. Lo sentimos mucho :("
      );
    }
  },
  createRoom(callback?) {
    const cs = this.getState();
    if (cs.userId) {
      fetch(`${API_BASE_URL}/rooms`, {
        method: "POST",
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
            this.connectToRoom(callback);
          }
        });
    }
  },
  authRoomId(roomIdInput) {
    const cs = this.getState();

    return fetch(`${API_BASE_URL}/auth/rooms`, {
      method: "POST",
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
          this.addP2ToRooms(cs.roomId);
          return res;
        } else {
          return res.message;
        }
      });
  },
  addP2ToRooms(roomIdInput) {
    const cs = this.getState();
    return fetch(`${API_BASE_URL}/rooms/player2`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: roomIdInput, player2: cs.name }),
    })
      .then(data => {
        return data.json();
      })
      .then(res => {
        if (res.id) {
          return res.message;
        } else {
          alert(res.message);
          return res.message;
        }
      });
  },

  // RECIBIMOS EL ID DE LA RTDB PARA LUEGO PODER QUEDAR
  // ESCUCHANDO LOS CAMBIOS
  connectToRoom(callback?) {
    const cs = this.getState();
    if (cs.roomId && cs.userId) {
      fetch(`${API_BASE_URL}/rooms/${cs.roomId}?userId=${cs.userId}`)
        .then(data => {
          return data.json();
        })
        .then(res => {
          cs.rtdbRoomId = res.rtdbId;
          this.setState(cs);
          this.listenRoom(callback);
        });
    }
  },
  listenRoom(callback?) {
    const cs = this.getState();
    const chatRoomRef = rtdb.ref(`/rooms/${cs.rtdbRoomId}`);

    chatRoomRef.on("value", snapshot => {
      const currentState = this.getState();
      const value = snapshot.val();
      currentState.rtdbData = value;
      this.setState(currentState);

      console.log(cs.rtdbData);
    });
    if (callback) callback();
  },

  // CUANDO EL PLAYER INGRESE EL CODIGO DE UNA SALA
  // SE CONVERTIRÁ EN PLAYER2.
  // SETEO SU NOMBRE EN LA RTDB CON EL NOMBRE ACTUAL DEL STATE
  // Y AUTOMATICAMENTE SE SETEA COMO ONLINE
  changeNamePlayer2(callback?) {
    const cs = this.getState();
    const name = cs.name;
    if (cs.name) {
      fetch(`${API_BASE_URL}/rooms/user/${cs.rtdbRoomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })
        .then(data => {
          return data.json();
        })
        .then(res => {
          if (callback) callback();
          return res;
        });
    }
  },

  start() {
    const cs = this.getState();
    const player = this.checkPlayer();

    fetch(`${API_BASE_URL}/rooms/${cs.rtdbRoomId}/player/start`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ start: true, player }),
    })
      .then(data => {
        return data.json();
      })
      .then(res => res);
  },

  changeMove(movePlayer) {
    const cs = this.getState();
    const player = this.checkPlayer();

    fetch(`${API_BASE_URL}/rooms/${cs.rtdbRoomId}/player/move`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moveChoise: movePlayer, player }),
    })
      .then(data => {
        return data.json();
      })
      .then(res => {
        return res;
      });
  },
  whoWins() {
    const cs = this.getState();
    const movePlayer1 = cs.rtdbData.player1.moveChoise;
    const movePlayer2 = cs.rtdbData.player2.moveChoise;

    const tieS: boolean =
      movePlayer1 == "scissors" && movePlayer2 == "scissors";
    const tieR: boolean = movePlayer1 == "rock" && movePlayer2 == "rock";
    const tieP: boolean = movePlayer1 == "paper" && movePlayer2 == "paper";
    const tie = [tieP, tieR, tieS].includes(true);

    if (tie) {
      return "tie";
    }

    let scoreP1 = cs.history.player1;
    let scoreP2 = cs.history.player2;
    if (
      (movePlayer1 == "scissors" && movePlayer2 == "paper") ||
      (movePlayer1 == "rock" && movePlayer2 == "scissors") ||
      (movePlayer1 == "paper" && movePlayer2 == "rock")
    ) {
      scoreP1 += 1;
      return "player1";
    }
    if (
      // Player 2 wins
      (movePlayer2 == "scissor" && movePlayer1 == "paper") ||
      (movePlayer2 == "stone" && movePlayer1 == "scissor") ||
      (movePlayer2 == "paper" && movePlayer1 == "stone")
    ) {
      scoreP2 += 1;
      return "player2";
    }
  },

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
