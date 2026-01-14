



document.addEventListener('DOMContentLoaded',()=>{

    
     

   let groupId = null;
   let socket =null; 

   //kis user or group pe click hua hai
   let currentId = null;
   //kya vo user hai or group hai
   let currentType =null;
   
  //  user jo online hon unko store krne ke liye
    let showOnlineOnNav ;

    let token = localStorage.getItem("token");
   
       
      //  ********SECTIONS ************
         const aside_section = document.querySelector(".aside-section");
          const main_section = document.querySelector(".main-section");
          const profile_section = document.querySelector(".show-Profile-section");

          // aside section elements ------------>

            const allUserAndGroups = document.querySelector(".all-List");
            // input search bar form -> for searching the user
         
            const side_bar_searchForm = document.querySelector(".side-bar-search");

            // main Section element --------------->

            const showAllMessages = document.querySelector(".show-messages");

            // main-section -nav-bar 
           
        

              let profile_name = document.querySelector(".profile-name");
              const profile_details_name = document.querySelector(".edit-name");
             
              const profile_name_container = document.querySelector(".edit-name-container")
          
              const show_group_members = document.querySelector(".group-users-list");
              
               const nav_profile_img = document.querySelector(".profile--image");
               
              //  nav group -> add user icon and dot icon for edit group
                const close_tab = document.querySelector(".close-tab");
                // add user-->
                 const add_group_icon = document.querySelector(".add_group_icon");
                 const add_user_close_btn = document.querySelector(".close-icon-add-user");
                 const add_user_container = document.querySelector(".user-for-add-container");

               const add_user_lists = document.querySelector(".show-user-for-add");
               
               
               const create_group_section = document.querySelector(".create-group-container");
                  const close_create_group_section = document.querySelector(".close_create_container"); 
                  const create_group_form = document.querySelector(".group_form");   
                  
                 

                 // group edit container  ----------> 
                      const threeDot_icon = document.querySelector(".dot-icon");
                       const group_edit_container = document.querySelector(".edit-container");
                       const hide_edit_container = document.querySelector(".close-icon");
                       const delete_group_btn = document.querySelector(".delete-account ");
                        const leave_group = document.querySelector(".leave-account");
                         const group_profile_img = document.getElementById("edit-profile");
                         const save_groupname_btn = document.querySelector(".btn-save");
                          const profile_name_edit_btn = document.querySelector(".btn-edit");
                          const edit_name_form = document.querySelector(".edit-form-name");

                  // send message form 
                    const send_message_form = document.querySelector(".input-message");
                    const input_message = document.getElementById("input-message");


            //  side - profile-edit -pen icon 
                  const show_profile_edit = document.querySelector(".aside-edit-icon")
                  const show_profile_options = document.querySelector(".edit-options-container");
                  const create_new_group = document.querySelector(".create-group");
                   const show_profile = document.querySelector(".show-my-profile");
                    const log_Out = document.querySelector(".logout-icon");

                    const my_profile_close = document.querySelector(".myprofile-close");
                    const myProfile_name = document.querySelector(".myprofile-name");
                    const myProfile_email = document.querySelector(".myprofile_email");
                    const myProfile_groups = document.querySelector(".profile_group_list");
                    const myProfile_delete = document.querySelector(".myprofile-delete"); 
                    const myProfile_img = document.getElementById("myprofile-image");

                    const loader = document.getElementById("loader");

        (
             async()=>{
                try{
                   
                      socket = io("https://messenger-axhs.onrender.com",{
                        transports: ["websocket"],
                        
                         withCredentials:true,
                         auth: {
                           token: token
                           }
                    });

                    if(socket === null)
                    {
                        return ;
                    }else{
                    socket.on('connect',()=>{
                          
                     
                            
                                showUsersAndGroup();  
                        });
   

                        socket.on('connect_error',(err)=>{
                            //   authentication failed ho gya hai 
                            window.location.href ='index.html';
                        })
                    }
                 
                    socket.on("userDetails",async(payload)=>{
                     try{
                     
                            sessionStorage.setItem("user",JSON.stringify(payload));
                           
                          socket.emit("online",payload.id);
                     }catch(err){
                       console.error(err);
                     }
                         
                       
                     })

                     socket.on("getOnlineUsers",(onlineUserIds)=>{
                     
                      setTimeout(()=>{
                        console.log("callhua");
                             asideOnlineStatus(onlineUserIds);
                              showOnlineOnNav=onlineUserIds;
                              
                      },5000)
                           
                     })

                     
                    
                        socket.on("privateMsg",(data)=>{

                           
                              
                          if (currentType === 'user' && currentId === data?.senderId){
                            console.log("1");
                              let newdata ={
                                      _id:data.id,
                                      senderId:{
                                          _id:data.senderId
                                      },
                                      reciverId:data.secondUser,
                                      textMessage:data.textMessage
                              }
                             
                           
                                       privateMessageShow([newdata]);
                              
                           
                            }
                          
                             })

                       socket.on("privateToMsg",(data)=>{
                                 const myDetails = sessionStorage.getItem("user");
                                const myId = JSON.parse(myDetails);
                                 
                             if (currentType === 'user' && myId.id === data?.senderId){
                             
                                         let newdata ={
                                      _id:data.id,
                                      senderId:{
                                          _id:data.senderId
                                      },
                                      reciverId:data.secondUser,
                                      textMessage:data.textMessage
                              }
                             
                           
                                       privateMessageShow([newdata]);
                              
                             }

                       })      
                           
                
              socket.on("recive_group_message",(data)=>{
                   
                  
        if (currentType === 'group' && currentId === data.groupId) {
                    
                          const newData = {
                              groupId:{ _id:data?.groupId },
                         message:data?.message,
                         senderId:{ _id:data?.senderId, fullName:data?.senderName },
                         _id:data?.id
             };
        showGroupMessages([newData]);
    }
                           
                       })
                  
                    
                }catch(err){
                     console.log(err.message);
                }

             }
        )();

function asideOnlineStatus(onlineUserIds){
          
      const currentElement = document.querySelectorAll(".wrapImg");
     
      currentElement.forEach(element =>{
              if(element.classList.length > 0){
                   element.classList.remove("online-status");
              }
      })
        
       onlineUserIds.forEach(element =>{
           const currentElement = document.getElementById(element);  
             
           const siblingElement = currentElement.previousSibling;
           
                siblingElement.classList.add("online-status");
            
           
       })
}

function  navOnlineStatus(){
       
   const currentElement = document.querySelectorAll(".profile-image");
     
      currentElement.forEach(element =>{
              if(element.classList.length > 0){
                   element.classList.remove("nav-online-status");
              }
      })
         
     const status =  showOnlineOnNav.some(element =>{
          
           const currentElement =  document.getElementById(`${element}c.1`);
            console.log(currentElement);
           if(currentElement){
             const sibling = currentElement.parentElement;
                sibling.classList.add("nav-online-status")
                return true; 
           }
           return false;
           
       });

       
    return status;
}
           
        //   *** BACKEND API CALL ******* 
      async function backendCall(method,path,{data,params,query}){
               const BASE_URL ="https://messenger-axhs.onrender.com/api/v1" ;
             let options = {
                    method:`${method}`,
                     credentials:"include",
                     headers:{
                         "Content-Type":"application/json",
                         "Authorization":`Bearer ${token}`
                     }
             }
              
             if(data){
                  options.body = JSON.stringify(data);
             }
               
            let finalPath = path ; 
             if(params && typeof params === "object"){

                for(let key in params){
                   finalPath = finalPath.replace(`:${key}`,params[key])
                }
                 
             };
             let queryString = ""
             if(query && Object.keys(query).length > 0){
                  queryString = `?${new URLSearchParams(query).toString()}`;
             };
             try{
                 const response = await fetch(`${BASE_URL}${finalPath}${queryString}`,options)

                 

                   if(!response.ok)
                   {
                       const errorResponse = await response.json();

                         throw new Error(errorResponse.message);
                   }
                 const result = await response.json();
                   return result ;
             }catch(err){
                 console.error(err);
             }
      };

     

   

   function show(element){
       if(element){
            element.classList.remove("hide");
       }
   };
    function hide(element){
       if(element){
            element.classList.add("hide");
       }
    };

   function toggle(element){
       if(element){
             element.classList.toggle("hide");
       }
   }

    

//    message send process --------->
     function sendMessageFunction(sendToId,message,type){
          
          
         let data ={};
           if(type === 'user'){

          
                data ={
                   senderId:sendToId,
                   textMessage:message
               }
            socket.emit("new_message",
                 data
            )
            return;
      }  
      
      if(type === 'group'){
          
           
            data={
                  groupId:sendToId,
                  message:message
            }

           socket.emit("group_new_message",
               data
           )
           console.log("message backend ke liye send");
           return;
      }
     }


      // SIDE SECTION USERS AND GROUP ADD

  function addIntoDocuments(joinedgroup,userLists){
           
            allUserAndGroups.innerText = '';


        if(Array.isArray(joinedgroup) && joinedgroup.length > 0){    
      const newFragment = document.createDocumentFragment();
          joinedgroup.forEach(element => {
                 const parentDiv = document.createElement("div");
                  parentDiv.className="wrap-profile"
               
                 const elementDiv = document.createElement("div");
                 const img_Profile = document.createElement("img");
                 const wrap_Img =document.createElement("div");

                      wrap_Img.className="wrapImg";
                      img_Profile.className='imgProfile'    
                       img_Profile.src=element?.groupImg  
                    elementDiv.className="group" ;  
                    
                   elementDiv.id = element._id;
                   elementDiv.innerText =element.groupName;
                   
                   wrap_Img.append(img_Profile);
                   parentDiv.append(wrap_Img,elementDiv)
                    newFragment.append(parentDiv);  
                               
           });    
            
           allUserAndGroups.append(newFragment);
            
          };

          if(Array.isArray(userLists) &&  userLists.length > 0){
            const newFragment = document.createDocumentFragment();    
             userLists.forEach(element => {
                const parentDiv = document.createElement("div");
                 const elementDiv = document.createElement("div"); 
                    const img_Profile = document.createElement("img");
                 const wrap_Img =document.createElement("div");  
                  wrap_Img.className="wrapImg";
                       img_Profile.className='imgProfile'   
                    elementDiv.className ="user"               
                   elementDiv.id = element._id;
                  
                   elementDiv.innerText =element.fullName;
                       img_Profile.src=element?.profileUrl;
                      parentDiv.className='wrap-profile'
                     wrap_Img.append(img_Profile);
                   parentDiv.append(wrap_Img,elementDiv)
                    newFragment.append(parentDiv); 
           });    
           allUserAndGroups.append(newFragment);
            
          }
  }
 
allUserAndGroups.addEventListener("click",(e)=>{
         
      const clickUser = e.target.closest(".user");

      const mediaQuery = window.matchMedia("(max-width : 600px)");

   function handleChange(e){
      if(e.matches){
           aside_section.classList.add("hide");
           main_section.classList.remove("hide");
      }
   }

  handleChange(mediaQuery);

  mediaQuery.addEventListener("change",handleChange);
     

        if(clickUser){
                      const id =clickUser.id ;
                       // show the message of this -> id
                           showMessageFunction(id,'user');

          // when click on user -> profile section and create group section should be close 
                           show(main_section);
                          hide(profile_section);
                          hide(create_group_section);
                          hide(add_user_container);
                          hide(group_edit_container);
                           currentId=id;
                           currentType='user' 
               
                       
                    
                    
        }
       
        const clickGroup = e.target.closest(".group");

        if(clickGroup){
              const id = clickGroup.id;
                        // show the message of this -> id
                          showMessageFunction(id,'group'); 
                          // show the main section
                          show(main_section);
               // when click on group -> profile section and create group section should be close            
                          hide(profile_section);
                          hide(create_group_section);
                          // hide group edit contianer +  add user container
                          hide(add_user_container);
                          hide(group_edit_container);
                              currentId=id;
                              currentType="group"
                    
                          
        }
         
      
        
})


 
// call backend to show the user and groups

  async function showUsersAndGroup(){
     
        show(loader);
        try{
                const result = await backendCall("GET",'/getuser',{});
                 
                if(result.success){
                   addIntoDocuments(result?.currentUser?.joinedgroup,result.otherUsers);
                }else{
                    alert(result.message)
                }    
                 
        }catch(err){
           console.error(err);
        };

        hide(loader);
       
  }


// private messages ko show krne ke liye ---->

   function privateMessageShow(data){
      const userDetails = sessionStorage.getItem("user");
              const userParse = JSON.parse(userDetails);
             
              if(Array.isArray(data)){
                          const newFragment = document.createDocumentFragment();
                        
                          data.forEach(element =>{
                                  const messageDiv = document.createElement("div");
                                        messageDiv.innerText = element.textMessage ;
                                       messageDiv.className = element.senderId._id === userParse.id ? 'my-message' : 'other-user-message';
                                       messageDiv.dataset.id = element._id ;

                                       newFragment.append(messageDiv);
                          });

                           
                           showAllMessages.append(newFragment); 
                           
                        showAllMessages.scrollTop=showAllMessages.scrollHeight;   
                        };
                    
               
   }


//    group messages ko show krne ke liye 
   function showGroupMessages(data){
       
         const newFragment = document.createDocumentFragment();

         const userDetails = sessionStorage.getItem("user");
              const userParse = JSON.parse(userDetails);
         data.forEach(element=>{
              
            const mainDiv = document.createElement("div");
            const massageDiv= document.createElement("div");
            const senderDiv = document.createElement("span");
            
               mainDiv.innerText = '';
               massageDiv.innerText = '';
               massageDiv.innerText = element.message;
               massageDiv.id=element._id;
               mainDiv.id = element?.groupId._id;
               senderDiv.innerText=element?.senderId?.fullName;
               senderDiv.id = element?.senderId._id;
               senderDiv.className='user-name';
               massageDiv.className="user-message";
               mainDiv.className =element?.senderId._id === userParse.id ? "my-group-message" :"other-user-group-message";
               mainDiv.append(senderDiv,massageDiv);
               
               newFragment.append(mainDiv);
         });

         showAllMessages.append(newFragment);

         showAllMessages.scrollTop=showAllMessages.scrollHeight;
   }
   

  function showEditContainer(result){
                             show_group_members.innerHTML='';
                             profile_details_name.innerText =result?.groupDetails?.groupName;
                             group_profile_img.src = result?.groupDetails?.groupImg; 
                            
                           let details = sessionStorage.getItem("user");

                           const parseDetails= JSON.parse(details);
                              if(parseDetails.id === result?.groupDetails?.admin){
                                  show(delete_group_btn);
                                  delete_group_btn.id=result?.groupDetails?._id ;
                              }

                              if(Array.isArray(result?.groupDetails?.groupMembers)){ 
                               const newFragment = document.createDocumentFragment();

                               result?.groupDetails?.groupMembers.forEach(element=>{
                                  const parentDiv = document.createElement("div");
                                    const member = document.createElement("div");
                                    member.className ='groupMember';
                                     member.innerText = element.fullName;

                                    const btn = document.createElement("button");
                                         btn.innerText= "Remove";
                                         btn.id = element._id;
                                         btn.className = 'remove-btn';
                                         parentDiv.className='parent-group-member'
                                      parentDiv.append(member,btn);
                                      newFragment.append(parentDiv);
                                       
                                      if(parseDetails.id !== result.groupDetails.admin ){
                                        hide(btn);  
                                      }
                                      
                                  
                                      
                            })
                            show_group_members.append(newFragment);
                          } 
                            
  }


show_group_members.addEventListener("click",async(e)=>{
              const closestbtn = e.target.closest(".remove-btn");

                try{
                const result = await backendCall("DELETE",'/leave/:groupId/:userId',{params:{groupId,userId:closestbtn.id}})

                if(result.success){
                      showGroupEditFunction (groupId);
                }else{
                    alert(result.message);
                }
                }catch(err){
                   console.error(err.message);
                }
  
                    
                  })        

//  show MESSAGES ----------->
   async function showMessageFunction(clickId,type) {
             
              const data = sessionStorage.getItem('user');
                      const checkId = JSON.parse(data);
              
                     
                   if(type === 'user'){
                    
                    profile_name.innerText ='';

                    nav_profile_img.src = '';
                   
                      try{
                           const result = await backendCall("GET",'/message',{query:{id:`${clickId}`}});
                           
                            if(result.success){
                                profile_name.innerText = result?.secondUser?.fullName ;
                        
                          hide(threeDot_icon);
                           hide(add_group_icon);
                           hide(group_edit_container);

                            nav_profile_img.src = result?.secondUser?.profileUrl;
                              nav_profile_img.id=result?.secondUser?._id+"c.1";
                             
                          showAllMessages.innerText='';
                             privateMessageShow(result?.chats)
                            }else{
                                alert(result.message);
                            }
                      }catch(err){
                         console.error(err);
                      }
                         
                          
                             
                   };





                   if(type === 'group'){

                         add_group_icon.classList.remove('hide');
                         threeDot_icon.classList.remove("hide");
                          profile_name.innerText ='';
                          profile_details_name.innerText = '';
                          show_group_members.innerText = '';
                           groupId=clickId ;
                           try{
                               const result = await backendCall("GET",'/groupChat',{query:{id:`${clickId}`}});



                               if(result.success){
                                    
                                 showAllMessages.innerText='';
                                   const mediaQuery = window.matchMedia("(max-width : 600px)");

                                 function handleChange(e){
                                 if(e.matches){
                                       let gProfileName =  result?.groupDetails?.groupName;
                                       if(gProfileName.length > 5){
                                        profile_name.innerText = gProfileName.slice(0,5);
                                       }else{
                                          profile_name.innerText = result?.groupDetails?.groupName;
                                       }
                                          }else{
                                             profile_name.innerText = result?.groupDetails?.groupName;
                                          }
                                        }

                                    handleChange(mediaQuery);

                               mediaQuery.addEventListener("change",handleChange);
                                 
                                  nav_profile_img.src=result?.groupDetails?.groupImg;

                                  showAllMessages.innerText='';
                                   showGroupMessages(result?.oldChats);
                               }else{
                                  alert(result.message);
                               }
                               
                           }catch(err){
                               console.error(err);
                           }
                           
                     
                   }
       
   } 


 async function  showGroupEditFunction (groupId){
               show(group_edit_container);
          try{
                 const result = await backendCall("GET",'/groupChat',{query:{id:`${groupId}`}});

                 if(result.success){
                  
                              showEditContainer(result);
                 }else{
                   alert(result.message);
                 }
                  

            }catch(err){
                 console.error(err); 
            }
 }

      //  nav bar - three dot icon  
     threeDot_icon.addEventListener("click",async()=>{
                             
            if(currentType !== 'group' || !groupId){
                   return;
            }
             
              showGroupEditFunction(groupId);
                           
                        })
                           

//    users ko group me add krne ke liye show kro --->
      async function showForAddInGroup(){

        try{
               const result = await backendCall("GET",'/addUsers',{query:{groupId:groupId}});
                console.log(result);
               if(result.success){

                  add_user_lists.innerText = '';
           const newFragment = document.createDocumentFragment();


                 if(result.users.length === 0){
                       const createDiv = document.createElement("div");
                           createDiv.innerText = "All User Already Added . No User Left !!";
                           createDiv.style.color = "white"
                           createDiv.style.fontSize = "1.5rem"
                           newFragment.appendChild(createDiv);
                 }

              result.users.forEach(element =>{
                  const parentDiv = document.createElement("div");
                      const mainDiv = document.createElement("div");
                       const add_btn = document.createElement("button");

                       
                       add_btn.innerText = 'Add';
                        add_btn.className = 'add_user_btn';
                        add_btn.dataset.id = element._id;

                       mainDiv.innerText=element.fullName;
                       mainDiv.classList = 'add_user';

                       parentDiv.classList ='parent_add_user';
                       parentDiv.append(mainDiv,add_btn);

                       newFragment.appendChild(parentDiv);
                      
                       
              });
              add_user_lists.appendChild(newFragment);
               }else{
                  alert(result.message);
               }
            


        }catch(err){
           console.error(err);
        }
            
       }

add_user_lists.addEventListener("click",async(e)=>{
        
  try{
       const btn = e.target.closest(".add_user_btn");
          
          if(!btn){
             return;
          }

          const id = btn.dataset.id;
             
          const res = await backendCall("POST", '/addMember', {
              query: { gId: groupId, id }
           });

           if(res.success){
              showForAddInGroup();
           }else{
               alert(res.message);
           }
          }catch(err){
              console.error(err);
          }
});



   function myProfileFunction(res){
           
           myProfile_name.innerText='';
           myProfile_email.innerText =''
           myProfile_img.src ="";
           myProfile_groups.innerText='';

            myProfile_delete.id=res.data._id;
            myProfile_name.innerText=res.data.fullName;
            myProfile_email.innerText=res.data.email;
            myProfile_img.src = res.data.profileUrl;
            const newFragment = document.createDocumentFragment();
            res.data.joinedgroup.forEach(element =>{
                      const mainDiv = document.createElement("div");
                          mainDiv.innerText = element.groupName;
                           mainDiv.className = 'profile-groups' 
                    newFragment.appendChild(mainDiv)
            })
           myProfile_groups.appendChild(newFragment);
     }  


   // nav-bar three dot icon
   

     
     hide_edit_container.addEventListener("click",()=>{
            hide(group_edit_container);
     })
    
     show_profile_edit.addEventListener("click",()=>{
          toggle(show_profile_options);
     })
     

//      logOut from the site ->

     log_Out.addEventListener("click",async()=>{
           try{
              const result = await backendCall("POST","/logout",{});
                 if(result.success){
                      
                       sessionStorage.clear();
                       localStorage.clear();
                       window.location.href = 'index.html';
                 }
           }catch(err){
              console.error(err)
           }
     });

//      profile edit btn ->
     profile_name_edit_btn.addEventListener("click",(e)=>{
             e.preventDefault();  
                     
             
             show(edit_name_form)
              hide(profile_name_container)
     })



// edit group name form  ------>
     edit_name_form.addEventListener("submit",async(e)=>{
          e.preventDefault();
           const inputValue = document.getElementById("edit_name_input");
         const groupName = inputValue.value.trim();

         if(groupName.length > 10){
               alert("Max 10 letter Name Allowed.");
               return;
         }
       
         try{
              const result = await backendCall("PATCH",'/updategroup',{data:{groupId:`${groupId}`,updateGroupName:groupName}});
          
           if(result.success){
               showUsersAndGroup();
               showMessageFunction(groupId,'group');
               hide(edit_name_form);
               show(profile_name_container);
                       
               hide(hide_edit_container);
                
              
           }else{
             alert(result.message);
           }
           inputValue.value = '';
         }catch(err){
            console.error(err);
         }
         
         
     })



     show_profile.addEventListener("click",async(e)=>{
                 hide(main_section);
                 hide(create_group_section);
           try{
            const mediaQuery = window.matchMedia("(max-width : 600px)");

        function handleChange(e){
         if(e.matches){
           
            hide(aside_section);
             }
             }

         handleChange(mediaQuery);

        mediaQuery.addEventListener("change",handleChange);

                  show(profile_section);
          
           const res = await backendCall("GET",'/profile',{});

           if(res.success){
                 myProfileFunction(res);
           }else{
               alert(res.message);
           }
           

           }catch(err){
              console.error(err)
           }
          
     });

     my_profile_close.addEventListener("click",()=>{
           hide(profile_section)

            const mediaQuery = window.matchMedia("(max-width : 600px)");

        function handleChange(e){
         if(e.matches){
           
            show(aside_section);
             }
             }

         handleChange(mediaQuery);

        mediaQuery.addEventListener("change",handleChange);
            
     });

     create_new_group.addEventListener("click",()=>{
            show(create_group_section);
            hide(main_section)
            hide(profile_section); 
            
            const mediaQuery = window.matchMedia("(max-width : 600px)");

   function handleChange(e){
      if(e.matches){
           show(create_group_section);
            hide(main_section)
            hide(profile_section); 
            hide(aside_section);
      }
   }

  handleChange(mediaQuery);

  mediaQuery.addEventListener("change",handleChange);

     });
     
     close_create_group_section.addEventListener("click",()=>{
            hide(create_group_section);

            const mediaQuery = window.matchMedia("(max-width : 600px)");

        function handleChange(e){
      if(e.matches){
           hide(create_group_section);
            hide(main_section)
            hide(profile_section); 
            show(aside_section);
             }
         }

  handleChange(mediaQuery);

  mediaQuery.addEventListener("change",handleChange);
             
     });

     create_group_form.addEventListener("submit",async(e)=>{
      e.preventDefault();
        const tempStore = document.getElementById("group_name");             
                 const newGroup = tempStore.value.trim();
              tempStore.value = '';

                 if(newGroup.length > 10){
                    alert("Max 10 Letter Group Name Allowed.");
                    return;
                 }
             try{
             const result = await backendCall('POST','/group',{data:{groupName:newGroup}}) ;  
                
             if(result.success){
                   
                 socket.emit("join_group",result?.group?._id);

                   showUsersAndGroup();
                   alert(result.message);
             }else{
                 alert(result.message);
             }

             }catch(err){
              console.error(err);
             }
              
     });

     add_group_icon.addEventListener("click",()=>{
         show(add_user_container);
           showForAddInGroup();
     })
//my-profile-delete-Account -btn

myProfile_delete.addEventListener("click",async()=>{
     try{
           const res = await backendCall("DELETE","/deleteAccount",{});
          if(res.success){
                       sessionStorage.clear();
                       window.location.href = 'index.html';
                 }else{
                    alert(res.message);
                 }
     }catch(err){
        console.error(err);
     }
          
}) 

leave_group.addEventListener("click",async(e)=>{
      try{
              const userDetails = sessionStorage.getItem("user");
          const newuserId = JSON.parse(userDetails);
         
        const res = await backendCall("DELETE",'/leave/:groupId/:userId',{params:{groupId:groupId,userId:newuserId.id}});
       if(res.success){
             hide(main_section);
             showUsersAndGroup();
       }else{
          alert(res.message);
       }
      }catch(err){
         console.error(err);
      }
      
});

 delete_group_btn.addEventListener("click",async()=>{
           try{
           
               const res = await backendCall("DELETE","/delete/:gpId",{params:{gpId:groupId}});
               if(res.success){
                    hide(main_section);
                    showUsersAndGroup();
               }else{
                   alert(res.message);
               }
           }catch(err){
             console.error(err);
           }
 })
add_user_close_btn.addEventListener("click",()=>{
        hide(add_user_container);
})
// message send ------>
 send_message_form.addEventListener("submit",(e)=>{
                           e.preventDefault();
                             const message =   input_message.value.trim();
                     
         
                 console.log("form submit hua");
            sendMessageFunction(currentId,message,currentType);
           
                  input_message.value ='';          
                        })  



   side_bar_searchForm.addEventListener("submit",async(e)=>{
         e.preventDefault();

           const searchInput = document.getElementById("side-bar-search-input");
           
          
              const userName = searchInput.value.trim();
              if(userName === ""){
               return;
                         };
                     searchInput.innerText = "";
                const userDetails = sessionStorage.getItem("user");
          const newuserId = JSON.parse(userDetails);
              try{

                  
                  const result = await backendCall("GET",'/searchProfile/:userName',{params:{userName:userName}});
                  

                  if(result.success)  {
                     const searchUser = result?.data.user.filter(elem =>{ return elem._id !== newuserId.id} )
                     allUserAndGroups.innerText=''; 
                     addIntoDocuments(result?.data?.group,searchUser);
                  }else{
                      alert(result.message);
                  }
               
                 

              }catch(err){
                   console.error(err);
              }

   });

close_tab.addEventListener("click",()=>{
      hide(main_section);

      const mediaQuery = window.matchMedia("(max-width : 600px)");

   function handleChange(e){
      if(e.matches){
           hide(main_section);
           show(aside_section);
      }
   }

  handleChange(mediaQuery);

  mediaQuery.addEventListener("change",handleChange);
})

 


});





