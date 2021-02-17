import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import api from '../../service/api';

import logoImg from '../../assets/logo.svg';

import { Header, RepoInfo, Issues } from './styles';

interface RepoParams {
  repo: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepoParams>();

  const [repo, setRepo] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    api.get(`repos/${params.repo}`).then((resp) => {
      setRepo(resp.data);
    });
    api.get(`repos/${params.repo}/issues`).then((resp) => {
      setIssues(resp.data);
    });

    // async function loadData() {
    //   const [repos, issues] = await Promise.all([
    //     api.get(`repos/${params.repo}`),
    //     api.get(`repos/${params.repo}/issues`),
    //   ]);
    // }

    // loadData();
  }, [params.repo]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explore" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repo && (
        <RepoInfo>
          <header key={repo.full_name}>
            <img src={repo.owner.avatar_url} alt="User Avatar" />
            <div>
              <strong>{repo.full_name}</strong>
              <p>{repo.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repo.stargazers_count}</strong>
              <span>Starts</span>
            </li>
            <li>
              <strong>{repo.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repo.open_issues_count}</strong>
              <span>Opended Issues</span>
            </li>
          </ul>
        </RepoInfo>
      )}

      <Issues>
        {issues.map((issue) => (
          <a key={issue.id} href={issue.html_url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>

            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
