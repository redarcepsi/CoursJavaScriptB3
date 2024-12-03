const table = document.querySelector('table')
const headers = ["","firstname", "lastname", "email", "phone", "password"];

function obtention(){
fetch('http://localhost:3000/users')
  .then(result => result.json()) 
  .then(data => {
    table.innerHTML="";

    //header
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow); // Ajoute la rangée des en-têtes au tableau

    //user
    data.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type='checkbox' data-id="${user.id}"></td>
        <td>${user.firstname || ''}</td>
        <td>${user.lastname || ''}</td>
        <td>${user.email || ''}</td>
        <td>${user.phone || ''}</td>
        <td>${user.password || ''}</td>
      `;

      table.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Erreur:', error);
  });
}

document.getElementById('addUserForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const user = {
      firstname: document.getElementById('firstname').value,
      lastname: document.getElementById('lastname').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      password: document.getElementById('password').value,
    };
  
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de l’ajout de l’utilisateur');
        }
        return response.json();
      })
      .then(() => {
        obtention();
        document.getElementById('addUserForm').reset();
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
});

function suppr(){
    const checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    const idsToDelete = Array.from(checkboxes).map(cb => cb.dataset.id);

    Promise.all(idsToDelete.map(id => {
        return fetch(`http://localhost:3000/users/${id}`, {
            method: 'DELETE',
        });
    }))
        .then(() => {
            obtention();
        })
        .catch(error => {
            console.error('Erreur lors de la suppression:', error);
        });
}

obtention()