import React, { useState, useEffect } from "react";
import { useStateValue } from "./StateProvider";
import "./SingleChat.css";
import ChatElement from "./ChatElement";
import axios from "axios";
import { Button, Input } from "@material-ui/core";
//#####################################################################################
const checkLikesHistory = (user, chat, likesHistory) => {
  //see whether a record exists and returns the id if it does, -1 otherwise
  let arr = likesHistory.filter(
    (x) => x.from_whom == user && x.parentchat == chat.id
  );
  if (arr.length == 0) return -1;
  else return arr[0].id;
};

function addLike(from_whom, parentchat, dispatch) {
  if (!from_whom) return false;
  let data2send = { from_whom: from_whom, parentchat: parentchat.id };
  fetch("http://localhost:8000/likes/", {
    method: "POST",
    body: JSON.stringify(data2send),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      dispatch({ type: "ADD_LIKE", msg: response });
    })
    .catch((err) => console.log("error while adding like"));
}
function deleteLike(chatid, dispatch) {
  axios
    .delete(`http://localhost:8000/likes/${chatid}/`)
    .then((response) => {
      dispatch({ type: "DELETE_LIKE", id: chatid });
    })
    .catch((err) => console.log(err));
}

function deleteMsg(chat, dispatch) {
  axios
    .delete(`http://localhost:8000/xan/${chat.id}/`, {
      headers: {
        "content-type": "application/json",
      },
    })
    .then((response) => {
      dispatch({ type: "DELETE_MSG", id: chat.id });
    })
    .catch((err) => console.log(err));
}
function headerMaker() {
  return {
    headers: {
      "content-type": "application/json",
    },
  };
}

function updateChat(chat, dispatch, reduceLikes = false) {
  let x = reduceLikes ? -1 : 1;
  axios
    .patch(
      `http://localhost:8000/xan/${chat.id}/`,
      { ...chat, likes: chat.likes + x },
      headerMaker()
    )
    .then((response) => {
      console.log("successfully added likes");
      dispatch({
        type: "UPDATE_MSG",
        id: chat.id,
        chat: { ...chat, likes: chat.likes + x },
      });
    })
    .catch((err) => console.log(err));
}
//######################################################################################
const hasReplies_delete = (allChats, chatx) => {
  let myid = chatx.id;
  let respp = false;
  if (chatx.from_whom == "Kevin") respp = true;
  for (let chat of allChats) {
    if (chat.parent == myid) {
      if (respp) {
        console.log(`chat history size:${allChats.length}`);
        console.log("chat has children");
      }

      return true;
    }
  }
  if (respp) {
    console.log(`chat history size:${allChats.length}`);
    console.log("chat has no children");
  }

  return false;
};
function SingleChat(props) {
  const [{ chatHistory, likesHistory, user }, dispatch] = useStateValue();
  // const [chatHistoryLocal, setChatHistoryLocal] = useState(chatHistory);
  const [chid, setChid] = useState(true);
  const [replystring, setReplystring] = useState("View Replies");
  const [hasreply, setHasreply] = useState(false);
  //################################################################################
  const hasReplies = (allChats, chatx) => {
    let z = false;
    let chatHistory = allChats;

    if (chatx.from_whom == "Kevin") z = true;
    for (let chat of chatHistory) {
      if (chat.parent == chatx.id) {
        if (z) {
          console.log(`Length of chatHistory:${chatHistory.length}`);
          console.log("This chat has a child," + chat.from_whom);
        }
        setHasreply(true);
        return true;
      }
    }
    if (z) {
      console.log(`Length of chatHistory:${chatHistory.length}`);
      console.log("This chat has no children");
    }
    setHasreply(false);
    return false;
  };
  //################################################
  useEffect(() => {
    hasReplies(chatHistory, props.chat);
  }, [chatHistory]);
  // const checkIfReplies = () => {
  //   console.log(
  //     "I was called from child and the message is " + props.chat.msg_content
  //   );
  //   if (hasReplies(chatHistory, props.chat.id))
  //     console.log("and has replies is true");
  //   setHasreply(hasReplies(chatHistory, props.chat.id));
  // };
  const toggleReplyString = () => {
    setChid(!chid);

    // setReplystring(chid ? "View Replies" : "Hide"); kmhere make this work
  };
  const likeButtonHandler = () => {
    if (!user) {
      console.log("You cant do this while logged in as guest... returning");
      return false;
    }
    let likeid = checkLikesHistory(user, props.chat, likesHistory); //tested

    if (likeid == -1) {
      addLike(user, props.chat, dispatch);
      updateChat(props.chat, dispatch);
    } else {
      deleteLike(likeid, dispatch);
      updateChat(props.chat, dispatch, true);
    }
  };
  let xtraClassName =
    props.level % 2 == 1 ? "singleChat__odd" : "singleChat__even";
  return (
    <div className={"SingleChat"}>
      <div className={"SingleChat__msg" + " " + xtraClassName}>
        <div className="SingleChat__topbar">
          <div className="SingleChat__fromuser SingleChat__smalltext">
            {props.chat.from_whom}
          </div>
          <div className="SingleChat__date SingleChat__smalltext">
            {props.chat.sent_when}
          </div>
        </div>
        <div className="SingleChat__msgtext">{props.chat.msg_content}</div>
        <div className="SingleChat__bottombar">
          <Button
            // className="SingleChat__likes SingleChat__button"
            variant="contained"
            color="primary"
            onClick={likeButtonHandler}
          >
            likes {props.chat.likes}
          </Button>
          {/* <button className="SingleChat__dislikes SingleChat__button">
            dislikes {props.chat.dislikes}
          </button> */}

          <Button
            // className="SingleChat__button SingleChat__replies"
            variant="contained"
            color="secondary"
            onClick={(e) => toggleReplyString()}
          >
            {hasreply ? replystring : "Reply"}
          </Button>
          {user && props.chat.from_whom == user ? (
            <button
              className="SingleChat__button SingleChat__delete"
              onClick={(e) => deleteMsg(props.chat, dispatch)}
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>
      <ChatElement
        parentid={props.chat.id}
        level={props.level}
        chid={chid}
        pHc={null}
      />
    </div>
  );
}

export default SingleChat;
