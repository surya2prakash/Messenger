
let socket = null;
(async function forverifytoken(){
      try{
        const response = await fetch("http://localhost:5000/api/v1/verifytoken",{
         method:"GET",
         credentials:"include",
         headers:{
            "Content-Type":"application/json"
         }
      });
     const result = await response.json();
      console.log(result);

       socket=io("http://localhost:5000",{
         withCredentials: true
      });


       isverifyed();

      }catch(err){
         console.error(err.message);
      }

      
})();


function isverifyed()
{
     if(socket === null)
     {
        return ;
     };

     socket.on("connect",()=>{
        console.log("verification ho gya ..");

        
      });

      socket.on("connect_error",()=>{
        console.log("auth failed");

        window.location.href="index.html"
    })

};

socket.on("new_message",(message)=>{
    console.log(message);
});

socket.emit




