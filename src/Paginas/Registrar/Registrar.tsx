import { FaUser, FaLock, FaIdCard, FaPhone } from "react-icons/fa";
import './Register.css';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, getFirestore, setDoc, doc } from "../../Services/FirebaseConfig";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
<script src="https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"></script>

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [oab, setoab] = useState('');
  const [errorMensagem, setErrorMensagem] = useState<string>('');
  const navigate = useNavigate();

  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    console.log('Erro:', errorMensagem);
  }, [errorMensagem]);

  useEffect(() => {
    if (error) {
      setErrorMensagem('Conta já cadastrada');
    }
  }, [error]);

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      if (userCredential) {
        const user = userCredential.user;
        const userDocRef = doc(getFirestore(), "users", user.uid);
        await setDoc(userDocRef, {
          name,
          cpf,
          oab,
          phone,
          email
        });
        navigate('/Dashboard');
      }
    } catch (error) {
      console.log('Erro:', error);
    }
  };

  if (loading) {
    return <p>Carregando...</p>
  }
  if (user) {
    navigate('/Dashboard');
    return null;
  }

  return (
    <div>
      <div className="register-container">
        <form>
          {errorMensagem && (
            <p style={{ color: 'red' }}>{errorMensagem}</p>
          )}
          <h1> Cadastrar </h1>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Digite Seu Nome"
              onChange={(e) => setName(e.target.value)} />
            <FaUser className="icon" />
          </div>
          <div>
            <input
              type="text"
              name="cpf"
              id="cpf"
              placeholder="Digite Seu CPF"
              onChange={(e) => setCpf(e.target.value)} />
            <FaIdCard className="icon" />
          </div>
          <div>
            <input
              type="text"
              name="oab"
              id="oab"
              placeholder="Digite Sua oab"
              onChange={(e) => setoab(e.target.value)} />
            <FaIdCard className="icon" />
          </div>
          <div>
            <input
              type="text"
              name="phone"
              id="phone"
              placeholder="Digite Seu Telefone"
              onChange={(e) => setPhone(e.target.value)} />
            <FaPhone className="icon" />
          </div>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Digite Seu E-mail"
              onChange={(e) => setEmail(e.target.value)} />
            <FaUser className="icon" />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder='Digite Sua Senha'
              onChange={(e) => setPassword(e.target.value)} />
            <FaLock className="icon" />
          </div>
          <button
            className="button" onClick={handleSignOut}>Cadastrar
          </button>
          <div className="signup-link">
            <p> Já possui conta? 
              <a href="/Login">Entrar</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Register;