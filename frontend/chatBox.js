

let socket = null;

//user ki id ---->

let userId = null;

let receiverId = null;

let groupId = null;

let userList = document.querySelector(".show-user-list");
let groupList = document.querySelector(".show-group-list");

let privateSection = document.querySelector(".private-chat-section");
let addUserSection = document.querySelector(".adduser-group-section");
let groupChatSection = document.querySelector(".group-chat-section");

     // function showSection(sectiontoshow){
            privateSection.classList.add("active");
            addUserSection.classList.add("active");
            groupChatSection.classList.add("active");

           
  let privateMessageForm = document.querySelector(".private-message-form"); 
  let privateMessageInput = document.querySelector("#private-msg-field");         
           
 let prevPrivateMessage = document.querySelector(".message-container");       
 
 //user new group create krna chahta hai ---->
  const newGroupBtn = document.querySelector(".group-create-btn");
  const createGroupForm = document.querySelector(".group-create-form");
  const groupNameField = document.querySelector("#group-name"); 
  const prevGroupMessage = document.querySelector(".show-group-message");
  const groupMessageForm = document.querySelector(".group-msg-send-form");
  const groupMessageInput = document.getElementById("msg-group-input-field");
  
  //add user -> button se user ko group me add kro 
  const addUserBtn = document.querySelector(".add-newuser-btn");
  //users ko show kro jinko group me add krna chahte ho
     const showUsersAddGroup = document.querySelector(".show-usersfor-add");
(
   async function verifyAuthorization()
   {
      try{   
             socket = io("http://localhost:5000",{
                withCredentials: true
           });
         
          
           isverify();
         
        
   }catch(err){
    console.error(err.message);
  }
}


)();


async function isverify(){
      try{
            
            if(socket === null)
            {
              
               return;
            }
              //verify hone ke baad connected true hua to --->
               socket.on('connect',()=>{
             alert('socket token verifyed.')
                });

              //ager error aa gya to --->
                  socket.on('connect_error',(err)=>{
               //backend se aane wala error ---->
                console.error(err.message);
             alert('socket auth failed.');
             window.location.href='index.html'
         })
             //baki ke socket listeners-->

                  setupSocketListener();

      }catch(err){
       console.error(err.message);
      }
}


function setupSocketListener()
{
            socket.on('userDetails',(paylaod)=>{
                   userId = paylaod.id;
                   fetchAllUser();
            })

            //sabhi users ko call kro ---->

                socket.on('privateMsg',(data)=>{
                   const {id,senderId,secondUser,textMessage} = data;
       //message id , jisne bheja hai uski id , jisko bheja hai uski id , message
                        console.log("private me aaya",data);
                if(senderId === userId || senderId === receiverId)
                {
                   
                //privateMessages ko append kro ---> jab user chatbox open kiya ho
                   appendPrivateMessages(senderId,textMessage)
                }

                  })
                
             socket.on('recive_group_message',(data)=>{
               //  const {id ,senderId,groupId,message} = data;
               console.log("Group me aaya",data)
                  if(data.groupId === groupId)
                  {
                       appendGroupMessages(data.senderId,data.message);
                  }
             })
}



function appendPrivateMessages(senderId,textMessage)
{
   
   //element create kro -->
   const div = document.createElement('div');
    //check kro kya tumne message send kiya hai 
    div.className = senderId === userId ? 'my-message' :'other-user'
      div.innerText = textMessage
      prevPrivateMessage.appendChild(div);     

      prevPrivateMessage.scrollTop = prevPrivateMessage.scrollHeight ;
}

function appendGroupMessages(senderId ,message)
{
    
     //element create kro 
     const div = document.createElement("div");
     div.innerText = message ;
     div.className = (senderId === userId) ? 'my-message' : 'other-user'
     prevGroupMessage.appendChild(div);

     prevGroupMessage.scrollTop = prevGroupMessage.scrollHeight;
}

//sare user ko le ke aao ----->
async function fetchAllUser(){
     try{

      const response = await fetch("http://localhost:5000/api/v1/getuser",{
          method:'GET',
          credentials:'include',
          headers:{
             'Content-Type':'application/json'
          }
      });

      const result = await response.json();

      if(result.success)
      {
   
          // yhan 2 case hain ---->
          //1. user kis group me join hai vo le ke aao -->
               if( result?.currentUser?.joinedgroup.length > 0)
               {
                  //ager user kisi group me join hai tab 
                      const data = [...result?.currentUser?.joinedgroup];
                      userJoinedGroup(data);

               }
          //2. sare users ko le ke aao 
               showAllUsers(result)
             
      }else{
         alert(result.message);
      }

     }catch(err){
         console.error(err.message);
     }
};


//user function ---> for group 

function userJoinedGroup(data)
{   
   
   groupList.innerHTML ="";
      data?.forEach(group => {
           const div = document.createElement('div');
           div.id = group._id;
           div.className='user-joined-group';
           div.innerText = group.groupName ;
           groupList.appendChild(div);

           div.addEventListener('click',(event)=>{
                 groupId = event.target.id;

                
               
                 privateSection.classList.add("active");
            addUserSection.classList.add("active");
            groupChatSection.classList.remove("active");
                   
                fetchGroupMessages(groupId);

           })
      });

  //ek element create kro 
};

function showAllUsers(result){

     userList.innerHTML ="";
     result?.otherUsers.forEach(user=>{
          const div = document.createElement('div');
           div.id = user._id;
           div.className='users';
           div.innerText = user.fullName ;
           userList.appendChild(div);

           //jis user pe click hua hai uske sath ki chats-section kholo
           div.addEventListener('click',(event)=>{
                 const id = event.target.id;
                
                    privateSection.classList.remove("active");
                     addUserSection.classList.add("active");
                    groupChatSection.classList.add("active");
               
                         receiverId ="";
                         receiverId = id; 
                         fetchPrivateMessages(id);
               
                
           })
     })
}

 async function fetchPrivateMessages(id)
{   
   try{

      const response = await fetch(`http://localhost:5000/api/v1/message?id=${id}`,{
            method:'GET',
            credentials:'include',
            headers:{
               'Content-Type':'application/json'
            }
      });

      const result = await response.json();
         if(result.success)
         {    prevPrivateMessage.innerHTML='';
              showPrivateMessages(result.chats);
             
         }else{
             alert(result?.message);
         }

   }catch(err){
      console.error(err.message);
   }

}

function showPrivateMessages(chats){

        chats.forEach(chat =>{
            
              const div = document.createElement("div");
               div.innerText=chat.textMessage;
               div.id =chat._id;              
               if(chat.senderId === userId)
               {
                   div.className = 'my-message'
               }else{
                  div.className ='other-user'
               }

               prevPrivateMessage.appendChild(div);
        })
}

privateMessageForm.addEventListener('submit',(event)=>{
    event.preventDefault();
      
      const newMessage = privateMessageInput.value.trim();

      if(newMessage === '')
      {
         //send button hide kar do
      }else{
      
         socket.emit('new_message',{
          secondUser:receiverId,
          textMessage:newMessage
        });     
        let data = {
            textMessage:newMessage,
            senderId:userId
        }
         showPrivateMessages([data]);
      }
       privateMessageInput.value='';
               
});

//message ko listen  karo --->

newGroupBtn.addEventListener("click",()=>{
            
        privateSection.classList.add("active");
            addUserSection.classList.remove("active");
            groupChatSection.classList.add("active");
            

});

createGroupForm.addEventListener("submit",(event)=>{
      event.preventDefault();
      const groupName = groupNameField.value.trim();

      if(groupName === '')
      {
         alert("Enter group Name");
      };
         
      const data = {
         groupName:groupName
      };
            //backend call
            createGroup(data);

            groupNameField.value='';
})

async function createGroup(data)
{
   try{

      const response = await fetch("http://localhost:5000/api/v1/group",{
              method:"POST",
              credentials:"include",
              headers:{
               'Content-Type':"application/json"
              },
              body:JSON.stringify(data)
      });

      const result = await response.json();
      if(result.success)
      {
         fetchAllUser();
      }

   }catch(err){
    console.error(err.message);
   }
}

async function fetchGroupMessages(id)
{
     try{
         const response = await fetch(`http://localhost:5000/api/v1/groupChat?id=${id}`,{
            method:'GET',
            credentials:'include',
            headers:{
               'Content-Type':'application/json'
            }
         });

         const result = await response.json();
         
         if(result.success)
         {
             prevGroupMessage.innerHTML = "" ;
              showGroupMessages(result?.oldChats);
         }
         
     }catch(err){
        console.error(err.message);
     }
};

function showGroupMessages(oldChats)
{
   
   
        oldChats.forEach(chat =>{
         console.log(chat);
            const div = document.createElement("div");
            div.innerText=chat?.message;
            div.id = chat._id;
             if(chat.senderId === userId)
             {
                 div.className ='my-message'
             }else{
                 div.className ='other-user'
             }
             prevGroupMessage.appendChild(div);

             
        })
}

groupMessageForm.addEventListener("submit",(event)=>{
      event.preventDefault();
       const newMessage =   groupMessageInput.value.trim();
       
       if(newMessage === '')
       {
         //button ko hide kar dena 
       }else{
             socket.emit('group_new_message',{
            groupId:groupId,
            message:newMessage
       })
        const data ={
             message:newMessage,
             senderId:userId
        }
       showGroupMessages([data]);
      }
    groupMessageInput.value ='';
})

//add user button pe click ho tab -->

async function fetchUsers()
{   
   try{
      const response = await fetch(`http://localhost:5000/api/v1/addUsers?groupId=${groupId}`,{
           method:'GET',
           credentials:"include",
           headers:{
            'Content-Type':'application/json'
           }
      });

      const result = await response.json();
         
         if(result.success)
         {
            let data = [...result?.users ];

                  appendTheusers(data);
         }else{
            alert(result.message);
         }
   }catch(err){
           console.error(err.message);
   }

}    

addUserBtn.addEventListener("click",()=>{
       
         //sare users ko backend se lao -->
                    fetchUsers();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
});

function appendTheusers(data)
{     
   showUsersAddGroup.innerHTML ='';
      data.forEach(user => {
           //element create kro 
           const p = document.createElement('p');
           p.id = user._id ;
           p.className = 'user'
           p.innerText = user.fullName ;
           const button = document.createElement("button");
            button.innerText = "Add" ;
            button.className = 'add-btn';
            button.id = user._id;

        showUsersAddGroup.append(p,button);
        button.addEventListener('click',(event)=>{
             const id = event.target.id;

             //ab backend me add member wale ko call kr do 

                addthisMemeber(id);
        })

      })
}
 
async function addthisMemeber(id){
      try{
        
              const response = await fetch(`http://localhost:5000/api/v1/addMember?gId=${groupId}&id=${id}`,{
                  method:'POST',
                  credentials:"include",
                      headers:{
                        'Content-Type':'application/json'
                      }
              });

              const result = await response.json();
                  
              if(result.success)
              {
                 
                    fetchUsers();
              }else{
                  alert(result.message);
              }
      }catch(err){
        console.error(err.message);
      }
}

