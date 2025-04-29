import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  disabled?: boolean;
  transparent?: boolean;
};

export function Logo({
  sx,
  transparent = false,
  disabled,
  className,
  href = '/',
  ...other
}: LogoProps) {
  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Logo"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          height: 70,
          textDecoration: 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          backgroundColor: transparent ? 'transparent' : '#F2F3F5',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          py: 1.6,
          px: 1.5,
          width: '100%',
          height: '100%',
        }}
      >
        <Box
          component="img"
          alt="App Logo"
          src="/assets/logo.png"
          sx={{
            objectFit: 'contain',
            maxHeight: '100%',
            maxWidth: '100%',
            display: 'block',
          }}
        />
      </Box>
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
