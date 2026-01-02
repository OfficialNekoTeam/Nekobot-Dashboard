import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Box from '@mui/material/Box';

// 图标大小映射
type IconSize = 'inherit' | 'small' | 'medium' | 'large';

const SIZE_MAP: Record<IconSize, number | string> = {
  inherit: 'inherit',
  small: 16,
  medium: 20,
  large: 24,
};

export interface RemixIconProps {
  /** 图标 class 名称，例如 'ri-home-line' */
  icon: string;
  /** 图标大小 */
  size?: IconSize | number;
  /** 颜色 */
  color?: string;
  /** 样式 */
  sx?: Record<string, any>;
  /** 类名 */
  className?: string;
}

/**
 * RemixIcon 图标组件
 *
 * @example
 * <RemixIcon icon="ri-home-line" size="medium" color="primary.main" />
 */
function RemixIcon({ icon, size = 'medium', color, sx = {}, className = '' }: RemixIconProps) {
  const fontSize = typeof size === 'number' ? size : SIZE_MAP[size] || SIZE_MAP.medium;

  const style = useMemo(
    () => ({
      fontFamily: 'remixicon',
      fontStyle: 'normal',
      fontVariant: 'normal',
      fontWeight: '400',
      lineHeight: 1,
      textTransform: 'none',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontSize,
      ...(color && { color }),
      ...sx,
    }),
    [fontSize, color, sx]
  );

  return (
    <i
      className={`${icon} ${className}`.trim()}
      style={style}
    />
  );
}

RemixIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.oneOf(['inherit', 'small', 'medium', 'large']), PropTypes.number]),
  color: PropTypes.string,
  sx: PropTypes.object,
  className: PropTypes.string,
};

export default RemixIcon;
