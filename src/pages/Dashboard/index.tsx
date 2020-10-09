import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { Title, Form, Users, Error } from './styles';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

interface User {
  name: string;
  avatar_url: string;
  login: string;
  bio: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState('');

  const [users, setUsers] = useState<User[]>(() => {
    const storangeUsers = localStorage.getItem('@githubExplorer:users');
    if (storangeUsers) {
      return JSON.parse(storangeUsers);
    }
    return [];
  });

  const [inputError, setInputError] = useState('');

  useEffect(() => {
    localStorage.setItem('@githubExplorer:users', JSON.stringify(users));
  }, [users]);

  async function handleAddUser(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!user) {
      setInputError('Digite o nome do usuário');
      return;
    }

    try {
      const response = await api.get<User>(`users/${user}`);
      const userData = response.data;

      setUsers([...users, userData]);
      setInputError('');
      setUser('');
    } catch (error) {
      setInputError('Erro na busca por esse usuário');
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios dos seus usuários favoritos no Github</Title>

      <Form hasError={Boolean(inputError)} onSubmit={handleAddUser}>
        <input
          value={user}
          onChange={e => setUser(e.target.value)}
          placeholder="Digite um usuário do github ( ex: facebook )"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Users>
        {users.map((
          // eslint-disable-next-line no-shadow
          user,
        ) => (
          <Link key={user.name} to={`repositories/${user.login}`}>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <strong>{user.name}</strong>
              <p>{user.bio}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Users>
    </>
  );
};
export default Dashboard;
