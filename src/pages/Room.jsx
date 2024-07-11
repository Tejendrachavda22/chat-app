import React , {useState , useEffect} from 'react';
import client , {databases , COLLECTION_ID , DATABASE_ID} from '../appwrite/conf'
import { ID , Query , Client} from 'appwrite';
import {Trash2} from 'react-feather'


function Room() {

  const [messages , setMessages] = useState([])
  const [messageBody , setMBody] = useState('')

  // console.log(messages);
  useEffect(() =>{
    getMessages()

    client.subscribe([' databases.${DATABASE_ID} ,  collections.${COLLECTION_ID}.documents'] , response => {
      // Callback will be executed on changes for documents A and all files.
      console.log('real time' , response);
    });

  },[])


  const handleSubmit = async (e) =>{
      e.preventDefault()

      const payload = {
        body : messageBody
      }

      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        payload
      )
      
      console.log("Created ...." , response);
      setMessages(prevState => [response , ...messages])
      setMBody('')
  }

  const getMessages  = async () =>{
    const response = await databases.listDocuments(DATABASE_ID , COLLECTION_ID,[
      Query.orderDesc('$createdAt'),
      // Query.limit()                 
    ])
    // console.log(response);
    setMessages(response.documents)
    
  }

  const deleteMessage = async (message_id) => {
    const response = await databases.deleteDocument(DATABASE_ID , COLLECTION_ID, message_id);
    setMessages(prevState => messages.filter(message => message.$id !== message_id))
  }


  return (
    <main className='container'>

      <div className='room--container'>


        <form id='message--form' onSubmit={handleSubmit} >
            <div>
                <input type="text" 
                required
               placeholder='Say Somthing' 
                value={messageBody} 
                onChange={(e) => {setMBody(e.target.value)}}/>

            </div>

            <div className='send-btn--wrapper'>
              <input className='btn btn--secondary' type="submit" value="Send" />
            </div>
        </form>

        <div>
          {messages.map(message => (
             <div key={message.$id} className='message--wrapper'>

              <div className='message--header'>
                <small className='message-timestamp'>{new Date(message.$createdAt).toLocaleString()
                }</small>

                <Trash2 
                className='delete--btn'
                onClick={() => {deleteMessage(message.$id)}} />
              </div>
           
              <div className='message--body'>
              <span>{message.body}</span>
              </div>


            </div>
          ))}
        </div>

      </div>

    </main>
  )
}

export default Room
