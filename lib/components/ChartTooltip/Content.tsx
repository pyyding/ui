import { cx } from "../common/utils";

type ContentProps = React.HTMLProps<HTMLDivElement>;

export const ChartTooltipContent: React.FC<ContentProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div
      className={cx("bg-gray-900 px-3 py-2 rounded-md", className)}
      {...rest}
    >
      {children}
    </div>
  );
};
