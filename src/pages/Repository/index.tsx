import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';
import { Header, RepositoryInfo, Issues } from './styles';
import api from '../../services/api';

interface RepositoryParams {
  user: string;
}

interface Repository {
  full_name: string;
  description: string;
}

interface Repository {
  id: number;
  title: string;
  html_url: string;
}

interface User {
  name: string;
  avatar_url: string;
  bio: string;
  html_url: string;
  public_repos: string;
  public_gists: string;
  type: string;
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();
  const [user, setUser] = useState<User | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  useEffect(() => {
    api.get(`users/${params.user}`).then(response => {
      setUser(response.data);
    });
    api.get(`users/${params.user}/repos`).then(response => {
      setRepositories(response.data);
    });
  }, [params.user]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>
      {user && (
        <RepositoryInfo>
          <header>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <strong>{user.html_url}</strong>
              <p>{user.bio}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{user.public_repos}</strong>
              <span>Repositórios</span>
            </li>
            <li>
              <strong>{user.public_gists}</strong>
              <span>Gists</span>
            </li>
            <li>
              <strong>{user.type}</strong>
              <span>Tipo</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}
      <Issues>
        {repositories.map(repo => (
          <a target="blank" href={repo.html_url}>
            <div>
              <strong>{repo.full_name}</strong>
              <p>{repo.description}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
