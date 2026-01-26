import { useSettingsStore, selectAccessibility } from '../../../stores/settingsStore';
import { RadixSlider } from '../../../components/common/RadixSlider';
import { Card, CardHeader, CardTitle } from '../../../components/common/Card';

export function AccessibilitySettingsPanel() {
  const accessibility = useSettingsStore(selectAccessibility);
  const updateAccessibility = useSettingsStore((state) => state.updateAccessibility);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accessibility</CardTitle>
      </CardHeader>
      <div className="settings-section">
        {/* Visual Only Mode */}
        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="visualOnly" className="setting-label">
              <SoundOffIcon />
              Visual-only mode
            </label>
            <p className="setting-description">
              Disable all sounds. Alerts will use visual indicators only.
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              id="visualOnly"
              checked={accessibility.visualOnly}
              onChange={(e) => updateAccessibility({ visualOnly: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Sound Volume */}
        {!accessibility.visualOnly && (
          <div className="setting-item">
            <div className="setting-info">
              <label className="setting-label">
                <VolumeIcon />
                Sound volume
              </label>
              <p className="setting-description">
                Adjust the volume of notification sounds.
              </p>
            </div>
            <div className="setting-slider">
              <RadixSlider
                value={[Math.round(accessibility.soundVolume * 100)]}
                onValueChange={(value) => updateAccessibility({ soundVolume: value[0] / 100 })}
                min={0}
                max={100}
                step={10}
              />
              <span className="slider-value">{Math.round(accessibility.soundVolume * 100)}%</span>
            </div>
          </div>
        )}

        {/* ADHD-Friendly Mode */}
        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="adhdMode" className="setting-label">
              <FocusIcon />
              ADHD-friendly mode
            </label>
            <p className="setting-description">
              Explicit stage transitions with clear announcements, always-visible cycle timeline, and minimal choices during peak focus.
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              id="adhdMode"
              checked={accessibility.adhdFriendlyMode}
              onChange={(e) => updateAccessibility({ adhdFriendlyMode: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* High Contrast Mode */}
        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="highContrast" className="setting-label">
              <ContrastIcon />
              High contrast mode
            </label>
            <p className="setting-description">
              Enhanced color contrast for better visibility (WCAG AA compliant).
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              id="highContrast"
              checked={accessibility.highContrastMode}
              onChange={(e) => updateAccessibility({ highContrastMode: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>
    </Card>
  );
}

function SoundOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FocusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ContrastIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2v20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
