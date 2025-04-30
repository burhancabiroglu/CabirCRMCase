import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Users',
    path: '/',
    icon: icon('ic-user'),
  },
  {
    title: 'Customers',
    path: '/customers',
    icon: icon('ic-analytics'),
  }
];
