import React, { useState } from 'react'
// inputs, where we send messages
const MessageForm = () => {
  const [text, setText] = useState('')

  return (
    <div className="formContainer">
      <form  className="textWrapper">
        <input type="text" value={text} placeholder="text" onChange={e => setText(e.target.value)}/>
      </form>
      
      <button className="messageBtn">Send</button>
    </div>
  )
}

export default MessageForm