import React, { useState, useEffect } from "react";
import { useStateValue } from "./StateProvider";
import SingleChat from "./SingleChat";
import {
  Button,
  Modal,
  FormControl,
  InputLabel,
  Input,
} from "@material-ui/core";
import "./ChatElement.css";
import { withStyles } from "@material-ui/core/styles";

const StyledButton = withStyles({
  root: {
    borderRadius: 3,
    border: 0,

    height: 36,
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  label: {
    textTransform: "capitalize",
  },
})(Button);

function retrieveLikes(dispatch) {
  fetch("http://localhost:8000/likes/")
    .then((response) => response.json())
    .then((response) => {
      dispatch({ type: "RETRIEVE_LIKES", likes: response });
    });
}
function retrieveChat(dispatch) {
  // console.log("i was called here");
  retrieveLikes(dispatch);
  fetch("http://localhost:8000/xan/")
    .then((response) => response.json())
    .then((response) => {
      dispatch({ type: "RETRIEVE_CHAT", chats: response });
    });
}
function submitMsg(user, msg, dispatch, parent, pHc) {
  if (!user) return false;
  let data2send = { from_whom: user, msg_content: msg, parent: parent };
  fetch("http://localhost:8000/xan/", {
    method: "POST",
    body: JSON.stringify(data2send),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      dispatch({ type: "ADD_MSG", msg: response });
      if (pHc) {
        pHc(true);
      }
    })
    .catch((err) => console.log("error while adding message"));
}
function ChatElement(props) {
  const [input, setInput] = useState("");
  const [{ chatHistory, user }, dispatch] = useStateValue();
  const addMsg = () => {
    if (!props.parentid) return false;

    if (props.pHc) submitMsg(user, input, dispatch, props.parentid, props.pHc);
    else submitMsg(user, input, dispatch, props.parentid, null);
  };
  useEffect(() => {
    if (!props.parentid) retrieveChat(dispatch);
  }, []);
  let classesx = !props.chid
    ? "ChatElement"
    : "ChatElement ChatElement__hidden";
  // console.log(!props.chid ? "ChatElement" : "ChatElement ChatElement__hidden");
  return (
    <div
      // className={"ChatElement " + !props.chid ? null : "ChatElement__hidden"}
      className={classesx}
    >
      {!props.parentid
        ? chatHistory
            .filter((x) => !x.parent)
            .map((chat, i) => <SingleChat chat={chat} level={1} key={i} />)
        : chatHistory
            .filter((x) => x.parent == props.parentid)
            .map((chat, i) => (
              <SingleChat chat={chat} level={props.level + 1} key={i} />
            ))}
      <div>
        {!props.parentid ? null : (
          <div className="ChatElement__input">
            <FormControl className="ChatElement__inputfield">
              <InputLabel>✅HERE</InputLabel>
              <Input
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
              />
            </FormControl>
            <StyledButton
              disabled={!input}
              variant="contained"
              color="primary"
              onClick={addMsg}
            >
              REPLY
            </StyledButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatElement;
