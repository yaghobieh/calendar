import type { TimeGutterHoursProps } from './TimeGutterHours.types';

export function TimeGutterHours(props: TimeGutterHoursProps) {
  const { hours, slotClassName } = props;

  return (
    <>
      {hours.map((label, hourIndex) => (
        <div key={hourIndex} className={slotClassName}>
          {label}
        </div>
      ))}
    </>
  );
}
