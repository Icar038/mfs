import {FaUser  , FaLock} from "react-icons/fa";
import './Login.css';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from "../../Services/FirebaseConfig";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMensagem, setErrorMensagem] = useState<string>('');
  const navigate = useNavigate();


  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

 // Monitora erros de autenticação
 useEffect(() => {
  if (error) {
    setErrorMensagem('Email ou senha inválidos');
  }
}, [error]);

// Redireciona o usuário após o login bem-sucedido
useEffect(() => {
  if (user) {
    navigate('/dashboard');
  }
}, [user, navigate]);

// Função para lidar com o login
function handleSignOut(e: React.FormEvent) {
  e.preventDefault();
  signInWithEmailAndPassword(email, password)
    .then(() => {
      // Autenticação bem-sucedida
    })
    .catch((error) => {
      console.log('Erro:', error);
    });
}

// Exibe um carregamento enquanto a autenticação está em andamento
if (loading) {
  return <div className="min-h-60 flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
  <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
    <div className="flex justify-center">
      <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  </div>
</div>;
}
  return (
    <div>
      <div className="login-container">
        <div className="right-container">
          <img src="src\assets\principal.png" alt="Visual" />
        </div>
        <form>
        {errorMensagem && (
            <p style={{ color: 'red' }}>{errorMensagem}</p>
          )}
          <h1> Acesse o Sistema</h1>
          <div>
            <input 
              type="email" 
              value={email}
              name="email"
              id="email"
              placeholder="Digite Seu E-mail"
              onChange={(e) => setEmail(e.target.value)} />
            <FaUser   className="icon" />
          </div>
          <div> 
            <input 
              type="password"
              value={password}
              name="password"
              id="password"
              placeholder='Digite Sua Senha'
              onChange={(e) => setPassword (e.target.value)}
              />
            <FaLock className="icon" />
          </div>

          <div className="recall-forget">
            <label>
              <input type="checkbox" />
              Lembrar de mim?
            </label>
          </div>

          <button
            className="button" onClick={handleSignOut}>Entrar
          </button>

          <div className="signup-link">
            <p> Não tem uma conta ainda? 
              <a href="/Registrar">Registrar</a>
            </p>
          </div>
          
        </form>
      </div>
    </div>
  )
}

export default Login