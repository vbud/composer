import classNames from 'classnames';
import { default as NextLink } from 'next/link';
import * as styles from './Link.css';

export const Link = ({
  className,
  ...props
}: React.ComponentProps<typeof NextLink>) => (
  <NextLink className={classNames(styles.root, className)} {...props} />
);
