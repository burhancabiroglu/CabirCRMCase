import { CONFIG } from 'src/config-global';

import { CustomersView } from '../sections/customers/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Customers - ${CONFIG.appName}`}</title>

      <CustomersView />
    </>
  );
}
