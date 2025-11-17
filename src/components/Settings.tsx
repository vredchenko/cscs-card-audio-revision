import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Statistics } from './Statistics';
import './Settings.css';

export function Settings() {
  const { settings, updateSettings, resetSession, resetAllData } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your current session score?')) {
      resetSession();
      setIsOpen(false);
    }
  };

  const handleResetAll = async () => {
    if (
      confirm(
        'Are you sure you want to reset ALL data? This will delete all your statistics, history, and settings. This cannot be undone!'
      )
    ) {
      await resetAllData();
      setIsOpen(false);
    }
  };

  const handleShowStats = () => {
    setShowStats(true);
    setIsOpen(false);
  };

  return (
    <div className="settings">
      <button
        className="btn-icon settings-toggle"
        onClick={toggleMenu}
        aria-label="Settings"
        aria-expanded={isOpen}
        title="Settings"
      >
        ⚙️
      </button>

      {isOpen && (
        <>
          <div className="settings-overlay" onClick={() => setIsOpen(false)} />
          <div className="settings-panel">
            <div className="settings-header">
              <h2>Settings</h2>
              <button
                className="btn-icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>

            <div className="settings-content">
              {/* Display Mode */}
              <div className="setting-group">
                <h3>Display Mode</h3>
                <div className="setting-options">
                  <label className="setting-option">
                    <input
                      type="radio"
                      name="displayMode"
                      value="normal"
                      checked={settings.displayMode === 'normal'}
                      onChange={(e) => updateSettings({ displayMode: e.target.value as 'normal' | 'dyslexia' })}
                    />
                    <span>Normal</span>
                  </label>
                  <label className="setting-option">
                    <input
                      type="radio"
                      name="displayMode"
                      value="dyslexia"
                      checked={settings.displayMode === 'dyslexia'}
                      onChange={(e) => updateSettings({ displayMode: e.target.value as 'normal' | 'dyslexia' })}
                    />
                    <span>Dyslexia-friendly</span>
                  </label>
                </div>
              </div>

              {/* Font Size */}
              <div className="setting-group">
                <h3>Font Size</h3>
                <div className="setting-options">
                  <label className="setting-option">
                    <input
                      type="radio"
                      name="fontSize"
                      value="small"
                      checked={settings.fontSize === 'small'}
                      onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
                    />
                    <span>Small</span>
                  </label>
                  <label className="setting-option">
                    <input
                      type="radio"
                      name="fontSize"
                      value="medium"
                      checked={settings.fontSize === 'medium'}
                      onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
                    />
                    <span>Medium</span>
                  </label>
                  <label className="setting-option">
                    <input
                      type="radio"
                      name="fontSize"
                      value="large"
                      checked={settings.fontSize === 'large'}
                      onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
                    />
                    <span>Large</span>
                  </label>
                </div>
              </div>

              {/* Font Family */}
              <div className="setting-group">
                <h3>Font Family</h3>
                <div className="setting-options">
                  <label className="setting-option">
                    <input
                      type="radio"
                      name="fontFamily"
                      value="system"
                      checked={settings.fontFamily === 'system'}
                      onChange={(e) => updateSettings({ fontFamily: e.target.value as any })}
                    />
                    <span>System Default</span>
                  </label>
                  <label className="setting-option">
                    <input
                      type="radio"
                      name="fontFamily"
                      value="opendyslexic"
                      checked={settings.fontFamily === 'opendyslexic'}
                      onChange={(e) => updateSettings({ fontFamily: e.target.value as any })}
                    />
                    <span>OpenDyslexic</span>
                  </label>
                  <label className="setting-option">
                    <input
                      type="radio"
                      name="fontFamily"
                      value="atkinson"
                      checked={settings.fontFamily === 'atkinson'}
                      onChange={(e) => updateSettings({ fontFamily: e.target.value as any })}
                    />
                    <span>Atkinson Hyperlegible</span>
                  </label>
                  <label className="setting-option">
                    <input
                      type="radio"
                      name="fontFamily"
                      value="lexend"
                      checked={settings.fontFamily === 'lexend'}
                      onChange={(e) => updateSettings({ fontFamily: e.target.value as any })}
                    />
                    <span>Lexend</span>
                  </label>
                  <label className="setting-option">
                    <input
                      type="radio"
                      name="fontFamily"
                      value="comic"
                      checked={settings.fontFamily === 'comic'}
                      onChange={(e) => updateSettings({ fontFamily: e.target.value as any })}
                    />
                    <span>Comic Sans</span>
                  </label>
                </div>
              </div>

              {/* Text-to-Speech */}
              <div className="setting-group">
                <h3>Text-to-Speech</h3>
                <label className="setting-toggle">
                  <input
                    type="checkbox"
                    checked={settings.ttsEnabled}
                    onChange={(e) => updateSettings({ ttsEnabled: e.target.checked })}
                  />
                  <span>Enable text-to-speech</span>
                </label>

                {settings.ttsEnabled && (
                  <>
                    <label className="setting-toggle">
                      <input
                        type="checkbox"
                        checked={settings.ttsAutoPlay}
                        onChange={(e) => updateSettings({ ttsAutoPlay: e.target.checked })}
                      />
                      <span>Auto-play (read automatically)</span>
                    </label>

                    <div className="setting-slider">
                      <label>
                        Speech Rate: {settings.ttsRate.toFixed(1)}x
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={settings.ttsRate}
                          onChange={(e) => updateSettings({ ttsRate: parseFloat(e.target.value) })}
                        />
                      </label>
                    </div>

                    <div className="setting-slider">
                      <label>
                        Volume: {Math.round(settings.ttsVolume * 100)}%
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={settings.ttsVolume}
                          onChange={(e) => updateSettings({ ttsVolume: parseFloat(e.target.value) })}
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Other Options */}
              <div className="setting-group">
                <h3>Other Options</h3>
                <label className="setting-toggle">
                  <input
                    type="checkbox"
                    checked={settings.showExplanations}
                    onChange={(e) => updateSettings({ showExplanations: e.target.checked })}
                  />
                  <span>Show explanations</span>
                </label>
              </div>

              {/* Actions */}
              <div className="setting-group">
                <h3>Actions</h3>
                <button
                  className="btn-primary btn-action"
                  onClick={handleShowStats}
                >
                  📊 View Statistics
                </button>
                <button
                  className="btn-secondary btn-action"
                  onClick={handleReset}
                >
                  Reset Session Score
                </button>
                <button
                  className="btn-secondary btn-action btn-danger"
                  onClick={handleResetAll}
                >
                  ⚠️ Reset All Data
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Statistics Modal */}
      {showStats && <Statistics onClose={() => setShowStats(false)} />}
    </div>
  );
}
