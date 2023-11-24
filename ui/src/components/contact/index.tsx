export default function Contact() {
  return (
    <div>
      <h2>
        Component with environment variable used:{" "}
        {import.meta.env.VITE_VARIABLE_NAME}
      </h2>
    </div>
  );
}
