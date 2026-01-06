import React from 'react';

const getColor = (percent: number, durability?: boolean): string => {
  if (durability) {
    if (percent > 60) return 'bg-green-400';
    if (percent > 40) return 'bg-yellow-400';
    if (percent > 20) return 'bg-orange-400';
    return 'bg-red-400';
  } else {
    if (percent > 75) return 'bg-red-400';
    if (percent > 50) return 'bg-orange-400';
    if (percent > 25) return 'bg-yellow-400';
    return 'bg-green-400';
  }
};

const WeightBar: React.FC<{ percent: number; durability?: boolean }> = ({ percent, durability }) => {
  const color = React.useMemo(() => getColor(percent, durability), [percent, durability]);

  return (
    <div className={`rounded-md mt-0.5 ${durability ? 'durability-bar' : 'weight-bar'}`}>
      <div
        className={`rounded-md ${color}`}
        style={{
          visibility: percent > 0 ? 'visible' : 'hidden',
          height: '100%',
          width: `${percent}%`,
          transition: `background ${0.3}s ease, width ${0.3}s ease`,
        }}
      ></div>
    </div>
  );
};

export default WeightBar;
