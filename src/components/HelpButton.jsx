import { useEffect, useMemo, useState } from "react";
import "./HelpButton.css";
import { getSessionAccount } from "../services/mockBackend";

export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState(() => getSessionAccount());
  const [selectedContact, setSelectedContact] = useState(() => {
    const currentAccount = getSessionAccount();
    return currentAccount?.role === "user" && currentAccount.emergencyContacts?.length
      ? currentAccount.emergencyContacts[0]
      : null;
  });

  useEffect(() => {
    const syncAccount = (event) => {
      const nextAccount = event?.detail ?? getSessionAccount();
      setAccount(nextAccount);
      setSelectedContact(
        nextAccount?.role === "user" && nextAccount.emergencyContacts?.length
          ? nextAccount.emergencyContacts[0]
          : null,
      );
    };

    window.addEventListener("mindcare-account-updated", syncAccount);
    window.addEventListener("storage", syncAccount);

    return () => {
      window.removeEventListener("mindcare-account-updated", syncAccount);
      window.removeEventListener("storage", syncAccount);
    };
  }, []);

  const emergencyContacts = useMemo(() => {
    return account?.role === "user" ? account.emergencyContacts || [] : [];
  }, [account]);

  const handleCallContact = (contact) => {
    if (!contact?.phone) {
      return;
    }

    window.location.href = `tel:${contact.phone}`;
  };

  return (
    <>
      <button className="help-button" onClick={() => setOpen(true)}>
        ❤️
      </button>

      {open && (
        <>
          <div className="help-overlay" onClick={() => setOpen(false)} />

          <div className="help-popup">
            <button className="close-button" onClick={() => setOpen(false)}>
              ✕
            </button>

            <h2>Do you need help?</h2>

            <p>
              If you feel you are in a difficult situation,
              you can call one of the options below.
            </p>

            <a href="tel:112" className="help-option emergency">
              🚨 Call 112
            </a>

            <a href="tel:0753353071" className="help-option support">
              💙 Call DepreHUB (24/7)
            </a>

            <a href="tel:0374461461" className="help-option teen">
              🧒 DepreHUB Teen Line
            </a>

            {emergencyContacts.length > 0 && (
              <div className="trusted-contact-box">
                <span className="trusted-label">Trusted Contact</span>
                <select
                  className="contact-select"
                  value={selectedContact?.phone || emergencyContacts[0]?.phone || ""}
                  onChange={(event) => {
                    const contact = emergencyContacts.find((item) => item.phone === event.target.value);
                    setSelectedContact(contact || null);
                  }}
                >
                  {emergencyContacts.map((contact) => (
                    <option key={contact.phone} value={contact.phone}>
                      {contact.name} — {contact.phone}
                    </option>
                  ))}
                </select>

                <button
                  className="help-option trusted"
                  onClick={() => handleCallContact(selectedContact)}
                  disabled={!selectedContact}
                >
                  👤 Call your selected contact
                </button>
              </div>
            )}

            <button className="help-option psychologist">
              🩺 Book an appointment with a psychologist
            </button>
          </div>
        </>
      )}
    </>
  );
}