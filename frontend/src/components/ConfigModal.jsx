import { useState } from 'react'
import { X, Save, HelpCircle } from 'lucide-react'
import './ConfigModal.css'

function ConfigModal({ userId, onSave, onClose }) {
  const [inputValue, setInputValue] = useState(userId)
  const [showHelp, setShowHelp] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSave(inputValue.trim())
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Configuration Tuya</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">
              User ID Tuya
              <button
                type="button"
                className="help-btn"
                onClick={() => setShowHelp(!showHelp)}
              >
                <HelpCircle size={16} />
              </button>
            </label>
            <input
              type="text"
              id="userId"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Entrez votre User ID Tuya"
              className="form-input"
              required
            />
          </div>

          {showHelp && (
            <div className="help-box">
              <h3>Comment obtenir votre User ID ?</h3>
              <ol>
                <li>
                  Allez sur <a href="https://iot.tuya.com" target="_blank" rel="noopener noreferrer">iot.tuya.com</a>
                </li>
                <li>Connectez-vous avec votre compte Smart Life</li>
                <li>
                  Dans le menu, allez dans <strong>Cloud</strong> → <strong>Development</strong>
                </li>
                <li>Créez un projet si vous n'en avez pas</li>
                <li>
                  Allez dans <strong>Devices</strong> → <strong>Link Tuya App Account</strong>
                </li>
                <li>Scannez le QR code avec l'app Smart Life</li>
                <li>
                  Récupérez votre <strong>User ID</strong> dans la liste des utilisateurs
                </li>
              </ol>
              <p className="help-note">
                Vous devrez également configurer le fichier <code>.env</code> du backend avec vos identifiants Tuya.
              </p>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              <Save size={20} />
              Enregistrer
            </button>
          </div>
        </form>

        <div className="config-info">
          <h3>Configuration complète requise</h3>
          <p>
            Pour que l'application fonctionne, vous devez aussi configurer le fichier
            <code>backend/.env</code> avec vos identifiants Tuya IoT Platform.
          </p>
          <p>
            Consultez le fichier <code>README.md</code> pour les instructions détaillées.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConfigModal
