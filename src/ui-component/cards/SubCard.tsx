// material-ui
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode } from 'react';

// ==============================|| SUB CARD TYPES ||============================== //

export interface SubCardProps {
  children?: ReactNode | string;
  className?: string;
  content?: boolean;
  contentClass?: string;
  darkTitle?: boolean;
  secondary?: ReactNode | string;
  sx?: SxProps<Theme>;
  contentSX?: SxProps<Theme>;
  footerSX?: SxProps<Theme>;
  title?: ReactNode | string;
  actions?: ReactNode | string;
  [key: string]: any;
}

// ==============================|| CUSTOM SUB CARD ||============================== //

export default function SubCard({
  children,
  className,
  content = true,
  contentClass,
  darkTitle,
  secondary,
  sx = {},
  contentSX = {},
  footerSX = {},
  title,
  actions,
  ...others
}: SubCardProps) {
  const defaultShadow = '0 2px 14px 0 rgb(32 40 45 / 8%)';

  return (
    <Card
      sx={(theme) => ({
        border: '1px solid',
        borderColor: 'divider',
        ':hover': { boxShadow: defaultShadow },
        ...(typeof sx === 'function' ? sx(theme) : sx || {})
      })}
      {...others}
    >
      {/* card header and action */}
      {!darkTitle && title && <CardHeader sx={{ p: 2.5 }} title={<Typography variant="h5">{title}</Typography>} action={secondary} />}
      {darkTitle && title && <CardHeader sx={{ p: 2.5 }} title={<Typography variant="h4">{title}</Typography>} action={secondary} />}

      {/* content & header divider */}
      {title && <Divider />}

      {/* card content */}
      {content && (
        <CardContent sx={{ p: 2.5, ...contentSX }} className={contentClass || ''}>
          {children}
        </CardContent>
      )}
      {!content && children}

      {/* actions & footer divider */}
      {actions && <Divider />}

      {actions && <CardActions sx={{ p: 2.5, ...footerSX }}>{actions}</CardActions>}
    </Card>
  );
}
