import { useSettingsStore, selectNotifications, selectTheme } from '../../stores/settingsStore';
import { Card, CardHeader, CardTitle } from '../../components/common/Card';
import { AccessibilitySettingsPanel } from './components';

export function SettingsPage() {
  const notifications = useSettingsStore(selectNotifications);
  const theme = useSettingsStore(selectTheme);
  const updateNotifications = useSettingsStore((state) => state.updateNotifications);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const resetToDefaults = useSettingsStore((state) => state.resetToDefaults);

  return (
    <div className="page space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Customize your focus experience</p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <div className="settings-section">
          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="notifications" className="setting-label">
                Enable notifications
              </label>
              <p className="setting-description">
                Receive alerts for stage transitions and session events.
              </p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                id="notifications"
                checked={notifications.enabled}
                onChange={(e) => updateNotifications({ enabled: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {notifications.enabled && (
            <>
              <div className="setting-item">
                <div className="setting-info">
                  <label htmlFor="sound" className="setting-label">
                    Sound alerts
                  </label>
                  <p className="setting-description">
                    Play sounds for notifications.
                  </p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="sound"
                    checked={notifications.sound}
                    onChange={(e) => updateNotifications({ sound: e.target.checked })}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label htmlFor="browserNotif" className="setting-label">
                    Browser notifications
                  </label>
                  <p className="setting-description">
                    Show system notifications (requires permission).
                  </p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="browserNotif"
                    checked={notifications.browserNotifications}
                    onChange={(e) => updateNotifications({ browserNotifications: e.target.checked })}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <div className="settings-section">
          <div className="setting-item">
            <div className="setting-info">
              <label className="setting-label">Theme</label>
              <p className="setting-description">
                Choose your preferred color scheme.
              </p>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              className="setting-select"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Accessibility */}
      <AccessibilitySettingsPanel />

      {/* Reset */}
      <Card>
        <CardHeader>
          <CardTitle>Reset</CardTitle>
        </CardHeader>
        <div className="settings-section">
          <div className="setting-item">
            <div className="setting-info">
              <label className="setting-label">Reset to defaults</label>
              <p className="setting-description">
                Restore all settings to their original values.
              </p>
            </div>
            <button className="btn btn-danger btn-sm" onClick={resetToDefaults}>
              Reset All
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
