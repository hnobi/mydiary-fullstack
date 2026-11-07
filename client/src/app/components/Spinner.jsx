/**
 * @param {{ size?: number, color?: string }} props
 */
const Spinner = ({ size = 30, color = '#fff' }) => (
  <div className="loader">
    <span
      className="spinner"
      role="status"
      aria-label="Loading"
      style={{
        width: size, height: size, borderWidth: 3, color
      }}
    />
  </div>
);

export default Spinner;
