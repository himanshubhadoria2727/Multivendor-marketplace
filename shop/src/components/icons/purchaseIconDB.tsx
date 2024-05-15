export const PurchaseIconDB: React.FC<React.SVGAttributes<{}> & { color?: string }> = ({ color = "currentColor", ...props }) => {
    return (
      <svg
        fill={color}
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M12.655 0.125H3.34497C2.776 0.125003 2.22817 0.340559 1.81175 0.728271C1.39534 1.11598 1.14127 1.64706 1.10071 2.21457L0.297231 13.4646C0.2752 13.7728 0.316883 14.0822 0.41968 14.3736C0.522478 14.665 0.684187 14.932 0.894729 15.1582C1.10527 15.3843 1.36014 15.5647 1.64344 15.688C1.92674 15.8113 2.2324 15.875 2.54138 15.875H13.4586C13.7676 15.875 14.0733 15.8114 14.3566 15.688C14.6399 15.5647 14.8948 15.3844 15.1053 15.1582C15.3159 14.9321 15.4776 14.665 15.5804 14.3736C15.6832 14.0822 15.7249 13.7728 15.7029 13.4646L14.8993 2.21457C14.8587 1.64706 14.6046 1.11598 14.1882 0.728271C13.7718 0.340559 13.224 0.125003 12.655 0.125ZM7.99999 6.875C6.95609 6.87375 5.95529 6.45851 5.21714 5.72035C4.47899 4.9822 4.06374 3.98141 4.06249 2.9375C4.06249 2.78832 4.12176 2.64524 4.22725 2.53975C4.33273 2.43426 4.47581 2.375 4.62499 2.375C4.77418 2.375 4.91725 2.43426 5.02274 2.53975C5.12823 2.64524 5.18749 2.78832 5.18749 2.9375C5.18749 3.68342 5.48381 4.39879 6.01126 4.92624C6.5387 5.45368 7.25407 5.75 7.99999 5.75C8.74591 5.75 9.46129 5.45368 9.98873 4.92624C10.5162 4.39879 10.8125 3.68342 10.8125 2.9375C10.8125 2.78832 10.8718 2.64524 10.9772 2.53975C11.0827 2.43426 11.2258 2.375 11.375 2.375C11.5242 2.375 11.6673 2.43426 11.7727 2.53975C11.8782 2.64524 11.9375 2.78832 11.9375 2.9375C11.9362 3.98141 11.521 4.9822 10.7828 5.72035C10.0447 6.45851 9.0439 6.87375 7.99999 6.875Z"
          fill={color}
        />
      </svg>
    );
  };
  