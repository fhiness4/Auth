      const name = document.getElementById('name')
        const message = document.getElementById('message')
        const email = document.getElementById('email')
        const password = document.getElementById('password')
        const username = document.getElementById('username')
        const useremail = document.getElementById('useremail')
        const btn = document.getElementById('btn');

        btn.addEventListener('click',async (e)=>{
          e.preventDefault()
          const response = await fetch('http://localhost:8000/api/auth/signup', {
            method: "POST",
            mode: "cors",
            headers:{
                "content-Type": "application/json"
            },
            body:JSON.stringify({
                email: `${email.value}`,
                name: `${name.value}`,
                password: `${password.value}`
            })
          });
          const res = await response.json();
          message.innerHTML = res.message
          console.table(res);
          if (res.success === true) {
            e.target.innerHTML = 'loading...'
            setInterval(() => {
             window.location.href = 'postdasbord.html'
            }, 1000);
          }
          username.innerHTML = `${res.user.name}`
          useremail.innerHTML = `${res.user.email}`
        });

        