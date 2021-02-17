import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../service/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>(() => {
    const storagedRepos = localStorage.getItem('@GithubExplore:Repos');

    if (storagedRepos) {
      return JSON.parse(storagedRepos);
    }

    return [];
  });
  const [newRepo, setNewRepo] = useState('');

  const [inputError, setInputError] = useState('');

  useEffect(() => {
    localStorage.setItem('@GithubExplore:Repos', JSON.stringify(repos));
  }, [repos]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Put the author/name of Repository');
      return;
    }

    try {
      const res = await api.get<Repository>(`repos/${newRepo}`);

      const repo = res.data;

      setRepos([...repos, repo]);
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError(err.message);
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore Repositories in Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Type the name of repository"
          type="text"
        />
        <button type="submit">Search</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repos.map((repo) => (
          <Link key={repo.full_name} to={`/repository/${repo.full_name}`}>
            <img src={repo.owner.avatar_url} alt={repo.owner.login} />
            <div>
              <strong>{repo.full_name}</strong>
              <p> {repo.description} </p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
