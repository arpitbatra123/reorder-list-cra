import * as React from 'react';
import {Theme} from '@twilio-paste/core/theme';

const App: React.FC<any> = ({children}) => {
  return <Theme.Provider theme="twilio">{children}</Theme.Provider>;
};

App.displayName = 'App';

export default App;
