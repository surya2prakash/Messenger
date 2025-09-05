
const socket = io("http://localhost:9000");



const chatbox = document.getElementById("chat_log");

const sendBtn = document.getElementById("sendMsg");







//socket ko On kro --->

socket.on("connect",()=>{

     //elemnt create kro ----->

     const p = document.createElement('p');
     p.innerText="<b> user is connected ...</b>"

     chatbox.appendChild(p);
     console.log(socket.id);
});


//message recive kro --->

   socket.on('receive_msg',(data)=>{
          
    //elemnt create kro 
    const p = document.createElement('p');
       p.innerText = data.message;

       chatbox.appendChild(p);
   })




 

sendBtn.addEventListener("click",()=>{
 
    const msgInput = document.getElementById("input_msg");
     const joinId = document.querySelector("#join_input");

      const  joinId_second = joinId.value.trim();
      const inputMsg = msgInput.value;

      if(!inputMsg)
      {
         alert("Type Messages");
      };

      socket.emit("send_direct_message",({joinId_second,inputMsg}))
      
      msgInput.value ="";

      const p = document.createElement('p');
        p.innerHTML = `<b> You to ${joinId_second} : </b> ${inputMsg}}`

        chatbox.appendChild(p);
})

