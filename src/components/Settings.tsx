import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import './Settings.css';

export function Settings() {
  const { settings, updateSettings, resetSession } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your score and start over?')) {
      resetSession();
      setIsOpen(false);
    }
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

              {/* Reset Button */}
              <div className="setting-group">
                <button
                  className="btn-secondary btn-reset"
                  onClick={handleReset}
                >
                  Reset Score
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
