
//signUp ------->
const createAccount = document.querySelector("#createAccountBtn");
const signMain = document.querySelector(".signMain");
const signName = document.getElementById("signName");
const signPass = document.getElementById("signPass");
const signEmail = document.getElementById("signEmail");
const signBtn = document.querySelector(".signUpbtn");
const signform = document.querySelector(".signContainer");


//logIn --------->
const logMain = document.querySelector(".logMain");
const logEmail = document.getElementById("logemail");
const logPass = document.getElementById("logPass");
const logBtn = document.querySelector(".logbtn");
const logform = document.querySelector(".logContainer");

      signMain.classList.add("active");


 //socket.io ----------->
 
 

//button pe click ho to signUp form show kr do ---->      
createAccount.addEventListener("click",()=>{
         signMain.classList.remove("active");
         logMain.classList.add("active");
         
});

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

