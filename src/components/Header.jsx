import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { CiUser } from "react-icons/ci";
import {
  clearSessionAccount,
  deleteAccount,
  getSessionAccount,
  loginAccount,
  registerAccount,
  updateAccount,
} from "../services/mockBackend";

const emptyContact = { name: "", phone: "" };

const buildAccountName = (firstName, lastName) => `${String(firstName || "").trim()} ${String(lastName || "").trim()}`.trim();

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [account, setAccount] = useState(() => getSessionAccount());
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });
  const [contacts, setContacts] = useState(() => {
    const sessionAccount = getSessionAccount();

    return sessionAccount?.role === "user" && sessionAccount.emergencyContacts?.length
      ? sessionAccount.emergencyContacts
      : [{ ...emptyContact }];
  });
  const [authError, setAuthError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const sessionAccount = await loginAccount(loginForm.email, loginForm.password);

    if (!sessionAccount) {
      setAuthError("Email sau parolă incorectă.");
      return;
    }

    setAccount(sessionAccount);
    setContacts(
      sessionAccount.role === "user" && sessionAccount.emergencyContacts?.length
        ? sessionAccount.emergencyContacts
        : [{ ...emptyContact }],
    );
    setLoginForm({ email: "", password: "" });
    setAccountOpen(true);
    setAuthError("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!registerForm.firstName.trim() || !registerForm.lastName.trim()) {
      setAuthError("Write your name and surname.");
      return;
    }

    const payload = {
      ...registerForm,
      name: `${registerForm.firstName.trim()} ${registerForm.lastName.trim()}`,
      emergencyContacts: registerForm.role === "user"
        ? contacts.filter((contact) => contact.name.trim() && String(contact.phone || "").trim().length > 0)
        : [],
    };

    const result = await registerAccount(payload);

    if (result?.error) {
      setAuthError(result.error);
      return;
    }

    const nextContacts =
      result.role === "user" && result.emergencyContacts?.length
        ? result.emergencyContacts
        : [{ ...emptyContact }];

    setAccount(result);
    setContacts(nextContacts);
    setAuthMode("login");
    setRegisterForm({ firstName: "", lastName: "", email: "", password: "", role: "user" });
    setAccountOpen(true);
    setAuthError("");
  };

  const handleLogout = () => {
    clearSessionAccount();
    setAccount(null);
    setContacts([{ ...emptyContact }]);
    setLoginForm({ email: "", password: "" });
    setRegisterForm({ firstName: "", lastName: "", email: "", password: "", role: "user" });
    setAuthMode("login");
    setAuthError("");
    setAccountOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (!account) {
      return;
    }

    await deleteAccount(account.id);
    clearSessionAccount();
    setAccount(null);
    setContacts([{ ...emptyContact }]);
    setAuthMode("login");
    setAccountOpen(false);
  };

  const addContactField = () => {
    setContacts((current) => [...current, { ...emptyContact }]);
  };

  const removeContactField = (indexToRemove) => {
    setContacts((current) => {
      const nextContacts = current.filter((_, index) => index !== indexToRemove);
      return nextContacts.length > 0 ? nextContacts : [{ ...emptyContact }];
    });
  };

  const updateContact = (index, field, value) => {
    const nextValue = value;

    setContacts((current) =>
      current.map((contact, contactIndex) =>
        contactIndex === index ? { ...contact, [field]: nextValue } : contact,
      ),
    );
  };

  const canDeleteContact = (contact) => {
    return Boolean(contact?.name?.trim() && String(contact.phone || "").trim().length > 0);
  };

  const updateProfileField = (field, value) => {
    setAccount((current) => {
      if (!current) {
        return current;
      }

      const nextFirstName = field === "firstName" ? value : current.firstName || current.name?.split(" ")[0] || "";
      const nextLastName = field === "lastName" ? value : current.lastName || current.name?.split(" ").slice(1).join(" ") || "";
      const nextName = buildAccountName(nextFirstName, nextLastName);

      return {
        ...current,
        [field]: value,
        firstName: nextFirstName.trim(),
        lastName: nextLastName.trim(),
        name: nextName,
      };
    });
  };

  const saveProfile = async () => {
    if (!account) {
      return;
    }

    const nextAccount = {
      ...account,
      firstName: String(account.firstName || account.name?.split(" ")[0] || "").trim(),
      lastName: String(account.lastName || account.name?.split(" ").slice(1).join(" ") || "").trim(),
      name: buildAccountName(account.firstName, account.lastName),
    };

    const result = await updateAccount(nextAccount);
    setAccount(result);
    setContacts(result.role === "user" && result.emergencyContacts?.length ? result.emergencyContacts : [{ ...emptyContact }]);
  };

  const saveEmergencyContacts = async () => {
    if (!account || account.role !== "user") {
      return;
    }

    const emergencyContacts = contacts.filter(
      (contact) => contact.name.trim() && String(contact.phone || "").trim().length > 0,
    );
    const updatedAccount = { ...account, emergencyContacts };
    const result = await updateAccount(updatedAccount);

    setAccount(result);
    setContacts(result.emergencyContacts?.length ? result.emergencyContacts : [{ ...emptyContact }]);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">MindBloom</Link>
      </div>

      <nav className={`nav ${menuOpen ? "active" : ""}`}>
        <Link to="/journal">Journaling</Link>
        <Link to="/calm">Exercises</Link>
        <Link to="/listen">2AM buddy</Link>
      </nav>

      {!account ? (
        <div className="auth-header-actions">
          <button
            className="auth-header-button"
            onClick={() => {
              setAuthMode("login");
              setAccountOpen(true);
            }}
          >
            Log in / Sign up
          </button>
        </div>
      ) : (
        <div className="account-user-chip">
          <button className="account-btn" onClick={() => setAccountOpen(true)}>
            <CiUser className="icon" />
          </button>

          <span className="account-user-name">{account.name.split(" ")[0]}</span>
        </div>
      )}

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {accountOpen && (
        <div className="account-modal-overlay" onClick={() => setAccountOpen(false)}>
          <div className="account-modal" onClick={(event) => event.stopPropagation()}>
            <button className="close-button" onClick={() => setAccountOpen(false)}>
              ✕
            </button>

            <h2>My Account</h2>
            <p className="account-modal-text">
              Make the account yourself, then add emergency contacts if you want the Trusted Contact option to appear in the help popup.
            </p>

            {!account ? (
              <>
                <div className="auth-toggle">
                  <button
                    className={authMode === "login" ? "active" : ""}
                    onClick={() => setAuthMode("login")}
                  >
                    Login
                  </button>
                  <button
                    className={authMode === "register" ? "active" : ""}
                    onClick={() => setAuthMode("register")}
                  >
                    Register
                  </button>
                </div>

                {authError && <p className="auth-error">{authError}</p>}

                {authMode === "login" ? (
                  <form className="auth-form" onSubmit={handleLogin}>
                    <input
                      type="email"
                      placeholder="Email"
                      value={loginForm.email}
                      onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                    />
                    <button type="submit" className="primary-button">
                      Log in
                    </button>
                  </form>
                ) : (
                  <form className="auth-form" onSubmit={handleRegister}>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={registerForm.lastName}
                      onChange={(event) => setRegisterForm({ ...registerForm, lastName: event.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="First Name"
                      value={registerForm.firstName}
                      onChange={(event) => setRegisterForm({ ...registerForm, firstName: event.target.value })}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={registerForm.email}
                      onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={registerForm.password}
                      onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                    />

                    <div className="role-row">
                      <label>
                        <input
                          type="radio"
                          name="role"
                          value="user"
                          checked={registerForm.role === "user"}
                          onChange={(event) => setRegisterForm({ ...registerForm, role: event.target.value })}
                        />
                        User
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="role"
                          value="psychologist"
                          checked={registerForm.role === "psychologist"}
                          onChange={(event) => setRegisterForm({ ...registerForm, role: event.target.value })}
                        />
                        Psychologist
                      </label>
                    </div>

                    {registerForm.role === "user" && (
                      <div className="contacts-box">
                        <div className="contacts-header">
                          <span>Emergency Contacts</span>
                          <button type="button" className="small-button" onClick={addContactField}>
                            + Add
                          </button>
                        </div>

                        {contacts.map((contact, index) => (
                          <div className="contact-row" key={`contact-${index}`}>
                            <input
                              type="text"
                              placeholder="Contact Name"
                              value={contact.name}
                              onChange={(event) => updateContact(index, "name", event.target.value)}
                            />
                            <input
                              type="tel"
                              placeholder="Phone Number"
                              value={contact.phone}
                              onChange={(event) => updateContact(index, "phone", event.target.value)}
                            />
                            {canDeleteContact(contact) && (
                              <button
                                type="button"
                                className="delete-contact-button"
                                onClick={() => removeContactField(index)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <button type="submit" className="primary-button">
                      Create Account
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="account-active">
                <p>
                  Conectat ca <strong>{account.name}</strong>
                </p>
                <p>Rol: {account.role === "user" ? "User" : "Psychologist"}</p>

                <div className="contacts-box contacts-edit-box">
                  <div className="contacts-header">
                    <span>Edit Profile</span>
                  </div>

                  <div className="contact-row">
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={account.lastName || ""}
                      onChange={(event) => updateProfileField("lastName", event.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="First Name"
                      value={account.firstName || ""}
                      onChange={(event) => updateProfileField("firstName", event.target.value)}
                    />
                    <button type="button" className="primary-button" onClick={saveProfile}>
                      Save Profile
                    </button>
                  </div>
                </div>

                {account.role === "user" && (
                  <div className="contacts-box contacts-edit-box">
                    <div className="contacts-header">
                      <span>Emergency Contacts</span>
                      <button type="button" className="small-button" onClick={addContactField}>
                        + Add
                      </button>
                    </div>

                    {contacts.map((contact, index) => (
                      <div className="contact-row" key={`edit-contact-${index}`}>
                        <input
                          type="text"
                          placeholder="Contact Name"
                          value={contact.name}
                          onChange={(event) => updateContact(index, "name", event.target.value)}
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={contact.phone}
                          onChange={(event) => updateContact(index, "phone", event.target.value)}
                        />
                        {canDeleteContact(contact) && (
                          <button
                            type="button"
                            className="delete-contact-button"
                            onClick={() => removeContactField(index)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}

                    <button type="button" className="primary-button" onClick={saveEmergencyContacts}>
                      Save Contacts
                    </button>
                  </div>
                )}

                <div className="profile-actions">
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                  <button className="delete-account-button" onClick={handleDeleteAccount}>
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;