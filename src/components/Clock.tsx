import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClockProps {
  variant?: 'large' | 'small';
}

const Clock = ({ variant = 'large' }: ClockProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (variant === 'small') {
    return (
      <div className="text-right">
        <p className="text-xl font-semibold text-foreground tracking-tight">
          {format(time, 'hh:mm:ss a')}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(time, "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-5xl font-bold text-foreground tracking-wider">
        {format(time, 'hh:mm:ss a')}
      </p>
      <p className="text-lg text-muted-foreground">
        {format(time, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
      </p>
    </div>
  );
};

export default Clock;