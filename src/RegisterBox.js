import React, { useState } from "react";
import { Button, FormControl, Input, InputLabel } from "@material-ui/core";
import "./RegisterBox.css";
import { useStateValue } from "./StateProvider";

function RegisterBox() {
  const [{ user }, dispatch] = useStateValue();
  const [input, setInput] = useState("");
  const [secButton, setSecButton] = useState(false);
  const registerName = (event) => {
    //adds todo input to state
    event.preventDefault();
    // alert(`${input} will be sent `);
    dispatch({ type: "SET_USER", user: input });
    setSecButton(true);
    setInput("");
  };
  const enableSubmit = () => {
    setSecButton(false);
  };

  return (
    <div className="RegisterBox">
      <form className="RegisterBox__form">
        <FormControl>
          <InputLabel>✅Type your name here</InputLabel>
          <Input
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
        </FormControl>

        <Button
          variant="contained"
          disabled={!input || secButton}
          color="primary"
          type="submit"
          onClick={registerName}
          className="RegisterBox__Button"
        >
          Add
        </Button>
        <Button
          variant="contained"
          disabled={!secButton}
          color="secondary"
          onClick={enableSubmit}
          className="RegisterBox__Button"
        >
          Change Name
        </Button>
      </form>
    </div>
  );
}

export default RegisterBox;
