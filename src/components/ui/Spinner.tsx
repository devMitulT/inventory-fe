interface CircularProgressLoaderProps {
  size?: number;
  color?: string;
}

const CircularProgressLoader: React.FC<CircularProgressLoaderProps> = ({ size, color }) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-t-transparent border-${color}`}
      style={{
        width: size,
        height: size,
      }}
    ></div>
  );
};

export default CircularProgressLoader;
