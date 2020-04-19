import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [ repositories, setRepositories ] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  async function handleAddRepository() {
    const title = document.getElementById('newTitle').value;
    const url = document.getElementById('newUrl').value;
    const tecnology1 = document.getElementById('newTechnology1').value;
    const tecnology2 = document.getElementById('newTechnology2').value;
    const tecnology3 = document.getElementById('newTechnology3').value;

    const techs = [];
    if(tecnology1 !== 0) techs.push(tecnology1);
    if(tecnology2 !== 0) techs.push(tecnology2);
    if(tecnology3 !== 0) techs.push(tecnology3);

    console.log(techs);

    const repository = {
      title: title,
      url: url,
      techs:techs
    };

    const response = await api.post('/repositories', repository);

    const repositoryResponse = response.data;

    setRepositories([ ...repositories, repositoryResponse]);
  }

  async function handleRemoveRepository(id) {
    const  repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(repositoryIndex < 0) {
      alert('Elemento não encontrado');
    }
 
    await api.delete(`/repositories/${id}`);

    setRepositories(repositories.filter(repository => repository.id !== id));
  }

  async function handleAddLikeRepository(id){    
    const  repositoryIndex = repositories.findIndex(repository => repository.id === id);

    const response = await api.post(`/repositories/${id}/like`);

    repositories[repositoryIndex]["likes"] = response.data.likes;

    setRepositories([ ...repositories ]);    
  }

  return (
    <div className="page">
      <div className="form">
        <br/>
        <p>Cadastro de Repositórios</p>
        <br/>
        <label>Título</label><br/>
        <input className="input" type="text" id="newTitle"/><br/>
        <label>Url</label><br/>
        <input className="input" type="text" id="newUrl"/><br/>
        <label>Tecnologia 1</label><br/>
        <input className="input" type="text" id="newTechnology1"/><br/>
        <label>Tecnologia 2</label><br/>
        <input className="input" type="text" id="newTechnology2"/><br/>
        <label>Tecnologia 3</label><br/>
        <input className="input" type="text" id="newTechnology3"/><br/>
        <button className="submit" onClick={handleAddRepository}>Adicionar</button>
      </div>
      <ul data-testid="repository-list">
        { repositories.map(repository => 
              <li key={repository.id}>
                <button onClick={() => handleRemoveRepository(repository.id)}>
                  Remover
                </button>
                <button onClick={() => handleAddLikeRepository(repository.id)}>
                  Like {repository.likes}
                </button>{ repository.title}
                </li>)
          }   
      </ul>
      <br/>
    </div>
  );
}

export default App;
