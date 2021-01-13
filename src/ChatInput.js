import React, { useState } from "react";
import "./ChatInput.css";
import {
  Button,
  Modal,
  FormControl,
  InputLabel,
  Input,
} from "@material-ui/core";
import { useStateValue } from "./StateProvider";

function submitMsg(user, msg, dispatch) {
  if (!user) return false;
  let data2send = { from_whom: user, msg_content: msg };
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
    })
    .catch((err) => console.log("error while adding message"));
}

function ChatInput() {
  const [input, setInput] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const addMsg = () => {
    submitMsg(user, input, dispatch);
  };
  return (
    <div className="ChatInput">
      <FormControl className="ChatInput__inputfield">
        <InputLabel>✅TYPE YOUR MESSAGE HERE</InputLabel>
        <Input
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
      </FormControl>
      <Button
        disabled={!input}
        variant="contained"
        color="primary"
        onClick={addMsg}
      >
        SEND
      </Button>
    </div>
  );
}

export default ChatInput;
