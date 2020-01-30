let addToy = false

document.addEventListener("DOMContentLoaded", ()=>{
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  const toyCollection = document.querySelector("#toy-collection")
  toyForm.addEventListener('submit', handleFormSubmit)

  toyCollection.addEventListener('click', e =>{
    // Like button clicked
    if (e.target.dataset.action === "like") {
      const outerLi = e.target.closest(".card")
      const likeCount = outerLi.querySelector(".like-count")
      const newLikes = parseInt(likeCount.textContent) + 1
      const toyId = outerLi.dataset.id
  
      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          likes: newLikes
        })
      })
  
      // optimistic rendering: DOM manipulation outside of fetch
      likeCount.textContent = newLikes
    }
  })

  function handleFormSubmit(event) {
    event.preventDefault()
    const toyName = event.target["name"].value
    const toyImg = event.target["image"].value
    const newToy = {
      name: toyName,
      image: toyImg,
      likes: 0
    }
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"          
      },
      body: JSON.stringify(newToy)
    })
    .then(r => r.json())
    .then(actualNewToy => {
      renderOneToy(actualNewToy)
    })
  }


  function renderOneToy(toy){
    const outerLi = document.createElement('li')
    outerLi.className = "card"
    outerLi.dataset.id = toy.id
    outerLi.innerHTML = `
      <div>
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <div class="likes">
      <span class="like-count">${toy.likes}</span> Likes
      </div>
      <button data-action="like" class="like-btn">Like <3</button>
      </div>
      `
    toyCollection.append(outerLi)
  }
  
  function renderAllToys(toys){
    toys.forEach(renderOneToy)
  }

  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
    } else {
      toyForm.style.display = 'none'
    }

  })

  fetch("http://localhost:3000/toys")
  .then(r => r.json())
  .then(data => {
    // once we're here, do DOM stuff
    renderAllToys(data)
  })


})
