type Props = {
  className?: string;
  title?: string;
  details?: string | JSX.Element;
  icon?: React.ReactElement<any, any> | React.FunctionComponent<React.SVGAttributes<{}>>;
  [key: string]: unknown;
};

const Description: React.FC<Props> = ({
  title,
  details,
  icon: Icon, // Renaming the icon prop for clarity
  className,
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {title && (
        <h4 className="text-base font-semibold text-body-dark mb-2 flex items-center">
          {title}
          {Icon && (
            <span className="ml-2">
              {typeof Icon === 'function' ? <Icon /> : Icon} {/* Render the icon */}
            </span>
          )}
        </h4>
      )}
      {details && <p className="text-sm text-body">{details}</p>}
    </div>
  );
};

export default Description;
