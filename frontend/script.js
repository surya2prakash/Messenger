document.addEventListener("DOMContentLoaded",()=>{

      // **************SECTIONS ********************
           const login_section = document.querySelector(".login-section");
           const signup_section = document.querySelector(".signup-section");
           const loader_section = document.querySelector(".loadder");
           const create_account = document.querySelector(".create-account");
           const already_account = document.querySelector(".already-account");

      //--------- IMPORT FORMS----------------
            const signup_form = document.querySelector(".signup-form");
            const login_form = document.querySelector(".login-form");
     

         // ************* FUNCTION TO HIDE AND SHOW SECTIONS AND LOADER***********  
      function show(show)
      {   
            // hide the loader
            loader_section.classList.add("hide");

          if(login_section === show){
               //eska matlab show nhi hai 
               signup_section.classList.add("hide");
               login_section.classList.remove("hide");
          }else{
              signup_section.classList.remove("hide");
                 login_section.classList.add("hide"); 
          } 
      };
     
       function showLoader(showLoader)
       {
           
               signup_section.classList.add("hide");
                login_section.classList.add("hide");
                loader_section.classList.remove('hide');
          
       }

      // ******API CALL************
       
      async function backendCall(method,path,{data}){
          const url ="http://localhost:5000/api/v1" ;

             let options =   {
                   method:`${method}`,
                   credentials:"include",
                   headers:{
                      'Content-Type':'application/json'
                   }
                  }

            if(data)
               {
                   options.body = JSON.stringify(data);
               };

               let finalpath = path;
  
               
           let updatedUrl= `${url}${finalpath}`;   
               
          try{
              const response = await fetch(`${updatedUrl}`,options)

              if(!response.ok){
               const errorResponse = await response.json(); 
                  throw new Error( `HTTP ERROR: ${errorResponse.message}`) 
              }
               const result = await response.json(); 
               
               return result;
          }catch(err){
             console.error(err);

             throw err ;
          }
               
      }

       // *****EVENT LISTINERS*******
      create_account.addEventListener("click",(e)=>{
              show(signup_section);
      });

      already_account.addEventListener("click",(e)=>{
       
           show(login_section);
      });


     signup_form.addEventListener("submit",async(e)=>{
       e.preventDefault();
           const user_name = document.getElementById("user-name");
           const user_email = document.getElementById("user-email");
           const user_password = document.getElementById("user-password");
           const user_confirmPass = document.getElementById("user-confirmPassword");
              
               if(user_confirmPass.value !== user_password.value)
               {
                  alert("Password Not Match.");
                  return;
               };
              const data={
                 fullName:user_name.value.trim(),
                 email:user_email.value.trim(),
                 password:user_password.value.trim(),
              };

           try{
                   showLoader();
                  const result  = await backendCall('POST','/sign',{data});
                  if(result.success)
                  {
                  // if success then ->
                      show(login_section);
                  }else{
                     // if success:false then ->
                     alert(result.message);
                     show(signup_section);
                  }
           }catch(err)
           {
              console.error(err.message);
            //   if network err then show
              show(signup_section);
           }   
        
        
     })    
      
    login_form.addEventListener("submit",async(e)=>{
      e.preventDefault();
           const userEmail = document.getElementById("login-email");
           const userPassword = document.getElementById("login-password");
        
           const data ={
              email:userEmail.value.trim(),
              password:userPassword.value.trim()
           };

         try{
             showLoader();
            const result = await backendCall('POST',"/login",{data})
                   localStorage.clear();
            if(result.success){

                 localStorage.setItem("token",result.data);
                 window.location.href = 'chatBox.html'
             
            }else{
               //if success false then ->
                alert(result.message);
                show(login_section);
            }

         }catch(err){
            console.error(err);
      //if network error then ->
            show(login_section);
         }



    })
       
})