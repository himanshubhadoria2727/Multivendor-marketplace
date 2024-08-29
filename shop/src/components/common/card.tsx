import cn from 'classnames';
import { twMerge } from 'tailwind-merge';

type Props = {
  className?: string;
  [key: string]: unknown;
};
const Card: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(cn('rounded bg-light p-4 shadow md:p-5', className))}
      {...props}
    />
  );
};

export default Card;
