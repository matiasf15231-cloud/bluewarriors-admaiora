import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="text-center">
      <p className="text-5xl font-bold text-foreground tracking-wider">
        {format(time, 'HH:mm:ss')}
      </p>
      <p className="text-lg text-muted-foreground">
        {format(time, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
      </p>
    </div>
  );
};

export default Clock;