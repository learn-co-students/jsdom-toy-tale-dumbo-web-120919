let addToy = false

document.addEventListener("DOMContentLoaded", ()=>{


  const toyList = document.querySelector("#toy-collection")

  function renderAllToys(toys) {
    toys.forEach(renderOneToy)
  }

  function renderOneToy(toy) {
    const outerLi = document.createElement('li')
    // outerLi.className = "card"
    outerLi.dataset.id = toy.id
     
    outerLi.innerHTML = `
    <div class="card">
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" >
      <div class="likes">
        <span class="like-count">${toy.likes}</span> likes
      </div>

      <button class="like-btn" data-action="like"> Like <3 </button>
    </div>
    `

    toyList.append(outerLi)
  }

  fetch("http://localhost:3000/toys")
  .then(r => r.json())
  .then((data) => {
    renderAllToys(data)
  })

  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
    } else {
      toyForm.style.display = 'none'
    }
  })

  toyForm.addEventListener("submit", handleFormSubmit)

  function handleFormSubmit(event) {
    event.preventDefault()
    const toyName = event.target["name"].value
    const toyImage = event.target["image"].value

    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0
    }

    fetch("http://localhost:3000/toys", {
      method: 'POST',
      headers: 
        {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
 
      body: JSON.stringify(newToy)
    })
    .then(r => r.json())
    .then(actualNewToy => {
      renderOneToy(actualNewToy)
    })
  }

  toyList.addEventListener("click", event => {
    if (event.target.dataset.action === "like") {
      const outerLi = event.target.closest("li")
      const likeCount = outerLi.querySelector(".like-count")
      const newLikes = parseInt(likeCount.textContent) + 1
      const toyId = outerLi.dataset.id

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: 
          {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
        body: JSON.stringify({
            likes: newLikes
          })
      })
      
      likeCount.textContent = newLikes

    }

  })  


})
