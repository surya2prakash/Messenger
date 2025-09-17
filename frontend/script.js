window.addEventListener("load",()=>{


//signUp ------->

const signSection = document.querySelector(".sign-section");
const signName = document.getElementById("sign-name");
const signPass = document.getElementById("sign-pass");
const signEmail = document.getElementById("sign-email");
const signform = document.querySelector(".sign-form");

// signUp Pe ho aur login page show krna hai -->
const showLogBtn = document.querySelector(".show-log-btn");

//logIn --------->
const loginSection = document.querySelector(".login-section");
const logEmail = document.getElementById("login-email");
const logPass = document.getElementById("login-pass");
const logform = document.querySelector(".login-form");
//login pe ho aur btn click hone pe signUp page show krna hai --->
const createAccount = document.querySelector("#show-sign-btn");

  
     signSection.classList.add("active");
      

    



 
 

//button pe click ho to signUp form show kr do ---->      
createAccount.addEventListener("click",()=>{
       signSection.classList.remove("active");  
        loginSection.classList.add("active");
         
});

showLogBtn.addEventListener("click",()=>{
      signSection.classList.add("active");  
        loginSection.classList.remove("active");
})

//signUp -- backend call 
async function signUpbackend(data){
     try{
           const response = await fetch("http://localhost:5000/api/v1/sign",{
              method:"POST",
              
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify(data)
           });
        const result = await response.json();
           console.log(result);
     }catch(err){
         console.error(err.message);
     }
}


//signUp --form handeling --->
signform.addEventListener("submit",(event)=>{
    event.preventDefault();
    const email = signEmail.value.trim();
    const fullName = signName.value.trim();
    const password = signPass.value.trim();



    const data ={
         email:email,
         fullName:fullName,
         password:password
    };

    signUpbackend(data);
});


//logIn backend call ------->
 async function logInBackend(data)
 {
    try{

        const response = await fetch("http://localhost:5000/api/v1/login",{
             method:"POST",
             credentials:"include",
             headers:{
                "Content-Type":"application/json"
             },
             body:JSON.stringify(data)
        });

        const result = await response.json();
        if(result.success)
        {
             alert(result.message);
             window.location.href='chatBox.html'
          
        }else{
             alert(result.message);
        }

    }catch(err){
       console.log(err.message);
    }
 }

 //logIn form handeling ---->
logform.addEventListener("submit",(event)=>{
      event.preventDefault();
    
      const email = logEmail.value.trim();
      const password = logPass.value.trim();
        
      
      const data = {
           email:email,
           password:password
      }
      
      logInBackend(data);
})

})
