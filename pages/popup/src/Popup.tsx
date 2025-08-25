import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useState } from 'react';

const Popup = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex justify-between p-4">
      <span className="text-base text-gray-700">拡張機能のアイコンを表示</span>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative flex h-6 w-10 items-center rounded-full bg-gray-300 transition-colors 
          ${checked ? 'bg-green-500' : 'bg-gray-400'}`}>
        <div
          className={`size-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
