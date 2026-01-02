// assets
import RemixIcon from 'ui-component/RemixIcon';

// ==============================|| OVERRIDES - DATE PICKER ||============================== //

export default function DatePicker() {
  return {
    MuiDatePicker: {
      defaultProps: {
        slots: { openPickerIcon: () => <RemixIcon icon="ri-calendar-line" size={20} /> }
      }
    }
  };
}
