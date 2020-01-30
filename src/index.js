let addToy = false

document.addEventListener("DOMContentLoaded", ()=>{
  const addBtn = document.querySelector('#new-toy-btn')
  const toyFormContainer = document.querySelector('.container')
  const toyForm = document.querySelector('.add-toy-form')
  const toyCards = document.querySelector('#toy-collection')
  toyForm.addEventListener("submit", handleFormSubmit)
  toyCards.addEventListener("click", handleLike)
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyFormContainer.style.display = 'block'
    } else {
      toyFormContainer.style.display = 'none'
    }
  })
  
  
  fetch('http://localhost:3000/toys')
    .then((resp) =>{
      return resp.json();
    })
    .then((json)=>{
      renderAllToys(json);
    })
    

})

// const toyContainer = document.querySelector('#toy-collection')
function renderOneToy(toy){
  const toyCard = document.createElement('div');
  toyCard.className = 'card';
  toyCard.dataset.id = toy.id;
  toyCard.innerHTML =`
  <h2>${toy.name}</h2>
  <img src=${toy.image} class="toy-avatar">
  <p>${toy.likes} Likes</p>
  <button data-action="like" class="like-button">Like<3</button>
  `
  document.querySelector('#toy-collection').append(toyCard)
}

function renderAllToys(toys){
  toys.forEach(function(toy){
    renderOneToy(toy);
  })
}

function handleFormSubmit(event){
  event.preventDefault()
  const toyName = event.target["name"].value
  const toyImage = event.target["image"].value
  const newToy = {
    name: toyName,
    image: toyImage,
    likes: 0
  }
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(newToy)
  })
  .then(resp => resp.json())
  .then(actualNewToy => {
    renderOneToy(actualNewToy)
  })
  document.querySelector('.container').style.display = 'none'
  event.target.reset()
}

function handleLike(event){
  if (event.target.dataset.action === 'like'){
    const parentCard = event.target.closest('.card')
    const likeCount = parseInt(parentCard.querySelector('p').textContent) + 1
    const toyId = parentCard.dataset.id
    
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
          likes: likeCount
      })
    })
    parentCard.querySelector('p').textContent = `${likeCount} Likes`
  }
  
}
