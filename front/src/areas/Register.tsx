import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/register.scss';

interface Group {
  group_id: string;
  group_name: string;
}

const roles = [
  { id: "student", name: "Студент" },
  { id: "teacher", name: "Преподаватель" },
];

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/groups/get");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/user/register", {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        role: role,
        group_id: role === "Студент" ? groupId : undefined,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Registration failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="register">
      <div className="register-content">
        <h2>Регистрация</h2>
        <form onSubmit={handleRegister}>
          <div className="register-content-form-row">
            <div className="register-content-form-group">
              <label htmlFor="role">Роль</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Выберите свою роль</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            {role === "Студент" && (
              <div className="register-content-form-group">
                <label htmlFor="groupId">Группа</label>
                <select id="groupId" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                  <option value="">Выберите группу</option>
                  {groups.map((group) => (
                    <option key={group.group_id} value={group.group_id}>
                      {group.group_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="register-content-form-row">
            <div className="register-content-form-group">
              <label htmlFor="firstName">Имя</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Укажите имя"
              required
              />
            </div>
            <div className="register-content-form-group">
              <label htmlFor="lastName">Фамилия</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Укажите фамилию"
              required
              />
            </div>
          </div>
          <div >
            <div className="register-content-form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите электронную почту"
              required
              />
            </div>
          </div>
          <div className="register-content-form-password">
            <div className="register-content-form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Придумайте пароль"
              required
              />
            </div>
            <div className="register-content-form-group">
              <label htmlFor="confirmPassword">Повторите пароль</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
              required
              />
            </div>
          </div>
          <button type="submit">Зарегистрироваться</button>
        </form>
        <div className='register-content-form-login'>
          <p>Уже есть аккаунт?</p>
          <a href="/register" className="register-link">Войдите</a>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
