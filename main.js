const getUsers= async ()=>{
    const loader = document.querySelector('.loader');
    loader.classList.add('is-visible');

    try{
 
    const respons= await axios.get('https://ums12.runasp.net/api/users?limit=1000');
    return respons;
    }catch(error){
        console.error(error);
        alert("error in git");
        return null;
    } finally {
        loader.classList.remove('is-visible');
    }
}


const displayUsers=async ()=>{
const users= await getUsers();
 if(!users) return ; // if users == null ? return 
// console.log(users); array 
const data=users.data.users;
console.log(data); 

const result = data.map((user)=>{
// const userId = user.id ?? data.indexOf(user);
// sessionStorage.setItem(`people-manager-user-${userId}`, JSON.stringify(user));
return `
   <tr class="text-slate-700 dark:text-slate-200">
                <td class="whitespace-nowrap px-5 py-4 font-medium">${user.name}</td>
                <td class="whitespace-nowrap px-5 py-4">${user.age}</td>
                <td class="whitespace-nowrap px-5 py-4">${user.email}</td>
                <td class="whitespace-nowrap px-5 py-4 font-mono">••••••••</td>
                <td class="flex items-center justify-end gap-2 px-5 py-4">
                <button type="button" class="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950" onclick="deleteUser(${user.id})">Delete</button>
                  <a href="details.html?id=${encodeURIComponent(user.id)}" class="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900">Details</a>
                </td>
              </tr>

`

}).join('');

document.querySelector('.users-table').innerHTML = result;

}
displayUsers();

const deleteUser= async (id)=>{
    try{
        const response = await axios.delete(`https://ums12.runasp.net/api/users/${id}`);
        console.log(response);
        displayUsers();
    }catch(error){
        alert("error in delete user");
    }

}
const userForm = document.forms['user-form'];

userForm.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(userForm);
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const response = await axios.post('https://ums12.runasp.net/api/users', formData);
    localStorage.setItem(`user-password-${email}`, password);//every one has his own unieqe email,according it we can store the password for every unieqe user,if we want use id instead of email,we will face many problems
    //we cant export id from details.js to main.js beacause we havent id in index.html
    //beacause above problem , the id come from api,only details.js/html can see it,and when we write like this     localStorage.setItem(`user-password-${id}`, password),here id is null,beacuse we cant see it

    location.href = 'index.html';
  } catch (error) {
    console.error(error.response?.data || error);
    alert('فشل إضافة المستخدم');
  }
};
const deleteall=document.querySelector('#delete-all');
deleteall.onclick=async()=>{
  const response=await getUsers();
  const users= response.data.users;
   for(const user of users)
  await axios.delete(`https://ums12.runasp.net/api/users/${user.id}`);
localStorage.clear();
displayUsers();

  }