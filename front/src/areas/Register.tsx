import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from 'qrcode.react'; // Import QRCode library
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
  const [otpSecret, setOtpSecret] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get<Group[]>("http://127.0.0.1:5000/api/groups/get");
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
      setOtpSecret(response.data.otp_secret); // Set the received OTP secret
      setQrCode(response.data.qr_code); // Set the received QR code
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

        {/* Display QR code if available */}
        {qrCode && (
          <div className="qr-code">
            <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />
          </div>
        )}
        {message && <p>{message}</p>}

        <a href="/login">уже есть аккаунт?</a>
      </div>
    </div>
  );
};

export default Register;
