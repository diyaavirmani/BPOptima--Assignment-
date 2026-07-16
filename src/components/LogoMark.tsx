function LogoMark() {
  return (
    <svg
      className="brand-mark"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="brand-mark-disc" cx="32" cy="32" r="31" />
      <path
        className="brand-mark-stroke"
        d="M15.8 37.4a18.4 18.4 0 1 0 17.7-24.5"
      />
      <path className="brand-mark-stroke" d="M13.2 42.8h14.1" />
      <circle className="brand-mark-stroke" cx="31.5" cy="33.5" r="8.3" />
      <path className="brand-mark-stroke" d="M31.5 20.4v-8.2" />
      <path className="brand-mark-stroke" d="M21 23.7l-6.1-6.1" />
      <path className="brand-mark-stroke" d="M42.1 23.7l6.1-6.1" />
    </svg>
  );
}

export default LogoMark;
